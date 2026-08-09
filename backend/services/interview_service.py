from datetime import datetime
from extensions import db
from models.interview import InterviewSession
from models.report import InterviewReport
from services.ai_question_generator import AIQuestionGeneratorService

class InterviewService:
    @staticmethod
    def get_active_session_for_user(user_id: str) -> InterviewSession | None:
        return InterviewSession.query.filter_by(user_id=user_id, status='in_progress').first()

    @staticmethod
    def get_session_by_id(session_id: str) -> InterviewSession | None:
        return InterviewSession.query.get(session_id)

    @staticmethod
    def start_interview(user_id: str, payload: dict) -> dict:
        # Check if user already has an active interview in progress
        existing_active = InterviewSession.query.filter_by(user_id=user_id, status='in_progress').first()
        if existing_active:
            return {
                'error': f"You already have an ongoing interview on '{existing_active.topic}'. Please complete or end it before starting a new one.",
                'session': existing_active.to_dict(),
                'status': 400
            }

        candidate_name = payload.get('candidateName', 'Candidate')
        target_role = payload.get('targetRole', 'Senior AI Engineer')
        topic = payload.get('topic', 'Agentic AI')
        difficulty = payload.get('difficulty', 'Intermediate')
        mode = payload.get('mode', 'Technical')
        persona = payload.get('persona', 'Senior AI Engineer')
        total_questions = payload.get('totalQuestions', 5)

        # Generate initial AI question
        initial_question = AIQuestionGeneratorService.generate_question(
            topic=topic,
            difficulty=difficulty,
            persona=persona,
            previous_questions=[]
        )

        session = InterviewSession(
            user_id=user_id,
            candidate_name=candidate_name,
            target_role=target_role,
            topic=topic,
            custom_topics=payload.get('customTopics', []),
            difficulty=difficulty,
            initial_difficulty=difficulty,
            mode=mode,
            persona=persona,
            total_questions=total_questions,
            current_question_index=1,
            status='in_progress',
            messages=[initial_question],
            topics_covered=[topic],
            source_documents=payload.get('sourceDocuments', []),
            speech_settings=payload.get('speechSettings', {}),
            difficulty_history=[{'questionNumber': 1, 'difficulty': difficulty, 'score': 0}],
            enable_proctoring=payload.get('enableProctoring', True)
        )

        db.session.add(session)
        db.session.commit()

        return {
            'message': 'Interview started successfully',
            'session': session.to_dict(),
            'status': 201
        }

    @staticmethod
    def save_session_progress(session_id: str, user_id: str, updates: dict) -> dict:
        session = InterviewSession.query.filter_by(id=session_id, user_id=user_id).first()
        if not session:
            return {'error': 'Interview session not found', 'status': 404}

        if 'durationSeconds' in updates:
            session.duration_seconds = updates['durationSeconds']
        if 'speechSettings' in updates:
            session.speech_settings = updates['speechSettings']
        if 'integrityLogs' in updates:
            session.integrity_logs = updates['integrityLogs']
        if 'currentQuestionIndex' in updates:
            session.current_question_index = updates['currentQuestionIndex']

        session.updated_at = datetime.utcnow()
        db.session.commit()

        return {'message': 'Session state auto-saved successfully', 'session': session.to_dict(), 'status': 200}

    @staticmethod
    def send_message(session_id: str, user_id: str, candidate_text: str, is_voice_input: bool = False) -> dict:
        session = InterviewSession.query.filter_by(id=session_id, user_id=user_id).first()
        if not session:
            return {'error': 'Session not found', 'status': 404}

        if session.status == 'completed':
            return {'error': 'This interview session has already been completed.', 'status': 400}

        # 1. Append candidate message
        cand_msg = {
            'id': f"msg-cand-{datetime.now().timestamp()}",
            'sender': 'candidate',
            'text': candidate_text,
            'timestamp': datetime.now().strftime('%I:%M %p')
        }

        # Find latest AI question text for evaluation
        previous_ai_messages = [m for m in session.messages if m['sender'] == 'ai']
        latest_q_text = previous_ai_messages[-1]['text'] if previous_ai_messages else session.topic

        # 2. Evaluate answer
        eval_result = AIQuestionGeneratorService.evaluate_answer(
            answer_text=candidate_text,
            question_text=latest_q_text,
            difficulty=session.difficulty
        )

        cand_msg['evaluation'] = eval_result

        # Update score running average
        prev_scores = [m['evaluation']['score'] for m in session.messages if m['sender'] == 'candidate' and 'evaluation' in m]
        all_scores = prev_scores + [eval_result['score']]
        avg_score = int(sum(all_scores) / len(all_scores))
        session.current_score = avg_score

        session.messages = session.messages + [cand_msg]

        # 3. Check if interview completed or generate next question
        is_complete = session.current_question_index >= session.total_questions

        next_q = None
        if not is_complete:
            session.current_question_index += 1

            # Generate follow-up or next unique question
            previous_questions = [m['text'] for m in session.messages if m['sender'] == 'ai']
            if len(session.messages) % 2 == 0:
                next_q = AIQuestionGeneratorService.generate_followup(candidate_text, session.topic, session.difficulty)
            else:
                next_q = AIQuestionGeneratorService.generate_question(session.topic, session.difficulty, session.persona, previous_questions)

            session.messages = session.messages + [next_q]
            session.difficulty_history = (session.difficulty_history or []) + [{
                'questionNumber': session.current_question_index,
                'difficulty': session.difficulty,
                'score': eval_result['score']
            }]

        db.session.commit()

        return {
            'evaluation': eval_result,
            'nextQuestion': next_q,
            'isComplete': is_complete,
            'session': session.to_dict(),
            'status': 200
        }

    @staticmethod
    def end_interview(session_id: str, user_id: str) -> dict:
        session = InterviewSession.query.filter_by(id=session_id, user_id=user_id).first()
        if not session:
            return {'error': 'Session not found', 'status': 404}

        session.status = 'completed'
        session.updated_at = datetime.utcnow()

        # Calculate final overall score
        cand_evals = [m['evaluation'] for m in session.messages if m['sender'] == 'candidate' and 'evaluation' in m]
        scores = [e['score'] for e in cand_evals]
        overall_score = int(sum(scores) / len(scores)) if scores else 82

        # Recommendation
        if overall_score >= 85:
            recommendation = 'Strong Hire'
        elif overall_score >= 75:
            recommendation = 'Hire'
        else:
            recommendation = 'Needs Improvement'

        # Generate Report
        date_str = datetime.now().strftime('%b %d, %Y')
        duration_mins = max(1, session.duration_seconds // 60)

        report = InterviewReport(
            interview_id=session.id,
            user_id=user_id,
            candidate_name=session.candidate_name,
            target_role=session.target_role,
            topic=session.topic,
            difficulty=session.difficulty,
            persona=session.persona,
            date=date_str,
            overall_score=overall_score,
            duration_minutes=duration_mins,
            hiring_recommendation=recommendation,
            persona_verdict=f"Candidate demonstrated solid technical competency in {session.topic} with clear problem-solving methodology.",
            category_scores=[
                {'category': 'Technical Knowledge', 'score': overall_score},
                {'category': 'Problem Solving', 'score': min(100, overall_score + 3)},
                {'category': 'Communication', 'score': max(60, overall_score - 4)},
                {'category': 'Architecture & Design', 'score': overall_score}
            ],
            question_evaluations=[
                {
                    'questionNumber': idx + 1,
                    'questionText': m.get('text', ''),
                    'candidateAnswer': session.messages[idx*2 + 1]['text'] if (idx*2 + 1) < len(session.messages) else '',
                    'score': cand_evals[idx]['score'] if idx < len(cand_evals) else 80,
                    'feedback': cand_evals[idx]['feedback'] if idx < len(cand_evals) else 'Good'
                }
                for idx, m in enumerate([msg for msg in session.messages if msg['sender'] == 'ai'][:session.total_questions])
            ],
            strengths=[f"Strong conceptual understanding of {session.topic}", "Clear structured articulation"],
            growth_areas=["Deep dive into edge-case latency SLAs", "Production deployment patterns"],
            integrity_summary={
                'score': 100,
                'riskLevel': 'Low',
                'metrics': {'tabSwitchCount': 0, 'focusLossCount': 0, 'pasteCount': 0}
            },
            learning_roadmap={
                'id': f"roadmap-{session.id}",
                'interviewTopic': session.topic,
                'overallProgressPercentage': 0,
                'estimatedCompletionTime': '14 Hours (7 Days)',
                'skillsToImprove': [
                    {
                        'id': 'skill-1',
                        'skillName': f"{session.topic} Advanced Patterns",
                        'priority': 'High',
                        'recommendedTopics': ['Concurrency', 'Distributed Locks'],
                        'practiceQuestions': [f"How do you benchmark {session.topic} bottlenecks?"],
                        'resources': [{'title': 'Official Documentation', 'url': 'https://docs.python.org', 'type': 'docs'}]
                    }
                ],
                'studyPlanTimeline': [
                    {'dayRange': 'Day 1-2', 'title': 'Theory Deep Dive', 'completed': False, 'tasks': ['Review architectural papers']}
                ]
            }
        )

        db.session.add(report)
        db.session.commit()

        return {
            'message': 'Interview completed successfully',
            'report': report.to_dict(),
            'status': 200
        }
