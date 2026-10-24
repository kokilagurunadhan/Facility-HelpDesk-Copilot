import logging

from fastapi import Depends, FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.database import get_db
from app.routes import router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("helpdesk")

app = FastAPI(title="Facility Helpdesk Copilot")
app.include_router(router)


@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    details = [
        {"field": ".".join(str(p) for p in e["loc"][1:]), "message": e["msg"]}
        for e in exc.errors()
    ]
    return JSONResponse(
        status_code=422,
        content={"error": "Invalid input", "details": details},
    )


@app.exception_handler(OperationalError)
async def db_down_handler(request: Request, exc: OperationalError):
    logger.warning("Database unreachable: %s", type(exc).__name__)
    return JSONResponse(
        status_code=503,
        content={"error": "Database unavailable. Please try again later."},
    )


@app.get("/")
def hello():
    return {"message": "Helpdesk API is running"}


@app.get("/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}