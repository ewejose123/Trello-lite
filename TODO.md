# Project To-Do List

This file tracks the major steps for building the Trello-lite application.

## Roadmap

- [x] **Step 1: Environment Setup**
  - Node.js confirmed.
  - Docker confirmed.
  - VS Code extensions assumed.

- [x] **Step 2: Create File Structure**
  - `backend/`, `frontend/`, and `.github/` directories created.
  - Placeholder `package.json`, `docker-compose.yml`, and `ci.yml` files created.

- [x] **Step 3: Backend Init (Express + Prisma + PostgreSQL)**
  - Express app with TypeScript set up.
  - Prisma connected to local PostgreSQL via Docker.
  - Prisma schema defined (`User`, `Team`, `Project`, etc.).
  - Initial migration created and database synced.

- [x] **Step 4: Backend Features**
  - Authentication implemented (Register, Login, JWT, Refresh Tokens).
  - Team management routes implemented (Create, List Teams).
  - Placeholder routes for Projects and Tasks created.

- [x] **Step 5: Frontend Init (React + Vite + Tailwind)**
  - React + TypeScript project scaffolded with Vite.
  - Tailwind CSS installed and configured.
  - React Router set up with placeholder pages.

- [x] **Step 6: Frontend Features**
  - API service layer created.
  - Registration and Login pages (UI and logic) implemented.
  - Global authentication state managed with React Context.
  - Login persistence with `localStorage` implemented.
  - Protected routes implemented.
  - Dashboard page created to display user's teams.
  - Enhanced dashboard with create team functionality.
  - Team page with project management.
  - Project page with task management and file uploads.

- [x] **Step 7: File Uploads (Supabase Storage)**
  - [x] Configure Supabase credentials in `.env` file.
  - [x] Re-enable file upload routes in the backend.
  - [x] Implement UI for file uploads on the frontend.
  - [x] File upload component integrated into task management.

- [ ] **Step 8: Docker & CI/CD**
  - [x] `Dockerfile` for backend created.
  - [x] `docker-compose.yml` updated to run backend and postgres.
  - [ ] CI/CD workflow with GitHub Actions to be finalized.

- [ ] **Step 9: Deployment**
  - [ ] Deploy Frontend to Vercel.
  - [ ] Deploy Backend to Render.
  - [ ] Provision and connect to production Supabase DB.

- [ ] **Step 10: Polish**
  - [ ] Write `README.md`.
  - [ ] Add screenshots/demo video.
