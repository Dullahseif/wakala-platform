from sqlalchemy.orm import Session
from models.models import Agent, Transaction, CreditScore, Loan

def calculate_credit_score(agent_id: str, db: Session):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        return None

    transactions = db.query(Transaction).filter(
        Transaction.agent_id == agent_id
    ).all()

    transaction_count = len(transactions)

    if transaction_count == 0:
        return save_score(agent, 300, "High", 0, 0.0, 0.0, 0.0, db)

    float_balances = [float(t.float_after) for t in transactions]
    avg_float = sum(float_balances) / len(float_balances) if float_balances else 0.0

    if len(float_balances) > 1:
        mean = avg_float
        variance = sum((x - mean) ** 2 for x in float_balances) / len(float_balances)
        float_std = variance ** 0.5
    else:
        float_std = 0.0

    if transaction_count >= 500:
        frequency_score = 200
    elif transaction_count >= 200:
        frequency_score = 150
    elif transaction_count >= 100:
        frequency_score = 100
    elif transaction_count >= 50:
        frequency_score = 70
    else:
        frequency_score = max(10, transaction_count * 1.5)

    stability_ratio = 1 - (float_std / (avg_float + 1))
    float_score = min(200.0, max(0.0, stability_ratio * 200))

    if avg_float >= 1000000:
        float_level_score = 200
    elif avg_float >= 500000:
        float_level_score = 150
    elif avg_float >= 200000:
        float_level_score = 100
    elif avg_float >= 50000:
        float_level_score = 60
    else:
        float_level_score = 20

    successful = [t for t in transactions if t.status == "success"]
    success_rate = len(successful) / transaction_count if transaction_count > 0 else 0.0
    success_score = success_rate * 200

    loans = db.query(Loan).filter(Loan.agent_id == agent_id).all()
    if loans:
        completed_loans = [l for l in loans if l.status == "completed"]
        repayment_rate = len(completed_loans) / len(loans)
        repayment_score = repayment_rate * 200
    else:
        repayment_rate = 0.5
        repayment_score = 100

    raw_score = (
        frequency_score * 0.25 +
        float_score * 0.20 +
        float_level_score * 0.20 +
        success_score * 0.20 +
        repayment_score * 0.15
    )

    score = int(min(1000, max(300, raw_score * 5)))

    if score >= 800:
        risk_level = "Low"
    elif score >= 650:
        risk_level = "Medium"
    else:
        risk_level = "High"

    if score >= 800:
        loan_recommendation = float(avg_float * 3)
    elif score >= 650:
        loan_recommendation = float(avg_float * 1.5)
    elif score >= 500:
        loan_recommendation = float(avg_float * 0.5)
    else:
        loan_recommendation = 0.0

    return save_score(
        agent, score, risk_level,
        transaction_count, float(avg_float),
        float(repayment_rate), loan_recommendation, db
    )

def save_score(agent, score, risk_level, txn_count, avg_float, repayment_rate, loan_rec, db):
    agent.credit_score = score
    db.commit()

    credit_score = CreditScore(
        agent_id=agent.id,
        score=score,
        risk_level=risk_level,
        transaction_count=txn_count,
        avg_float=float(avg_float),
        repayment_rate=float(repayment_rate),
        loan_recommendation=float(loan_rec)
    )
    db.add(credit_score)
    db.commit()
    db.refresh(credit_score)

    return {
        "agent_id": agent.id,
        "agent_name": agent.name,
        "score": score,
        "risk_level": risk_level,
        "transaction_count": txn_count,
        "avg_float": round(float(avg_float), 2),
        "repayment_rate": round(float(repayment_rate) * 100, 2),
        "loan_recommendation": round(float(loan_rec), 2)
    }