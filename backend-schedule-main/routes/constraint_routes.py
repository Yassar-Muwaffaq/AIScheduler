from flask import Blueprint, request, jsonify
from services.constraint_service import ConstraintService

constraint_bp = Blueprint('constraints', __name__, url_prefix='/api/constraints')

# ================== GLOBAL CONSTRAINTS ==================

@constraint_bp.route('/global', methods=['POST'])
def create_global_constraint():
    """Create a new global constraint"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({"error": "user_id is required"}), 400
        
        result = ConstraintService.create_global_constraint(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@constraint_bp.route('/global/<int:user_id>', methods=['GET'])
def get_global_constraints(user_id):
    """Get all global constraints for a user"""
    try:
        constraints = ConstraintService.get_user_global_constraints(user_id)
        return jsonify({"constraints": constraints}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@constraint_bp.route('/global/<int:constraint_id>', methods=['PUT'])
def update_global_constraint(constraint_id):
    """Update a global constraint"""
    try:
        data = request.get_json()
        result = ConstraintService.update_global_constraint(constraint_id, data)
        if not result:
            return jsonify({"error": "Constraint not found"}), 404
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@constraint_bp.route('/global/<int:constraint_id>', methods=['DELETE'])
def delete_global_constraint(constraint_id):
    """Delete a global constraint"""
    try:
        result = ConstraintService.delete_global_constraint(constraint_id)
        if not result:
            return jsonify({"error": "Constraint not found"}), 404
        return jsonify({"message": "Global constraint deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================== TASK CONSTRAINTS ==================

@constraint_bp.route('/task', methods=['POST'])
def create_task_constraint():
    """Create a new task constraint"""
    try:
        data = request.get_json()
        task_id = data.get('task_id')
        
        if not task_id:
            return jsonify({"error": "task_id is required"}), 400
        
        result = ConstraintService.create_task_constraint(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@constraint_bp.route('/task/<int:task_id>', methods=['GET'])
def get_task_constraints(task_id):
    """Get all constraints for a specific task"""
    try:
        constraints = ConstraintService.get_task_constraints(task_id)
        return jsonify({"constraints": constraints}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@constraint_bp.route('/task/constraint/<int:constraint_id>', methods=['PUT'])
def update_task_constraint(constraint_id):
    """Update a task constraint"""
    try:
        data = request.get_json()
        result = ConstraintService.update_task_constraint(constraint_id, data)
        if not result:
            return jsonify({"error": "Constraint not found"}), 404
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@constraint_bp.route('/task/constraint/<int:constraint_id>', methods=['DELETE'])
def delete_task_constraint(constraint_id):
    """Delete a task constraint"""
    try:
        result = ConstraintService.delete_task_constraint(constraint_id)
        if not result:
            return jsonify({"error": "Constraint not found"}), 404
        return jsonify({"message": "Task constraint deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@constraint_bp.route('/user/<int:user_id>', methods=['GET'])
def get_all_user_constraints(user_id):
    """Get all constraints (global + task-based) for a user"""
    try:
        result = ConstraintService.get_all_user_constraints(user_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500