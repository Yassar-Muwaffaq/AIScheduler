from flask import Blueprint, request, jsonify
from services.schedule_service import ScheduleService

schedule_bp = Blueprint('schedule', __name__, url_prefix='/api/schedule')

@schedule_bp.route('/generate/<int:user_id>', methods=['POST'])
def generate_schedule(user_id):
    """
    Generate weekly schedule for a user based on tasks and constraints.
    This will run the CSP solver and create/update schedules.
    """
    try:
        result = ScheduleService.generate_weekly_schedule(user_id)
        
        if not result.get('success', False):
            return jsonify(result), 400
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500


@schedule_bp.route('/<int:user_id>', methods=['GET'])
def get_user_schedule(user_id):
    """Get the current week's schedule for a user"""
    try:
        schedule = ScheduleService.get_user_weekly_schedule(user_id)
        return jsonify(schedule), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@schedule_bp.route('/today/<int:user_id>', methods=['GET'])
def get_today_schedule(user_id):
    """Get today's schedule for a user"""
    try:
        schedule = ScheduleService.get_today_schedule(user_id)
        return jsonify(schedule), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@schedule_bp.route('/day/<int:user_id>/<string:day>', methods=['GET'])
def get_day_schedule(user_id, day):
    """Get schedule for a specific day"""
    try:
        schedule = ScheduleService.get_day_schedule(user_id, day)
        return jsonify(schedule), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@schedule_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user_schedule(user_id):
    """Delete all schedules for a user (useful before regenerating)"""
    try:
        result = ScheduleService.delete_user_schedules(user_id)
        return jsonify({"message": "Schedules deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@schedule_bp.route('/item/<int:schedule_id>', methods=['DELETE'])
def delete_schedule_item(schedule_id):
    """Delete a specific schedule item"""
    try:
        result = ScheduleService.delete_schedule_item(schedule_id)
        if not result:
            return jsonify({"error": "Schedule item not found"}), 404
        return jsonify({"message": "Schedule item deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@schedule_bp.route('/conflicts/<int:user_id>', methods=['GET'])
def check_conflicts(user_id):
    """Check for scheduling conflicts before generating"""
    try:
        conflicts = ScheduleService.check_scheduling_conflicts(user_id)
        return jsonify(conflicts), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@schedule_bp.route('/deadlines/<int:user_id>', methods=['GET'])
def get_upcoming_deadlines(user_id):
    """Get upcoming deadlines from scheduled tasks"""
    try:
        days = request.args.get('days', 7, type=int)
        deadlines = ScheduleService.get_upcoming_deadlines(user_id, days)
        return jsonify({"deadlines": deadlines}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500