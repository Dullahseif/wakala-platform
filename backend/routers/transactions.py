from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import Transaction, Agent
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter(prefix="/transactions", tags=["Transactions"])

class TransactionCreate(BaseModel):
    agent_id: str
    transaction_type: str
    amount: float
    provider: str

@router.get("/")
def get_all_transactions(db: Session = Depends(get_db)):
    transactions = db.query(Transaction).order_by(Transaction.created_at.desc()).all()
    return {"transactions": transactions, "total": len(transactions)}

@router.get("/agent/{agent_id}")
def get_agent_transactions(agent_id: str, db: Session = Depends(get_db)):
    transactions = db.query(Transaction).filter(
        Transaction.agent_id == agent_id
    ).order_by(Transaction.created_at.desc()).all()
    return {"transactions": transactions, "total": len(transactions)}

@router.post("/")
def create_transaction(txn: TransactionCreate, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == txn.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    float_before = agent.float_balance

    if txn.transaction_type == "cash_in":
        float_after = float_before + txn.amount
    elif txn.transaction_type == "cash_out":
        if float_before < txn.amount:
            raise HTTPException(status_code=400, detail="Insufficient float balance")
        float_after = float_before - txn.amount
    else:
        float_after = float_before

    agent.float_balance = float_after
    db.commit()

    new_txn = Transaction(
        id=f"TXN-{str(uuid.uuid4())[:8].upper()}",
        agent_id=txn.agent_id,
        agent_name=agent.name,
        transaction_type=txn.transaction_type,
        amount=txn.amount,
        float_before=float_before,
        float_after=float_after,
        provider=txn.provider,
        status="success",
        reference=f"REF-{str(uuid.uuid4())[:8].upper()}"
    )
    db.add(new_txn)
    db.commit()
    db.refresh(new_txn)
    return {"message": "Transaction recorded successfully", "transaction": new_txn}

@router.get("/{transaction_id}")
def get_transaction(transaction_id: str, db: Session = Depends(get_db)):
    txn = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return txn