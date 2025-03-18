from fastapi import APIRouter
from backend.api.routes import survivors_router, trade_router, items_router

router = APIRouter()

router.include_router(survivors_router, prefix="/survivors", tags=["Survivors"])
router.include_router(trade_router, prefix="/trade", tags=["Trade"])
router.include_router(items_router, prefix="/items", tags=["Items"])
