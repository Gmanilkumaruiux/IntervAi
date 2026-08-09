from marshmallow import Schema, fields, validate

class RegisterSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=2, max=120))
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6))
    confirmPassword = fields.String(required=False)

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)

class UserResponseSchema(Schema):
    id = fields.String()
    name = fields.String()
    email = fields.String()
    role = fields.String()
    avatar = fields.String()
    streakDays = fields.Integer()
    completedDays = fields.Integer()
    totalDays = fields.Integer()
    createdAt = fields.String()

register_schema = RegisterSchema()
login_schema = LoginSchema()
user_response_schema = UserResponseSchema()
