from core.database import SessionLocal
from models.constraint_global_model import GlobalConstraint
from models.constraint_task_model import TaskConstraint
from models.task_model import Task

class ConstraintService:

    @staticmethod
    def create_global_constraint(data):
        session = SessionLocal()
        try:
            new_c = GlobalConstraint(
                user_id=data["user_id"],
                type=data["type"],
                value=data["value"],
                priority=data.get("priority", 3)
            )

            session.add(new_c)
            session.commit()
            session.refresh(new_c)

            return ConstraintService._global_to_dict(new_c)

        finally:
            session.close()

    @staticmethod
    def get_user_global_constraints(user_id):
        session = SessionLocal()
        try:
            constraints = session.query(GlobalConstraint)\
                .filter(GlobalConstraint.user_id == user_id).all()

            return [ConstraintService._global_to_dict(c) for c in constraints]
        finally:
            session.close()

    @staticmethod
    def update_global_constraint(constraint_id, data):
        session = SessionLocal()
        try:
            c = session.query(GlobalConstraint).get(constraint_id)
            if not c:
                return None

            if "type" in data:
                c.type = data["type"]
            if "value" in data:
                c.value = data["value"]
            if "priority" in data:
                c.priority = data["priority"]

            session.commit()
            return ConstraintService._global_to_dict(c)
        finally:
            session.close()

    @staticmethod
    def delete_global_constraint(constraint_id):
        session = SessionLocal()
        try:
            c = session.query(GlobalConstraint).get(constraint_id)
            if not c:
                return False

            session.delete(c)
            session.commit()
            return True
        finally:
            session.close()

    # ===== TASK CONSTRAINT =====

    @staticmethod
    def create_task_constraint(data):
        session = SessionLocal()
        try:
            new_c = TaskConstraint(
                task_id=data["task_id"],
                type=data["type"],
                value=data.get("value", {}),
                priority=data.get("priority", 5)
            )

            session.add(new_c)
            session.commit()
            session.refresh(new_c)
            return ConstraintService._task_to_dict(new_c)

        finally:
            session.close()

    @staticmethod
    def get_task_constraints(task_id):
        session = SessionLocal()
        try:
            constraints = session.query(TaskConstraint)\
                .filter(TaskConstraint.task_id == task_id).all()

            return [ConstraintService._task_to_dict(c) for c in constraints]

        finally:
            session.close()

    @staticmethod
    def update_task_constraint(constraint_id, data):
        session = SessionLocal()
        try:
            c = session.query(TaskConstraint).get(constraint_id)
            if not c:
                return None

            if "type" in data:
                c.type = data["type"]
            if "value" in data:
                c.value = data["value"]
            if "priority" in data:
                c.priority = data["priority"]

            session.commit()
            return ConstraintService._task_to_dict(c)
        finally:
            session.close()

    @staticmethod
    def delete_task_constraint(constraint_id):
        session = SessionLocal()
        try:
            c = session.query(TaskConstraint).get(constraint_id)
            if not c:
                return False

            session.delete(c)
            session.commit()
            return True

        finally:
            session.close()

    @staticmethod
    def _global_to_dict(c):
        return {
            "id": c.id,
            "user_id": c.user_id,
            "type": c.type,
            "value": c.value,
            "priority": c.priority,
            "created_at": c.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }

    @staticmethod
    def _task_to_dict(c):
        return {
            "id": c.id,
            "task_id": c.task_id,
            "type": c.type,
            "value": c.value,
            "priority": c.priority,
            "created_at": c.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
