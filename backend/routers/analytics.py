from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from core.database import get_db
from models.models import Agent, Transaction, Loan, FraudAlert, CreditScore

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    total_agents = db.query(Agent).count()
    active_agents = db.query(Agent).filter(Agent.status == "active").count()
    total_transactions = db.query(Transaction).count()
    total_volume = db.query(func.sum(Transaction.amount)).scalar() or 0
    total_loans = db.query(Loan).count()
    active_loans = db.query(Loan).filter(Loan.status == "active").count()
    total_disbursed = db.query(func.sum(Loan.amount)).filter(Loan.status != "pending").scalar() or 0
    total_fraud = db.query(FraudAlert).count()
    open_fraud = db.query(FraudAlert).filter(FraudAlert.status == "open").count()

    return {
        "agents": {
            "total": total_agents,
            "active": active_agents,
        },
        "transactions": {
            "total": total_transactions,
            "volume": round(float(total_volume), 2),
        },
        "loans": {
            "total": total_loans,
            "active": active_loans,
            "disbursed": round(float(total_disbursed), 2),
        },
        "fraud": {
            "total": total_fraud,
            "open": open_fraud,
        }
    }

@router.get("/transactions-by-type")
def transactions_by_type(db: Session = Depends(get_db)):
    results = db.query(
        Transaction.transaction_type,
        func.count(Transaction.id),
        func.sum(Transaction.amount)
    ).group_by(Transaction.transaction_type).all()

    return [
        {
            "type": r[0],
            "count": r[1],
            "volume": round(float(r[2] or 0), 2)
        }
        for r in results
    ]

@router.get("/transactions-by-provider")
def transactions_by_provider(db: Session = Depends(get_db)):
    results = db.query(
        Transaction.provider,
        func.count(Transaction.id),
        func.sum(Transaction.amount)
    ).group_by(Transaction.provider).all()

    return [
        {
            "provider": r[0],
            "count": r[1],
            "volume": round(float(r[2] or 0), 2)
        }
        for r in results
    ]

@router.get("/credit-distribution")
def credit_distribution(db: Session = Depends(get_db)):
    excellent = db.query(Agent).filter(Agent.credit_score >= 800).count()
    good = db.query(Agent).filter(Agent.credit_score >= 650, Agent.credit_score < 800).count()
    fair = db.query(Agent).filter(Agent.credit_score >= 500, Agent.credit_score < 650).count()
    poor = db.query(Agent).filter(Agent.credit_score < 500).count()

    return [
        { "range": "800-1000", "label": "Excellent", "count": excellent },
        { "range": "650-799",  "label": "Good",      "count": good      },
        { "range": "500-649",  "label": "Fair",       "count": fair      },
        { "range": "0-499",    "label": "Poor",       "count": poor      },
    ]

@router.get("/agents-by-location")
def agents_by_location(db: Session = Depends(get_db)):
    results = db.query(
        Agent.location,
        func.count(Agent.id)
    ).group_by(Agent.location).all()

    return [
        { "location": r[0], "count": r[1] }
        for r in results
    ]

@router.get("/loans-by-status")
def loans_by_status(db: Session = Depends(get_db)):
    results = db.query(
        Loan.status,
        func.count(Loan.id),
        func.sum(Loan.amount)
    ).group_by(Loan.status).all()

    return [
        {
            "status": r[0],
            "count": r[1],
            "amount": round(float(r[2] or 0), 2)
        }
        for r in results
    ]