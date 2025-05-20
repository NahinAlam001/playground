
# Firebase Studio - Profile Forge NLP Competition Platform

This is a Next.js application serving as the frontend for an NLP competition platform. Users can submit their code, which will be evaluated against the Face2Profile dataset, and see their rankings on a leaderboard.

## Features

- User Authentication (Email/Password, Google, GitHub - via Firebase)
- Code Submission (.zip, .tar.gz) to FastAPI backend.
- Submission metadata stored in Firebase Firestore.
- Submission Tracking (Processing, Completed, Failed - status primarily managed by backend, frontend shows initial state).
- Evaluation Metrics: BLEU-4, Custom-BLEU, Entity Coverage Score (ECS) (via Genkit flow - integration pending).
- Public Leaderboard (currently mock data - backend integration pending).
- Responsive UI with ShadCN components and Tailwind CSS.

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, ShadCN UI
- **AI/Evaluation (Planned):** Genkit with Google AI (Gemini)
- **Backend:** FastAPI (Python)
- **Authentication:** Firebase Authentication
- **Database:** Firebase Firestore

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- Python (v3.8 or later recommended)
- pip
- Google Cloud SDK (for Firebase Admin SDK environment variable setup) or manual service account key.

### Firebase Setup

1.  **Create a Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a project.
2.  **Add a Web App:** In your Firebase project, add a Web app and note down the configuration credentials.
3.  **Enable Authentication Providers:** In the Firebase console, go to "Authentication" -> "Sign-in method" and enable Email/Password, Google, and GitHub. For GitHub, you'll need to create an OAuth app on GitHub and provide the Client ID and Secret to Firebase.
4.  **Firestore Database:** In the Firebase console, go to "Firestore Database" (under Build) and create a database. Start in **test mode** for easier development initially (you can secure it with rules later). Note the region.
5.  **Service Account Key (for Backend Admin SDK):**
    *   In the Firebase Console, go to your Project settings (gear icon).
    *   Go to the "Service accounts" tab.
    *   Click on "Generate new private key" and confirm. A JSON file will be downloaded.
    *   **Security:** Treat this file like a password. Do not commit it to your Git repository.
    *   Place this JSON file in a secure location outside your project's `backend` directory, or within the `backend` directory but ensure it's added to `.gitignore`. For example, you could place it in `backend/serviceAccountKey.json`.
    *   Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to point to the absolute path of this JSON file before running the FastAPI backend.
        Example (Linux/macOS): `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/backend/serviceAccountKey.json"`
        Example (Windows PowerShell): `$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\backend\serviceAccountKey.json"`
        You can also set this in your IDE's run configuration for the backend.

### Frontend Setup

1.  **Clone the repository (if applicable).**
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Environment Variables (`.env.local`):**
    Create a `.env.local` file in the root of the Next.js project. Copy the contents from `.env` and fill in your Firebase web app credentials and the backend API URL:
    ```
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

    # Firebase Web App Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
    # NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID (optional)
    ```
    **Important:** Ensure these `NEXT_PUBLIC_FIREBASE_...` variables are correctly filled. The application currently uses hardcoded Firebase config in `src/lib/firebase.ts` as a fallback during troubleshooting, but using `.env.local` is preferred.

4.  **Run the Next.js development server:**
    The frontend runs on port `9002` by default (see `package.json`).
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:9002](http://localhost:9002) in your browser.

### Backend Setup (FastAPI)

1.  **Navigate to the `backend` directory:**
    ```bash
    cd backend
    ```
2.  **Create a Python virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Set `GOOGLE_APPLICATION_CREDENTIALS` Environment Variable:**
    Make sure this environment variable points to your Firebase service account key JSON file (see "Firebase Setup" step 5).
5.  **Run the FastAPI development server:**
    The backend runs on port `8000` by default.
    ```bash
    uvicorn main:app --reload --port 8000
    ```
    You should see output indicating the server is running, e.g., `Uvicorn running on http://127.0.0.1:8000`.

### Running Both Frontend and Backend

You'll need two separate terminal windows:
- One for the Next.js frontend (`npm run dev` in the project root).
- One for the FastAPI backend (`uvicorn main:app --reload --port 8000` in the `backend` directory, after setting `GOOGLE_APPLICATION_CREDENTIALS`).

## Project Structure Highlights

-   `src/app/`: Next.js App Router pages.
-   `src/components/`: Reusable React components.
-   `src/hooks/`: Custom React hooks (e.g., `useAuth`, `useToast`).
-   `src/lib/`: Utility functions (e.g., `firebase.ts` for Firebase web init).
-   `src/types/`: TypeScript type definitions.
-   `src/ai/`: Genkit related code.
-   `public/`: Static assets.
-   `backend/`: FastAPI backend application.
    -   `backend/main.py`: Main FastAPI application logic, including Firestore integration.
    -   `backend/requirements.txt`: Python dependencies for the backend.
    -   `backend/uploads/`: (Auto-created) Directory where uploaded files are stored.
    -   `backend/serviceAccountKey.json` (Example path, ensure it's in `.gitignore` if placed here).

## Next Steps (Roadmap)

1.  **Sandboxed Code Execution (Backend):**
    *   Implement Docker-based sandboxed execution for user-submitted Python code (`predict.py`).
    *   FastAPI will manage the Docker lifecycle (build, run, capture output/logs).
    *   Update submission status in Firestore (`Processing`, `Completed`, `Failed`).
2.  **Full Evaluation Pipeline:**
    *   After Docker execution, FastAPI backend calls the Next.js API route (wrapping the Genkit flow) with the output.
    *   Store evaluation results (scores, summary) in the Firestore document for the submission.
3.  **Real-time Submission Status & Results (Frontend):**
    *   Update `MySubmissionsPage` and `SubmissionDetailPage` to fetch data from FastAPI endpoints that query Firestore.
    *   Implement polling or WebSockets for live status updates.
4.  **Real-time Leaderboard:**
    *   Leaderboard data fetched from Firestore via a FastAPI endpoint.
5.  **User Authentication Bridge (Backend Security):**
    *   Secure FastAPI endpoints. Pass Firebase Auth ID token from Next.js frontend to FastAPI backend and verify it.
6.  **Detailed Submission Logs & Output Viewing (Frontend).**
7.  **Admin Panel (Optional).**
