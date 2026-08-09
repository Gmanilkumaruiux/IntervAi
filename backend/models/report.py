import uuid
from datetime import datetime
from extensions import db

class InterviewReport(db.Model):
    __tablename__ = 'interview_reports'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    interview_id = db.Column(db.String(36), db.ForeignKey('interview_sessions.id'), nullable=False, index=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    candidate_name = db.Column(db.String(120), nullable=False)
    target_role = db.Column(db.String(120), nullable=False, default='Senior AI Engineer')
    topic = db.Column(db.String(120), nullable=False)
    difficulty = db.Column(db.String(50), nullable=False, default='Intermediate')
    persona = db.Column(db.String(100), nullable=False, default='Senior AI Engineer')
    date = db.Column(db.String(30), nullable=False)
    overall_score = db.Column(db.Integer, nullable=False, default=85)
    duration_minutes = db.Column(db.Integer, nullable=False, default=15)
    hiring_recommendation = db.Column(db.String(50), nullable=False, default='Strong Hire')
    persona_verdict = db.Column(db.Text, nullable=False)

    # JSON Structure for Detailed Analytics & Roadmaps
    category_scores = db.Column(db.JSON, nullable=False, default=list)
    question_evaluations = db.Column(db.JSON, nullable=False, default=list)
    strengths = db.Column(db.JSON, nullable=False, default=list)
    growth_areas = db.Column(db.JSON, nullable=False, default=list)
    integrity_summary = db.Column(db.JSON, nullable=True, default=dict)
    learning_roadmap = db.Column(db.JSON, nullable=True, default=dict)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'interviewId': self.interview_id,
            'userId': self.user_id,
            'candidateName': self.candidate_name,
            'targetRole': self.target_role,
            'topic': self.topic,
            'difficulty': self.difficulty,
            'persona': self.persona,
            'date': self.date,
            'overallScore': self.overall_score,
            'durationMinutes': self.duration_minutes,
            'hiringRecommendation': self.hiring_recommendation,
            'personaVerdict': self.persona_verdict,
            'categoryScores': self.category_scores or [],
            'questionEvaluations': self.question_evaluations or [],
            'strengths': self.strengths or [],
            'growthAreas': self.growth_areas or [],
            'integritySummary': self.integrity_summary or {},
            'learningRoadmap': self.learning_roadmap
        }
