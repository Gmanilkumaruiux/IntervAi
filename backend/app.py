import os
from flask import Flask, jsonify
from config import config_by_name
from extensions import db, bcrypt, jwt, cors, migrate, ma

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # Initialize Extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    migrate.init_app(app, db)
    ma.init_app(app)

    # Register Blueprints
    from api.auth_routes import auth_bp
    from api.interview_routes import interview_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(interview_bp)

    # Global Error Handlers
    @app.errorhandler(404)
    def handle_not_found(e):
        return jsonify({'error': 'Resource not found', 'status': 404}), 404

    @app.errorhandler(500)
    def handle_server_error(e):
        return jsonify({'error': 'Internal server error', 'status': 500}), 500

    @jwt.unauthorized_loader
    def handle_unauthorized(reason):
        return jsonify({'error': 'Missing or invalid authentication token', 'reason': reason}), 401

    @jwt.expired_token_loader
    def handle_expired_token(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired. Please log in again.'}), 401

    # Healthcheck Route
    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({
            'status': 'healthy',
            'service': 'IntervAI Flask Backend Service',
            'version': '2.4.0'
        }), 200

    # Auto-create tables in development mode if database does not exist
    with app.app_context():
        try:
            db.create_all()
        except Exception as err:
            app.logger.warning(f"DB auto-create warning: {err}")

    return app

if __name__ == '__main__':
    app = create_app('development')
    port = int(os.getenv('PORT', 5000))
    print(f"\n=======================================================")
    print(f"🚀 IntervAI Flask Backend Running on Network!")
    print(f"➜ Local:   http://localhost:{port}/api/health")
    print(f"➜ Network: http://0.0.0.0:{port}/api/health")
    print(f"=======================================================\n")
    app.run(host='0.0.0.0', port=port, debug=True)
