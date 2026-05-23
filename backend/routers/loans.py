from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import Loan, Agent
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import uuid

router = APIRouter(prefix="/loans", tags=["Loans"])

class LoanCreate(BaseModel):
    agent_id: str
    amount: float
    interest_rate: float
    duration_months: int

class LoanUpdate(BaseModel):
    status: Optional[str] = None
    amount_repaid: Optional[float] = None

@router.get("/")
def get_all_loans(db: Session = Depends(get_db)):
    loans = db.query(Loan).order_by(Loan.created_at.desc()).all()
    return {"loans": loans, "total": len(loans)}

@router.get("/{loan_id}")
def get_loan(loan_id: str, db: Session = Depends(get_db)):
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return loan

@router.get("/agent/{agent_id}")
def get_agent_loans(agent_id: str, db: Session = Depends(get_db)):
    loans = db.query(Loan).filter(Loan.agent_id == agent_id).all()
    return {"loans": loans, "total": len(loans)}

@router.post("/")
def create_loan(loan: LoanCreate, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == loan.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    if agent.credit_score < 500:
        raise HTTPException(status_code=400, detail="Agent credit score too low for loan eligibility")
    new_loan = Loan(
        id=f"LN-{str(uuid.uuid4())[:6].upper()}",
        agent_id=loan.agent_id,
        agent_name=agent.name,
        amount=loan.amount,
        amount_repaid=0.0,
        interest_rate=loan.interest_rate,
        duration_months=loan.duration_months,
        status="pending"
    )
    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)
    return {"message": "Loan application created successfully", "loan": new_loan}

@router.put("/{loan_id}/approve")
def approve_loan(loan_id: str, db: Session = Depends(get_db)):
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    loan.status = "active"
    loan.disbursed_at = datetime.utcnow()
    loan.due_date = datetime.utcnow() + timedelta(days=30 * loan.duration_months)
    db.commit()
    db.refresh(loan)
    return {"message": "Loan approved and disbursed", "loan": loan}

@router.put("/{loan_id}/repay")
def repay_loan(loan_id: str, update: LoanUpdate, db: Session = Depends(get_db)):
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    if update.amount_repaid:
        loan.amount_repaid += update.amount_repaid
        if loan.amount_repaid >= loan.amount:
            loan.status = "completed"
    db.commit()
    db.refresh(loan)
    return {"message": "Repayment recorded", "loan": loan}

@router.put("/{loan_id}/reject")
def reject_loan(loan_id: str, db: Session = Depends(get_db)):
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    loan.status = "rejected"
    db.commit()
    return {"message": "Loan rejected"}