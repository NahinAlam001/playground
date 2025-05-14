
import shutil
import uuid
from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Profile Forge Backend")

# Configure CORS to allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:9002"], # Your Next.js dev port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOADS_DIR = Path("uploads")
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

@app.post("/submit", tags=["Submissions"])
async def submit_code(file: UploadFile = File(...)):
    """
    Accepts a code submission file, saves it, and returns a submission ID.
    """
    try:
        submission_id = str(uuid.uuid4())
        file_extension = Path(file.filename).suffix
        # Basic sanitization for the filename stored on the server
        safe_filename = f"{submission_id}{file_extension}"
        file_path = UPLOADS_DIR / safe_filename

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # In a real application, this is where you'd:
        # 1. Store submission details (submission_id, user_id, file_path, status='Pending') in a database.
        # 2. Add the submission to a queue for processing (e.g., Docker execution & evaluation).
        # For this step, we just confirm receipt and provide an ID.
        return {
            "message": "File submitted successfully and is pending processing.",
            "submissionId": submission_id,
            "fileName": file.filename,
            # "filePath": str(file_path) # Useful for debugging, consider removing for production
        }
    except Exception as e:
        # Log the exception e for server-side debugging
        print(f"Error during submission: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the file: {str(e)}")
    finally:
        if hasattr(file, 'file') and file.file:
            # Ensure the file stream is closed
            file.file.close()

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Profile Forge Backend API"}

if __name__ == "__main__":
    # This is for direct execution (e.g., `python main.py`)
    # For development, prefer `uvicorn backend.main:app --reload --port 8000`
    uvicorn.run(app, host="0.0.0.0", port=8000)
