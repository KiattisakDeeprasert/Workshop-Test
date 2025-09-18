# Workshop-Test — Task Manager

Project **Workshop-Test** is a Task Manager project
organized into two main folders:

- **backend/** — Node.js + Express + MongoDB Atlas (API + Database)
- **frontend/** — Vite + React + TypeScript + Tailwind CSS (UI)

---

## Setup Instructions

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd Workshop-Test
```
### 2. install Dependencies

Backend:

```bash
cd backend
npm install
```
Frontend:

```bash
cd frontend
npm install
```
## Environment Variables
backend/.env
```env
PORT=8081
MONGO_URI=mongodb://localhost:27017/task_manager
MONGO_DB_NAME=task_manager
CORS_ORIGINS=http://localhost:5173
```
frontend/.env
```env
VITE_API_URL=http://localhost:8081
```
## Run Development Servers
Backend
```bash
cd backend
npm run dev
```

Frontend
```bash
cd frontend
npm run dev
```
