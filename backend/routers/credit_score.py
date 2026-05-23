from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import Agent, CreditScore
from services.credit_scoring import calculate_credit_score

router = APIRouter(prefix="/credit-scores", tags=["Credit Scores"])

@router.get("/")
def get_all_scores(db: Session = Depends(get_db)):
    scores = db.query(CreditScore).order_by(CreditScore.calculated_at.desc()).all()
    return {"scores": scores, "total": len(scores)}

@router.post("/calculate/{agent_id}")
def calculate_score(agent_id: str, db: Session = Depends(get_db)):
    result = calculate_credit_score(agent_id, db)
    if not result:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"message": "Credit score calculated successfully", "result": result}

@router.post("/calculate-all")
def calculate_all_scores(db: Session = Depends(get_db)):
    agents = db.query(Agent).all()
    results = []
    for agent in agents:
        result = calculate_credit_score(agent.id, db)
        if result:
            results.append(result)
    return {
        "message": f"Credit scores calculated for {len(results)} agents",
        "results": results
    }

@router.get("/{agent_id}")
def get_agent_score(agent_id: str, db: Session = Depends(get_db)):
    score = db.query(CreditScore).filter(
        CreditScore.agent_id == agent_id
    ).order_by(CreditScore.calculated_at.desc()).first()
    if not score:
        raise HTTPException(status_code=404, detail="No credit score found for this agent")
    return score