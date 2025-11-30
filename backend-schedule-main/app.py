from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from core.database import db

# Import blueprints
from routes.user_routes import user_bp
from routes.task_routes import task_bp
from routes.constraint_routes import constraint_bp
from routes.schedule_routes import schedule_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    
    # Initialize database
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(user_bp)
    app.register_blueprint(task_bp)
    app.register_blueprint(constraint_bp)
    app.register_blueprint(schedule_bp)
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "ok", 
            "message": "Schedule.ai API is running",
            "version": "1.0.0"
        })
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            "message": "Welcome to Schedule.ai API",
            "endpoints": {
                "health": "/api/health",
                "users": "/api/users",
                "tasks": "/api/tasks",
                "constraints": "/api/constraints",
                "schedule": "/api/schedule"
            }
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Endpoint not found"}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)