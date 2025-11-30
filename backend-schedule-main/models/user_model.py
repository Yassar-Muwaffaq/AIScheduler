from core.database import db
from datetime import datetime
from models.base import Base

class User(Base):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(120))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # relationships
    tasks = db.relationship("Task", backref="user", lazy=True)
    global_constraints = db.relationship("GlobalConstraint", backref="user", lazy=True)
    schedules = db.relationship("Schedule", backref="user", lazy=True)
