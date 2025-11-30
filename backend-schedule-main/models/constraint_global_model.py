from core.database import db
from datetime import datetime
from models.base import Base

class GlobalConstraint(Base):
    __tablename__ = "constraints_global"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    type = db.Column(db.String(50), nullable=False)
    value = db.Column(db.JSON, nullable=False)
    priority = db.Column(db.Integer, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
