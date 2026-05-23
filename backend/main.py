from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import agents, transactions, credit_score, loans, fraud, auth

app = FastAPI(
    title="Wakala Ledger API",
    description="Interoperable Wakala Ledger & AI Credit Scoring Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://wakala-platform.vercel.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(agents.router)
app.include_router(transactions.router)
app.include_router(credit_score.router)
app.include_router(loans.router)
app.include_router(fraud.router)

@app.get("/")
def root():
    return {
        "message": "Wakala Ledger API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
def health():
    return {"status": "ok"}