from typing import TypeVar, Generic, Optional, Any
from pydantic import BaseModel

T = TypeVar('T')

class UnifiedResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: Optional[T] = None
    meta: Optional[dict[str, Any]] = None
