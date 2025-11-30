from core.database import SessionLocal
from models.user_model import User
from models.task_model import Task
from models.schedule_model import Schedule
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date, timedelta

class UserService:

    @staticmethod
    def create_user(data):
        session = SessionLocal()
        try:
            # cek email exist
            existing = session.query(User).filter(User.email == data["email"]).first()
            if existing:
                raise ValueError("Email already registered")
            
            hashed = generate_password_hash(data["password"])
            
            new_user = User(
                email=data["email"],
                password_hash=hashed,
                name=data["name"]
            )

            session.add(new_user)
            session.commit()
            session.refresh(new_user)

            return {
                "id": new_user.id,
                "email": new_user.email,
                "name": new_user.name,
                "created_at": new_user.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "message": "User registered successfully"
            }
        finally:
            session.close()

    @staticmethod
    def authenticate_user(email, password):
        session = SessionLocal()
        try:
            user = session.query(User).filter(User.email == email).first()
            if not user:
                return None

            if not check_password_hash(user.password_hash, password):
                return None

            return {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "message": "Login successful"
            }
        finally:
            session.close()

    @staticmethod
    def get_user_by_id(user_id):
        session = SessionLocal()
        try:
            user = session.query(User).get(user_id)
            if not user:
                return None

            return {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "created_at": user.created_at.strftime("%Y-%m-%d %H:%M:%S")
            }
        finally:
            session.close()

    @staticmethod
    def update_user(user_id, data):
        session = SessionLocal()
        try:
            user = session.query(User).get(user_id)
            if not user:
                return None

            if "name" in data:
                user.name = data["name"]

            if "email" in data:
                exists = session.query(User).filter(User.email == data["email"]).first()
                if exists and exists.id != user_id:
                    raise ValueError("Email already taken")
                user.email = data["email"]

            if "password" in data:
                user.password_hash = generate_password_hash(data["password"])

            session.commit()

            return {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "message": "User updated successfully"
            }
        finally:
            session.close()

    @staticmethod
    def delete_user(user_id):
        session = SessionLocal()
        try:
            user = session.query(User).get(user_id)
            if not user:
                return False

            # delete related
            session.query(Task).filter(Task.user_id == user_id).delete()
            session.query(Schedule).filter(Schedule.user_id == user_id).delete()

            session.delete(user)
            session.commit()
            return True
        finally:
            session.close()
