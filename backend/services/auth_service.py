from flask_jwt_extended import create_access_token
from extensions import db
from models.user import User

class AuthService:
    @staticmethod
    def register_user(name: str, email: str, password: str, role: str = 'candidate') -> dict:
        normalized_email = email.strip().lower()
        existing_user = User.query.filter_by(email=normalized_email).first()
        
        if existing_user:
            return {
                'error': 'An account with this email address already exists. Please log in.',
                'status': 400
            }

        user = User(
            name=name.strip(),
            email=normalized_email,
            role=role,
            avatar=f"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
        )
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        access_token = create_access_token(identity=user.id)

        return {
            'message': 'Account registered successfully',
            'user': user.to_dict(),
            'access_token': access_token,
            'status': 201
        }

    @staticmethod
    def login_user(email: str, password: str) -> dict:
        normalized_email = email.strip().lower()
        user = User.query.filter_by(email=normalized_email).first()

        if not user:
            return {
                'error': 'Account not found. Please register first.',
                'status': 404
            }

        if not user.check_password(password):
            return {
                'error': 'Invalid email or password. Please check your credentials.',
                'status': 401
            }

        access_token = create_access_token(identity=user.id)

        return {
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token,
            'status': 200
        }

    @staticmethod
    def get_user_by_id(user_id: str) -> User | None:
        return User.query.get(user_id)
