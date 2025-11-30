from flask import Blueprint, request, jsonify
from services.task_service import TaskService
from datetime import datetime

task_bp = Blueprint('tasks', __name__, url_prefix='/api/tasks')

@task_bp.route('/', methods=['POST'])
def create_task():
    """Create a new task (fixed or flex)"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({"error": "user_id is required"}), 400
        
        result = TaskService.create_task(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@task_bp.route('/<int:user_id>', methods=['GET'])
def get_user_tasks(user_id):
    """Get all tasks for a user"""
    try:
        tasks = TaskService.get_user_tasks(user_id)
        return jsonify({"tasks": tasks}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@task_bp.route('/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """Get a specific task by ID"""
    try:
        task = TaskService.get_task_by_id(task_id)
        if not task:
            return jsonify({"error": "Task not found"}), 404
        return jsonify(task), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@task_bp.route('/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Update a task"""
    try:
        data = request.get_json()
        result = TaskService.update_task(task_id, data)
        if not result:
            return jsonify({"error": "Task not found"}), 404
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@task_bp.route('/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task"""
    try:
        result = TaskService.delete_task(task_id)
        if not result:
            return jsonify({"error": "Task not found"}), 404
        return jsonify({"message": "Task deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@task_bp.route('/fixed/<int:user_id>', methods=['GET'])
def get_fixed_tasks(user_id):
    """Get all fixed tasks for a user"""
    try:
        tasks = TaskService.get_fixed_tasks(user_id)
        return jsonify({"tasks": tasks}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@task_bp.route('/flex/<int:user_id>', methods=['GET'])
def get_flex_tasks(user_id):
    """Get all flexible tasks for a user"""
    try:
        tasks = TaskService.get_flex_tasks(user_id)
        return jsonify({"tasks": tasks}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@task_bp.route('/upcoming/<int:user_id>', methods=['GET'])
def get_upcoming_deadlines(user_id):
    """Get tasks with upcoming deadlines"""
    try:
        days = request.args.get('days', 7, type=int)
        tasks = TaskService.get_tasks_with_deadlines(user_id, days)
        return jsonify({"tasks": tasks}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500