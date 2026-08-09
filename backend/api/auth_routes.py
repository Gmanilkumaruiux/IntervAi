from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from schemas.auth_schema import register_schema, login_schema
from services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    payload = request.get_json() or {}
    try:
        data = register_schema.load(payload)
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'details': err.messages}), 400

    result = AuthService.register_user(
        name=data['name'],
        email=data['email'],
        password=data['password']
    )

    if 'error' in result:
        return jsonify({'error': result['error']}), result['status']

    return jsonify({
        'message': result['message'],
        'user': result['user'],
        'token': result['access_token']
    }), result['status']

@auth_bp.route('/login', methods=['POST'])
def login():
    payload = request.get_json() or {}
    try:
        data = login_schema.load(payload)
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'details': err.messages}), 400

    result = AuthService.login_user(
        email=data['email'],
        password=data['password']
    )

    if 'error' in result:
        return jsonify({'error': result['error']}), result['status']

    return jsonify({
        'message': result['message'],
        'user': result['user'],
        'token': result['access_token']
    }), result['status']

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = AuthService.get_user_by_id(current_user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({'user': user.to_dict()}), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200
