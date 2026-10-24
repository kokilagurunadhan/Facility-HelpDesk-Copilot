from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db

app = FastAPI(title="Facility Helpdesk Copilot")
from app.routes import router
app.include_router(router)

@app.get("/")
def hello():
    return {"message": "Helpdesk API is running"}


@app.get("/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}