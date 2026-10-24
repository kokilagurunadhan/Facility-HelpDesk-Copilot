from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.schemas import AssignRequest, RequestCreate, StatusUpdate
from app.database import get_db
from app.schemas import RequestCreate

router = APIRouter()
DUE_DAYS = {"HIGH": 1, "MEDIUM": 3, "LOW": 7}
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
            INSERT INTO requests
                (title, description, priority, created_by, due_at)
            VALUES
                (:title, :description, :priority, :created_by,
                 NOW() + make_interval(days => :days))
            RETURNING id, title, priority, status, created_by,
                      created_at, due_at
            """
        ),
        {**data.model_dump(), "days": DUE_DAYS[data.priority]},
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
@router.put("/requests/{request_id}/assign")
def assign_request(
    request_id: int,
    data: AssignRequest,
    db: Session = Depends(get_db),
):
    req = db.execute(
        text("SELECT id, status FROM requests WHERE id = :id"),
        {"id": request_id},
    ).mappings().first()
    if req is None:
        raise HTTPException(status_code=404, detail="Request not found")
    if req["status"] == "RESOLVED":
        raise HTTPException(
            status_code=409, detail="Cannot assign a resolved request"
        )

    tech = db.execute(
        text("SELECT id, active FROM technicians WHERE id = :id"),
        {"id": data.technician_id},
    ).mappings().first()
    if tech is None:
        raise HTTPException(status_code=404, detail="Technician not found")
    if not tech["active"]:
        raise HTTPException(status_code=400, detail="Technician is not active")

    row = db.execute(
        text(
            """
            UPDATE requests
            SET assigned_to = :tech_id
            WHERE id = :id
            RETURNING id, title, status, assigned_to
            """
        ),
        {"tech_id": data.technician_id, "id": request_id},
    ).mappings().one()
    db.commit()
    return dict(row)
ALLOWED_TRANSITIONS = {
    "OPEN": ["IN_PROGRESS"],
    "IN_PROGRESS": ["RESOLVED"],
    "RESOLVED": [],
}


@router.put("/requests/{request_id}/status")
def update_status(
    request_id: int,
    data: StatusUpdate,
    db: Session = Depends(get_db),
):
    req = db.execute(
        text("SELECT id, status, assigned_to FROM requests WHERE id = :id"),
        {"id": request_id},
    ).mappings().first()
    if req is None:
        raise HTTPException(status_code=404, detail="Request not found")

    current = req["status"]
    new = data.status

    if new not in ALLOWED_TRANSITIONS[current]:
        raise HTTPException(
            status_code=409,
            detail=f"Cannot move from {current} to {new}",
        )
    if new == "IN_PROGRESS" and req["assigned_to"] is None:
        raise HTTPException(
            status_code=400,
            detail="Assign a technician before starting work",
        )

    if new == "RESOLVED":
        set_clause = "status = :status, resolved_at = NOW()"
    else:
        set_clause = "status = :status"

    row = db.execute(
        text(
            f"""
            UPDATE requests
            SET {set_clause}
            WHERE id = :id
            RETURNING id, title, status, assigned_to, resolved_at
            """
        ),
        {"status": new, "id": request_id},
    ).mappings().one()
    db.commit()
    return dict(row)