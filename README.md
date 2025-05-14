
# Firebase Studio - Profile Forge NLP Competition Platform

This is a Next.js application serving as the frontend for an NLP competition platform. Users can submit their code, which will be evaluated against the Face2Profile dataset, and see their rankings on a leaderboard.

## Features

- User Authentication (Email/Password, Google, GitHub - currently mock)
- Code Submission (.zip, .tar.gz)
- Submission Tracking (Processing, Completed, Failed - currently mock status updates after initial submission)
- Evaluation Metrics: BLEU-4, Custom-BLEU, Entity Coverage Score (ECS) (via Genkit flow)
- Public Leaderboard (currently mock data)
- Responsive UI with ShadCN components and Tailwind CSS

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, ShadCN UI
- **AI/Evaluation:** Genkit with Google AI (Gemini)
- **Backend (Initial Setup):** FastAPI (Python)

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- Python (v3.8 or later recommended)
- pip

### Frontend Setup

1.  **Clone the repository (if applicable).**
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Environment Variables:**
    Create a `.env.local` file in the root of the project (or modify the existing `.env` if you prefer, though `.env.local` is ignored by Git by default and is better for local overrides).
    Add the following, adjusting if your backend runs on a different port:
    ```
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
    ```
    You may also need to configure Firebase API keys here if you integrate full Firebase services later. For Genkit with Google AI, ensure your `GOOGLE_API_KEY` is set in your environment or a `.env` file that Genkit can access (typically the root `.env` works).

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
4.  **Run the FastAPI development server:**
    The backend runs on port `8000` by default.
    ```bash
    uvicorn main:app --reload --port 8000
    ```
    You should see output indicating the server is running, e.g., `Uvicorn running on http://127.0.0.1:8000`.

### Running Both Frontend and Backend

You'll need two separate terminal windows:
- One for the Next.js frontend (`npm run dev` in the project root).
- One for the FastAPI backend (`uvicorn main:app --reload --port 8000` in the `backend` directory).

## Project Structure Highlights

-   `src/app/`: Next.js App Router pages.
-   `src/components/`: Reusable React components.
    -   `src/components/ui/`: ShadCN UI components.
    -   `src/components/core/`: Core application components (e.g., Logo, FileUploader).
    -   `src/components/layout/`: Layout components (Navbar, Footer, ProtectedRoute).
    -   `src/components/auth/`: Authentication related UI.
    -   `src/components/submissions/`: Submission list and detail views.
    -   `src/components/leaderboard/`: Leaderboard table.
-   `src/hooks/`: Custom React hooks (e.g., `useAuth`, `useToast`).
-   `src/lib/`: Utility functions (e.g., `cn` for Tailwind class merging).
-   `src/types/`: TypeScript type definitions.
-   `src/ai/`: Genkit related code.
    -   `src/ai/flows/`: Genkit flows (e.g., `evaluate-code-submission.ts`).
    -   `src/ai/genkit.ts`: Genkit initialization.
-   `public/`: Static assets.
-   `backend/`: FastAPI backend application.
    -   `backend/main.py`: Main FastAPI application logic.
    -   `backend/requirements.txt`: Python dependencies for the backend.
    -   `backend/uploads/`: (Auto-created) Directory where uploaded files are stored by the backend.

## Next Steps (Roadmap)

1.  **Database Integration (Backend):**
    *   Use Firebase Firestore (or another DB) in the FastAPI backend to store submission metadata, status, scores, and logs.
    *   Update frontend pages (`/submissions`, `/submissions/[id]`) to fetch data from FastAPI endpoints that query the database.
2.  **Sandboxed Code Execution (Backend):**
    *   Implement Docker-based sandboxed execution for user-submitted Python code (`predict.py`).
    *   FastAPI will manage the Docker lifecycle (build, run, capture output/logs).
3.  **Full Evaluation Pipeline:**
    *   FastAPI backend calls the Next.js API route (wrapping the Genkit flow) with the output from the Docker execution.
    *   Store evaluation results in the database.
4.  **Real-time Leaderboard:**
    *   Leaderboard data fetched from the database via a FastAPI endpoint.
5.  **User Authentication Bridge:**
    *   Secure FastAPI endpoints.
    *   Pass user identity from Next.js frontend (Firebase Auth) to FastAPI backend.
6.  **Detailed Submission Logs & Output Viewing.**
7.  **Admin Panel (Optional):** For managing users, submissions, dataset versions.
# playground
