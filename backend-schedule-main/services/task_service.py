from core.database import SessionLocal
from models.task_model import Task
from datetime import datetime, date
from sqlalchemy import and_


class TaskService:

    @staticmethod
    def create_task(data):
        session = SessionLocal()

        try:
            mode = data.get("mode")
            if mode not in ["fixed", "duration"]:
                raise ValueError("mode must be 'fixed' or 'duration'")

            # Parse deadline
            deadline_day = None
            deadline_time = None
            if data.get("deadline_day"):
                deadline_day = datetime.strptime(data["deadline_day"], "%Y-%m-%d").date()
                deadline_time_str = data.get("deadline_time", "23:59")
                deadline_time = datetime.strptime(deadline_time_str, "%H:%M").time()

            # Parse time for fixed task
            start_time = None
            end_time = None
            if mode == "fixed":
                if not data.get("start_time") or not data.get("end_time"):
                    raise ValueError("Fixed task requires start_time and end_time")

                start_time = datetime.strptime(data["start_time"], "%H:%M").time()
                end_time = datetime.strptime(data["end_time"], "%H:%M").time()

            new_task = Task(
                user_id=data["user_id"],
                name=data["name"],
                mode=mode,
                day=data.get("day"),
                start_time=start_time,
                end_time=end_time,
                duration_minutes=data.get("duration_minutes"),
                deadline_day=deadline_day,
                deadline_time=deadline_time,
                category=data.get("category"),
                difficulty=data.get("difficulty"),
                priority=data.get("priority"),
                preferred_time=data.get("preferred_time"),
            )

            session.add(new_task)
            session.commit()
            session.refresh(new_task)

            return TaskService._task_to_dict(new_task)

        finally:
            session.close()

    @staticmethod
    def get_user_tasks(user_id):
        session = SessionLocal()
        try:
            tasks = session.query(Task).filter(Task.user_id == user_id).all()
            return [TaskService._task_to_dict(t) for t in tasks]
        finally:
            session.close()

    @staticmethod
    def get_task_by_id(task_id):
        session = SessionLocal()
        try:
            task = session.query(Task).filter(Task.id == task_id).first()
            return TaskService._task_to_dict(task) if task else None
        finally:
            session.close()

    @staticmethod
    def update_task(task_id, data):
        session = SessionLocal()

        try:
            task = session.query(Task).filter(Task.id == task_id).first()
            if not task:
                return None

            # Update general fields
            for field in ["name", "day", "duration_minutes", "category", "difficulty", "priority", "preferred_time"]:
                if field in data:
                    setattr(task, field, data[field])

            # Update start/end time
            if "start_time" in data:
                task.start_time = datetime.strptime(data["start_time"], "%H:%M").time()

            if "end_time" in data:
                task.end_time = datetime.strptime(data["end_time"], "%H:%M").time()

            # Update deadline
            if "deadline_day" in data:
                task.deadline_day = datetime.strptime(data["deadline_day"], "%Y-%m-%d").date()

            if "deadline_time" in data:
                task.deadline_time = datetime.strptime(data["deadline_time"], "%H:%M").time()

            # Update mode
            if "mode" in data and data["mode"] in ["fixed", "duration"]:
                task.mode = data["mode"]

            session.commit()
            session.refresh(task)

            return TaskService._task_to_dict(task)

        finally:
            session.close()

    @staticmethod
    def delete_task(task_id):
        session = SessionLocal()

        try:
            task = session.query(Task).filter(Task.id == task_id).first()
            if not task:
                return False

            session.delete(task)
            session.commit()
            return True

        finally:
            session.close()

    @staticmethod
    def get_fixed_tasks(user_id):
        session = SessionLocal()
        try:
            tasks = session.query(Task).filter(
                Task.user_id == user_id,
                Task.mode == "fixed"
            ).all()
            return [TaskService._task_to_dict(t) for t in tasks]
        finally:
            session.close()

    @staticmethod
    def get_flex_tasks(user_id):
        session = SessionLocal()
        try:
            tasks = session.query(Task).filter(
                Task.user_id == user_id,
                Task.mode == "duration"
            ).all()
            return [TaskService._task_to_dict(t) for t in tasks]
        finally:
            session.close()

    @staticmethod
    def get_tasks_with_deadlines(user_id, days=7):
        session = SessionLocal()
        try:
            today = date.today()
            future_day = today + timedelta(days=days)

            tasks = session.query(Task).filter(
                and_(
                    Task.user_id == user_id,
                    Task.deadline_day.isnot(None),
                    Task.deadline_day >= today,
                    Task.deadline_day <= future_day
                )
            ).order_by(Task.deadline_day, Task.deadline_time).all()

            return [TaskService._task_to_dict(t) for t in tasks]

        finally:
            session.close()

    @staticmethod
    def _task_to_dict(task):
        return {
            "id": task.id,
            "user_id": task.user_id,
            "name": task.name,
            "mode": task.mode,
            "day": task.day,
            "start_time": task.start_time.strftime("%H:%M") if task.start_time else None,
            "end_time": task.end_time.strftime("%H:%M") if task.end_time else None,
            "duration_minutes": task.duration_minutes,
            "deadline_day": task.deadline_day.strftime("%Y-%m-%d") if task.deadline_day else None,
            "deadline_time": task.deadline_time.strftime("%H:%M") if task.deadline_time else None,
            "category": task.category,
            "difficulty": task.difficulty,
            "priority": task.priority,
            "preferred_time": task.preferred_time,
            "created_at": task.created_at.strftime("%Y-%m-%d %H:%M:%S") if task.created_at else None
        }
