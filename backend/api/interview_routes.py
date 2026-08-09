from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from schemas.interview_schema import interview_setup_schema, send_message_schema
from services.interview_service import InterviewService

interview_bp = Blueprint('interview', __name__, url_prefix='/api/interviews')

@interview_bp.route('/start', methods=['POST'])
@jwt_required()
def start_interview():
    current_user_id = get_jwt_identity()
    payload = request.get_json() or {}

    try:
        data = interview_setup_schema.load(payload)
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'details': err.messages}), 400

    result = InterviewService.start_interview(current_user_id, data)
    if 'error' in result:
        return jsonify({'error': result['error'], 'session': result.get('session')}), result['status']

    return jsonify(result['session']), result['status']

@interview_bp.route('/active', methods=['GET'])
@jwt_required()
def get_active_session():
    current_user_id = get_jwt_identity()
    session = InterviewService.get_active_session_for_user(current_user_id)
    if not session:
        return jsonify({'session': None}), 200

    return jsonify({'session': session.to_dict()}), 200

@interview_bp.route('/<session_id>', methods=['GET'])
@jwt_required()
def get_session(session_id):
    session = InterviewService.get_session_by_id(session_id)
    if not session:
        return jsonify({'error': 'Interview session not found'}), 404

    return jsonify(session.to_dict()), 200

@interview_bp.route('/save', methods=['POST'])
@jwt_required()
def save_progress():
    current_user_id = get_jwt_identity()
    payload = request.get_json() or {}
    session_id = payload.get('interviewId')

    if not session_id:
        return jsonify({'error': 'interviewId is required'}), 400

    result = InterviewService.save_session_progress(session_id, current_user_id, payload)
    if 'error' in result:
        return jsonify({'error': result['error']}), result['status']

    return jsonify({'message': result['message'], 'session': result['session']}), 200

@interview_bp.route('/message', methods=['POST'])
@jwt_required()
def send_message():
    current_user_id = get_jwt_identity()
    payload = request.get_json() or {}

    try:
        data = send_message_schema.load(payload)
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'details': err.messages}), 400

    result = InterviewService.send_message(
        session_id=data['interviewId'],
        user_id=current_user_id,
        candidate_text=data['message'],
        is_voice_input=data.get('isVoiceInput', False)
    )

    if 'error' in result:
        return jsonify({'error': result['error']}), result['status']

    return jsonify({
        'evaluation': result['evaluation'],
        'nextQuestion': result['nextQuestion'],
        'isComplete': result['isComplete'],
        'session': result['session']
    }), 200

@interview_bp.route('/<session_id>/end', methods=['POST'])
@jwt_required()
def end_interview(session_id):
    current_user_id = get_jwt_identity()
    result = InterviewService.end_interview(session_id, current_user_id)

    if 'error' in result:
        return jsonify({'error': result['error']}), result['status']

    return jsonify(result['report']), result['status']
