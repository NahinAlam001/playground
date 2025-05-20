
import shutil
import uuid
from pathlib import Path
import datetime # Import datetime

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
# IMPORTANT: Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
# to the path of your Firebase service account key JSON file.
try:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")
    print("Ensure GOOGLE_APPLICATION_CREDENTIALS environment variable is set correctly.")
    # Allow app to run for now, but Firestore operations will fail
    # In a production app, you might want to exit or handle this more strictly

db = firestore.client()

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
async def submit_code(
    file: UploadFile = File(...),
    userId: str = Form(...),
    userName: str = Form(...)
):
    """
    Accepts a code submission file and user details, saves the file,
    and records submission metadata in Firestore.
    """
    try:
        submission_id = str(uuid.uuid4())
        file_extension = Path(file.filename).suffix
        # Basic sanitization for the filename stored on the server
        safe_filename = f"{submission_id}{file_extension}"
        file_path = UPLOADS_DIR / safe_filename

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        submission_timestamp = datetime.datetime.utcnow().isoformat() + "Z" # ISO 8601 format

        submission_data = {
            "id": submission_id,
            "userId": userId,
            "userName": userName,
            "fileName": file.filename, # Original filename
            "filePath": str(file_path), # Path on server
            "submittedAt": submission_timestamp,
            "status": "Pending", # Initial status
            # Scores and logs will be added later
            "bleu4Score": None,
            "customBleuScore": None,
            "entityCoverageScore": None,
            "evaluationSummary": None,
            "logs": None
        }

        # Store submission metadata in Firestore
        if db:
            doc_ref = db.collection("submissions").document(submission_id)
            doc_ref.set(submission_data)
        else:
            # Fallback if Firebase Admin SDK failed to initialize
            print("Firestore client not available. Submission metadata not saved to Firestore.")
            # You might want to return an error or handle this case differently

        return {
            "message": "File submitted successfully and is pending processing.",
            "submissionId": submission_id,
            "fileName": file.filename,
            "submittedAt": submission_timestamp,
            "status": "Pending"
            # Return relevant data for the frontend
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
    uvicorn.run(app, host="0.0.0.0", port=8000)
