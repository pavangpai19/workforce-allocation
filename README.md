# WorkforceIQ

WorkforceIQ is an intelligent enterprise workforce allocation and capacity planning platform. It combines constraint satisfaction solvers, machine learning performance quantification, and natural language explainability to optimize project staffing while preventing burnout.

---

## Architecture Overview

WorkforceIQ operates across four integrated layers:

1. **Frontend (`frontend/`)**: React 18 single-page application built with Vite and Tailwind CSS. Features dedicated role-based portals for Managers and Employees, project workspaces, and intelligent allocation review boards.
2. **Backend Engine (`work-allocation-engine/`)**: NestJS microservice exposing REST APIs for personnel directory, project staffing, decision audit trails, and multi-objective allocation optimization.
3. **ML Service (`ml-service/`)**: Python FastAPI service providing vector-based performance prediction and burnout risk estimation using scikit-learn models.
4. **Data Layer (Supabase PostgreSQL)**: Remote relational database managing core entities, constraint metadata, audit logs, and authentication mappings.

---

## Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: NestJS 11, TypeScript, `@supabase/supabase-js`, Class Validator, Axios
- **Machine Learning**: Python 3.10+, FastAPI, Pydantic, Scikit-learn, Uvicorn
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)

---

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.10 or higher
- **Supabase**: Active PostgreSQL project instance

---

## Environment Configuration

Configure the backend environment variables in `work-allocation-engine/.env`:

```env
PORT=3001
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_SERVICE_KEY=<your-supabase-service-role-key>
GEMINI_API_KEY=<optional-gemini-api-key>
ML_SERVICE_URL=http://localhost:8000
```

Frontend defaults to `http://localhost:3001`. To customize, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

---

## Installation

Install dependencies across all services:

```bash
# 1. Install Backend Dependencies
cd work-allocation-engine
npm install

# 2. Install Frontend Dependencies
cd ../frontend
npm install

# 3. Install Python ML Dependencies
cd ../ml-service
pip install -r requirements.txt
```

---

## Running the Application

Run the services in separate terminals:

### 1. ML Service (Port 8000)
```bash
cd ml-service
uvicorn main:app --reload --port 8000
```

### 2. Backend Engine (Port 3001)
```bash
cd work-allocation-engine
npm run start:dev
```

### 3. Frontend Application (Port 3000)
```bash
cd frontend
npm run dev
```

The web application will be accessible at `http://localhost:3000`.

---

## Testing & Build

```bash
# Frontend production build & type check
npm --prefix frontend run build

# Backend unit test suite
npm --prefix work-allocation-engine test

# Validate synthetic seed integrity
node workforce-seed/validate_seed_locally.cjs
```

