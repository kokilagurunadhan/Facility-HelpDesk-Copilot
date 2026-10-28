import logging
from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.database import get_db
from app.routes import router

# 1. Setup system logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("helpdesk")

app = FastAPI(title="Facility Helpdesk Copilot")

# 2. CORS Gatekeeper Middleware Setup (MUST be before including routes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://10.11.109.73:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Include Application Routes
app.include_router(router)

# 4. Exception Handlers
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


# 5. Core Operational Routes
@app.get("/")
def hello():
    return {"message": "Helpdesk API is running"}


@app.get("/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
