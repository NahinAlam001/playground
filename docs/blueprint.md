# **App Name**: Profile Forge

## Core Features:

- Secure Authentication: Login/Registration: Secure user authentication using Firebase Auth (email/password, Google/GitHub).
- Code Submission UI: Submission UI: A page for users to upload their code in a `.zip` or `.tar.gz` format. Clear instructions on the expected format.
- Sandboxed Execution: Sandboxed Execution: Securely execute user-submitted code within Docker containers with time and resource limits.
- AI-Driven Leaderboard: Evaluation and Ranking: Use BLEU-4, Custom-BLEU (penalizing missing name/job title) and ECS to score and rank the submissions. Present the scores on the leaderboard.
- Public Leaderboard: Leaderboard Display: Public leaderboard showcasing top performers, sortable by different evaluation metrics. The display will list user names and performance scores.

## Style Guidelines:

- Primary color: Dark blue (#0D47A1) for a professional and trustworthy feel.
- Secondary color: Light gray (#EEEEEE) for backgrounds and subtle contrast.
- Accent: Teal (#26A69A) to highlight interactive elements and calls to action.
- Clean and readable typography to ensure code and results are easy to review.
- Use clear and concise icons for navigation and actions (e.g., upload, submit, view logs).
- Use a well-structured and responsive layout that adapts to different screen sizes.