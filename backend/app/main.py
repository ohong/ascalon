from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import json
from pathlib import Path

# Initialize FastAPI app
app = FastAPI(
    title="Ascalon API",
    description="API for the Ascalon writing tracker application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize data storage
DATA_FILE = Path("data/word_entries.json")
DATA_FILE.parent.mkdir(exist_ok=True)
if not DATA_FILE.exists():
    DATA_FILE.write_text("[]")

# Pydantic models
class WordEntry(BaseModel):
    word_count: int
    date: datetime
    description: Optional[str] = None

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to Ascalon API"}

@app.post("/word-entries/")
async def create_word_entry(entry: WordEntry):
    try:
        # Read existing entries
        entries = json.loads(DATA_FILE.read_text())
        
        # Use the date from the request, but ensure it's just the date part
        date_str = entry.date.strftime("%Y-%m-%d")
        
        # Add new entry
        new_entry = {
            "id": len(entries) + 1,
            "word_count": entry.word_count,
            "date": date_str,  # Store just the date without time
            "description": entry.description
        }
        entries.append(new_entry)
        
        # Save updated entries
        DATA_FILE.write_text(json.dumps(entries, indent=2))
        return new_entry
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/word-entries/", response_model=List[dict])
async def get_word_entries():
    try:
        entries = json.loads(DATA_FILE.read_text())
        return entries
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/word-entries/{user_id}")
async def get_user_entries(user_id: str):
    try:
        entries = json.loads(DATA_FILE.read_text())
        user_entries = [entry for entry in entries if entry.get("user_id") == user_id]
        return user_entries
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add more routes for user management, social features, etc.
