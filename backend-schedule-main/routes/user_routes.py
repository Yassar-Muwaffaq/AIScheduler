from flask import Blueprint, request, jsonify
from services.user_service import UserService

user_bp = Blueprint('users', __name__, url_prefix='/api/users')

@user_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'name']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"{field} is required"}), 400
        
        result = UserService.create_user(data)
        return jsonify(result), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_bp.route('/login', methods=['POST'])
def login():
    """Login user (simple version without JWT)"""
    try:
        data = request.get_json()
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "email and password are required"}), 400
        
        result = UserService.authenticate_user(email, password)
        
        if not result:
            return jsonify({"error": "Invalid email or password"}), 401
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get user profile"""
    try:
        user = UserService.get_user_by_id(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update user profile"""
    try:
        data = request.get_json()
        result = UserService.update_user(user_id, data)
        if not result:
            return jsonify({"error": "User not found"}), 404
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete user account"""
    try:
        result = UserService.delete_user(user_id)
        if not result:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_bp.route('/<int:user_id>/stats', methods=['GET'])
def get_user_stats(user_id):
    """Get user statistics (tasks count, schedules, etc.)"""
    try:
        stats = UserService.get_user_stats(user_id)
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500