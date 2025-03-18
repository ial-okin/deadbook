from fastapi import FastAPI
from backend.api.main import router as api_router
from backend.core.cors import setup_cors
from dotenv import load_dotenv

load_dotenv() 

app = FastAPI()

# Apply CORS middleware
setup_cors(app)

# Add routes
app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "message": "Hello Zombi World!"
    }
