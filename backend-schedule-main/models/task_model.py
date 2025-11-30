# task_model.py
from core.database import db
from datetime import datetime
from models.base import Base

class Task(Base):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    name = db.Column(db.String(255), nullable=False)
    
    # REVISI PENTING: Menambahkan create_type=False
    mode = db.Column(db.Enum("fixed", "duration", name="task_mode", create_type=False), nullable=False) 

    # FIXED
    day = db.Column(db.String(10))
    start_time = db.Column(db.Time)
    end_time = db.Column(db.Time)

    # DURATION ONLY
    duration_minutes = db.Column(db.Integer)

    # DEADLINE
    deadline_day = db.Column(db.Date)
    deadline_time = db.Column(db.Time)

    # Extra attributes
    category = db.Column(db.String(120))
    difficulty = db.Column(db.Integer)   # 1–5
    priority = db.Column(db.Integer)     # 1–5
    preferred_time = db.Column(db.JSON)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # constraints task → one-to-many
    constraints = db.relationship("TaskConstraint", backref="task", lazy=True)

    # schedule result
    schedules = db.relationship("Schedule", backref="task", lazy=True)