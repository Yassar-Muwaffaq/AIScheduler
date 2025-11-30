from datetime import datetime, timedelta
from sqlalchemy import and_
from core.database import db

from models.schedule_model import Schedule
from models.task_model import Task
from models.user_model import User


class ScheduleService:

    # ==========================================================
    # GET WEEKLY SCHEDULE (YANG DIMINTA)
    # ==========================================================
    @staticmethod
    def get_user_weekly_schedule(user_id):
        """
        Mengembalikan jadwal 1 minggu penuh, dikelompokkan per-hari.
        Format hasil:
        {
            "monday": [...],
            "tuesday": [...],
            ...
            "sunday": [...]
        }
        """

        days_order = [
            "monday", "tuesday", "wednesday", "thursday",
            "friday", "saturday", "sunday"
        ]

        # Ambil semua schedule user
        schedules = Schedule.query.filter_by(user_id=user_id).order_by(
            Schedule.day.asc(),
            Schedule.start_time.asc()
        ).all()

        # Siapkan dict kosong per hari
        weekly = {day: [] for day in days_order}

        # Isi ke dalam list per hari
        for s in schedules:
            item = {
                "id": s.id,
                "task_id": s.task_id,
                "task_name": s.task.name if s.task else None,
                "start_time": s.start_time.strftime("%H:%M"),
                "end_time": s.end_time.strftime("%H:%M")
            }
            day = s.day.lower()

            if day in weekly:
                weekly[day].append(item)

        return {"success": True, "weekly": weekly}

    # ==========================================================
    # GET BY USER (existing)
    # ==========================================================
    @staticmethod
    def get_schedule_by_id(user_id):
        try:
            schedules = Schedule.query.filter_by(user_id=user_id).order_by(
                Schedule.day.asc(),
                Schedule.start_time.asc()
            ).all()

            if not schedules:
                return {
                    "success": False,
                    "message": "No schedule found for this user."
                }

            result = [
                {
                    "id": s.id,
                    "task_id": s.task_id,
                    "task_name": s.task.name if s.task else None,
                    "day": s.day,
                    "start_time": s.start_time.strftime("%H:%M"),
                    "end_time": s.end_time.strftime("%H:%M")
                }
                for s in schedules
            ]

            return {"success": True, "schedule": result}

        except Exception as e:
            return {"success": False, "error": str(e)}

    # ==========================================================
    # GET TODAY
    # ==========================================================
    @staticmethod
    def get_today_schedule(user_id):
        today = datetime.now().strftime("%A").lower()

        schedules = Schedule.query.filter_by(user_id=user_id, day=today).order_by(
            Schedule.start_time.asc()
        ).all()

        return [
            {
                "id": s.id,
                "task_name": s.task.name if s.task else None,
                "start_time": s.start_time.strftime("%H:%M"),
                "end_time": s.end_time.strftime("%H:%M")
            }
            for s in schedules
        ]

    # ==========================================================
    # GET SPECIFIC DAY
    # ==========================================================
    @staticmethod
    def get_day_schedule(user_id, day):
        schedules = Schedule.query.filter_by(user_id=user_id, day=day.lower()).order_by(
            Schedule.start_time.asc()
        ).all()

        return [
            {
                "id": s.id,
                "task_name": s.task.name if s.task else None,
                "start_time": s.start_time.strftime("%H:%M"),
                "end_time": s.end_time.strftime("%H:%M")
            }
            for s in schedules
        ]

    # ==========================================================
    # DELETE ALL USER SCHEDULES
    # ==========================================================
    @staticmethod
    def delete_user_schedules(user_id):
        deleted = Schedule.query.filter_by(user_id=user_id).delete()
        db.session.commit()
        return deleted > 0

    # ==========================================================
    # DELETE ONE ITEM
    # ==========================================================
    @staticmethod
    def delete_schedule_item(schedule_id):
        schedule = Schedule.query.get(schedule_id)
        if not schedule:
            return False

        db.session.delete(schedule)
        db.session.commit()
        return True

    # ==========================================================
    # CHECK CONFLICTS
    # ==========================================================
    @staticmethod
    def check_scheduling_conflicts(user_id):
        schedules = Schedule.query.filter_by(user_id=user_id).all()

        conflicts = []
        schedules_sorted = sorted(schedules, key=lambda s: (s.day, s.start_time))

        for i in range(len(schedules_sorted) - 1):
            curr = schedules_sorted[i]
            next_item = schedules_sorted[i + 1]

            # terjadi overlap
            if curr.day == next_item.day and curr.end_time > next_item.start_time:
                conflicts.append({
                    "day": curr.day,
                    "conflict_between": [
                        curr.task.name if curr.task else curr.id,
                        next_item.task.name if next_item.task else next_item.id
                    ]
                })

        return conflicts

    # ==========================================================
    # UPCOMING DEADLINES
    # ==========================================================
    @staticmethod
    def get_upcoming_deadlines(user_id, days=7):
        today = datetime.now()
        end_date = today + timedelta(days=days)

        tasks = Task.query.filter(
            and_(
                Task.user_id == user_id,
                Task.deadline.isnot(None),
                Task.deadline >= today,
                Task.deadline <= end_date
            )
        ).order_by(Task.deadline.asc()).all()

        return [
            {
                "task_name": t.name,
                "deadline": t.deadline.strftime("%Y-%m-%d %H:%M")
            }
            for t in tasks
        ]
