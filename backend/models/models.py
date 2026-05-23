from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Text, Enum
from sqlalchemy.sql import func
from core.database import Base
import enum

class AgentStatus(str, enum.Enum):
    active = "active"
    suspended = "suspended"
    inactive = "inactive"

class TransactionType(str, enum.Enum):
    cash_in = "cash_in"
    cash_out = "cash_out"
    transfer = "transfer"
    bill_payment = "bill_payment"

class TransactionStatus(str, enum.Enum):
    success = "success"
    pending = "pending"
    failed = "failed"

class LoanStatus(str, enum.Enum):
    pending = "pending"
    active = "active"
    completed = "completed"
    overdue = "overdue"
    rejected = "rejected"

class Provider(str, enum.Enum):
    mpesa = "mpesa"
    airtel = "airtel"
    tigo = "tigo"
    halopesa = "halopesa"

class Agent(Base):
    __tablename__ = "agents"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    location = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    national_id = Column(String, unique=True, nullable=False)
    status = Column(String, default="active")
    credit_score = Column(Integer, default=0)
    float_balance = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    agent_id = Column(String, nullable=False)
    agent_name = Column(String, nullable=False)
    transaction_type = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    float_before = Column(Float, nullable=False)
    float_after = Column(Float, nullable=False)
    provider = Column(String, nullable=False)
    status = Column(String, default="success")
    reference = Column(String, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CreditScore(Base):
    __tablename__ = "credit_scores"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False)
    transaction_count = Column(Integer, default=0)
    avg_float = Column(Float, default=0.0)
    repayment_rate = Column(Float, default=0.0)
    loan_recommendation = Column(Float, default=0.0)
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())

class Loan(Base):
    __tablename__ = "loans"

    id = Column(String, primary_key=True, index=True)
    agent_id = Column(String, nullable=False)
    agent_name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    amount_repaid = Column(Float, default=0.0)
    interest_rate = Column(Float, nullable=False)
    duration_months = Column(Integer, nullable=False)
    status = Column(String, default="pending")
    disbursed_at = Column(DateTime(timezone=True), nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FraudAlert(Base):
    __tablename__ = "fraud_alerts"

    id = Column(String, primary_key=True, index=True)
    agent_id = Column(String, nullable=False)
    agent_name = Column(String, nullable=False)
    alert_type = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    amount = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)
    status = Column(String, default="open")
    provider = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())