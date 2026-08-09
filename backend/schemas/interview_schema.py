from marshmallow import Schema, fields, validate

class InterviewSetupSchema(Schema):
    candidateName = fields.String(required=False, default='Candidate')
    targetRole = fields.String(required=False, default='Senior AI Engineer')
    topic = fields.String(required=True)
    customTopics = fields.List(fields.String(), required=False)
    difficulty = fields.String(required=False, default='Intermediate')
    mode = fields.String(required=False, default='Technical')
    persona = fields.String(required=False, default='Senior AI Engineer')
    totalQuestions = fields.Integer(required=False, default=5)
    sourceDocuments = fields.List(fields.Dict(), required=False)
    speechSettings = fields.Dict(required=False)
    enableProctoring = fields.Boolean(required=False, default=True)

class SendMessageSchema(Schema):
    interviewId = fields.String(required=True)
    message = fields.String(required=True)
    isVoiceInput = fields.Boolean(required=False, default=False)

interview_setup_schema = InterviewSetupSchema()
send_message_schema = SendMessageSchema()
