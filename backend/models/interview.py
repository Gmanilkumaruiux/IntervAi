import uuid
from datetime import datetime
from extensions import db

class InterviewSession(db.Model):
    __tablename__ = 'interview_sessions'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    candidate_name = db.Column(db.String(120), nullable=False)
    target_role = db.Column(db.String(120), nullable=False, default='Senior AI Engineer')
    topic = db.Column(db.String(120), nullable=False)
    custom_topics = db.Column(db.JSON, nullable=True, default=list)
    difficulty = db.Column(db.String(50), nullable=False, default='Intermediate')
    initial_difficulty = db.Column(db.String(50), nullable=False, default='Intermediate')
    mode = db.Column(db.String(50), nullable=False, default='Technical')
    persona = db.Column(db.String(100), nullable=False, default='Senior AI Engineer')
    total_questions = db.Column(db.Integer, nullable=False, default=5)
    current_question_index = db.Column(db.Integer, nullable=False, default=1)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(30), nullable=False, default='in_progress') # in_progress, completed
    current_score = db.Column(db.Integer, default=0)
    duration_seconds = db.Column(db.Integer, default=0)
    
    # JSON Fields for Rich Dynamic Data
    messages = db.Column(db.JSON, nullable=False, default=list)
    topics_covered = db.Column(db.JSON, nullable=True, default=list)
    covered_concepts = db.Column(db.JSON, nullable=True, default=list)
    missing_concepts = db.Column(db.JSON, nullable=True, default=list)
    source_documents = db.Column(db.JSON, nullable=True, default=list)
    speech_settings = db.Column(db.JSON, nullable=True, default=dict)
    difficulty_history = db.Column(db.JSON, nullable=True, default=list)
    integrity_logs = db.Column(db.JSON, nullable=True, default=list)
    enable_proctoring = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'candidateName': self.candidate_name,
            'targetRole': self.target_role,
            'topic': self.topic,
            'customTopics': self.custom_topics or [],
            'difficulty': self.difficulty,
            'initialDifficulty': self.initial_difficulty,
            'mode': self.mode,
            'persona': self.persona,
            'totalQuestions': self.total_questions,
            'currentQuestionIndex': self.current_question_index,
            'startedAt': self.started_at.isoformat() if self.started_at else None,
            'status': self.status,
            'messages': self.messages or [],
            'currentScore': self.current_score,
            'topicsCovered': self.topics_covered or [],
            'coveredConcepts': self.covered_concepts or [],
            'missingConcepts': self.missing_concepts or [],
            'durationSeconds': self.duration_seconds,
            'sourceDocuments': self.source_documents or [],
            'speechSettings': self.speech_settings or {
                'enabled': True,
                'gender': 'Female',
                'accent': 'US',
                'rate': 1.0,
                'isMuted': False
            },
            'difficultyHistory': self.difficulty_history or [],
            'enableProctoring': self.enable_proctoring,
            'integrityLogs': self.integrity_logs or []
        }
