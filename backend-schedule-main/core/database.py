from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from flask_sqlalchemy import SQLAlchemy

DATABASE_URL = "postgresql://postgres:123@localhost:5432/schedule_ai_db"

# Engine untuk koneksi ke database
engine = create_engine(DATABASE_URL)

# Session Local (untuk dependency di service/controller)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Base model
Base = declarative_base()


db = SQLAlchemy()
