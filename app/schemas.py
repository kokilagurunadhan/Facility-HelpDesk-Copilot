from typing import Literal, Optional
from pydantic import BaseModel, Field


class RequestCreate(BaseModel):
    title: str = Field(min_length=3, max_length=150)
    description: Optional[str] = None
    priority: Literal["LOW", "MEDIUM", "HIGH"]
    created_by: int = Field(gt=0)