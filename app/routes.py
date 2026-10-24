from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import RequestCreate

router = APIRouter()
from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import text
from sqlalchemy.orm import Session


@router.post("/requests", status_code=201)
def create_request(data: RequestCreate, db: Session = Depends(get_db)):
    user = db.execute(
        text("SELECT id FROM users WHERE id = :id"),
        {"id": data.created_by},
    ).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    row = db.execute(
        text(
            """
            INSERT INTO requests (title, description, priority, created_by)
            VALUES (:title, :description, :priority, :created_by)
            RETURNING id, title, priority, status, created_by, created_at
            """
        ),
        data.model_dump(),
    ).mappings().one()
    db.commit()
    return dict(row)
@router.get("/requests")
def list_requests(
    status: Optional[Literal["OPEN", "IN_PROGRESS", "RESOLVED"]] = None,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    sql = """
        SELECT id, title, priority, status, created_by, assigned_to,
               created_at, due_at, resolved_at
        FROM requests
    """
    params = {"limit": limit}

    if status:
        sql += " WHERE status = :status"
        params["status"] = status

    sql += " ORDER BY created_at DESC LIMIT :limit"

    rows = db.execute(text(sql), params).mappings().all()
    return [dict(r) for r in rows]