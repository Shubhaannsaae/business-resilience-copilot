import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Numeric, JSON, ForeignKey, Text
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DB_URL = os.getenv("SUPABASE_DB_URL")  # e.g., postgresql://user:pass@host:6543/postgres
if not DB_URL:
    raise RuntimeError("SUPABASE_DB_URL is required")

engine = create_engine(DB_URL, pool_pre_ping=True, pool_size=5, max_overflow=5)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

class BusinessSnapshot(Base):
    __tablename__ = "business_snapshots"
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    revenue_monthly = Column(Numeric, nullable=False)
    expenses_monthly = Column(Numeric, nullable=False)
    cash_on_hand = Column(Numeric, nullable=False)
    top_client_name = Column(String, nullable=True)
    top_client_share = Column(Numeric, nullable=True)
    supplier_concentration = Column(Numeric, nullable=True)
    data_json = Column(JSON, nullable=False)

    risks = relationship("Risk", back_populates="snapshot", cascade="all,delete-orphan")
    actions = relationship("ActionItem", back_populates="snapshot", cascade="all,delete-orphan")

class Risk(Base):
    __tablename__ = "risks"
    id = Column(Integer, primary_key=True, index=True)
    snapshot_id = Column(Integer, ForeignKey("business_snapshots.id", ondelete="CASCADE"))
    title = Column(String, nullable=False)
    severity = Column(Integer, nullable=False)   # 1-5
    priority = Column(Integer, nullable=False)   # 1-5
    detail = Column(Text, nullable=False)
    suggestion = Column(Text, nullable=False)
    snapshot = relationship("BusinessSnapshot", back_populates="risks")

class ActionItem(Base):
    __tablename__ = "actions"
    id = Column(Integer, primary_key=True, index=True)
    snapshot_id = Column(Integer, ForeignKey("business_snapshots.id", ondelete="CASCADE"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    impact = Column(Integer, nullable=False)     # 1-5
    effort = Column(Integer, nullable=False)     # 1-5
    due_days = Column(Integer, nullable=False)   # SLA
    snapshot = relationship("BusinessSnapshot", back_populates="actions")

def init_db():
    Base.metadata.create_all(bind=engine)
