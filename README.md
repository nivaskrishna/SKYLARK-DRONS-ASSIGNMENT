
PROJECT LIVE DEMO
https://frontend-murex-omega-39.vercel.app

# Skylark Drones - Monday.com Business Intelligence Agent

An executive AI Business Intelligence Agent designed for founders and executives at Skylark Drones. It dynamically reads data from Monday.com boards (Deals & Work Orders), performs automated data sanitization, computes cross-board analytics, and generates intelligent business insights, risks, recommendations, and leadership updates.

![Skylark Drones BI Agent](https://img.shields.io/badge/Stack-FastAPI%20%7C%20React%20%7C%20Gemini%20%7C%20Monday.com-blue)

---

## 🌟 Key Features

1. **Dynamic Monday.com Integration (Read-Only)**:
   - Uses Monday.com GraphQL API v2 to discover and fetch items dynamically. No hardcoded CSV files.
   - Dynamic column title resolution ensures resilience even when column IDs change.

2. **Automated Data Cleaning & Quality Audit**:
   - Handles `NULL` values, trims spaces, standardizes company/owner codes (`WOCOMPANY_xxx`, `OWNER_xxx`), converts dates to ISO format (`YYYY-MM-DD`), and detects duplicates.
   - Generates explicit Data Quality Audit reports with confidence scores.

3. **Conversational Executive AI Analyst**:
   - Classifies query intent into 10 categories: Revenue, Pipeline, Work Orders, Risk, Operations, Delivery, Sector Analysis, Leadership Summary, Cross Board Analytics, Forecasting.
   - Automatically asks clarifying questions when prompts are ambiguous (e.g., *"How is our business?"*).
   - Generates structured executive responses: Executive Summary, KPI Grid, Insights, Risks, Recommendations, Data Quality Notes, Confidence Score.

4. **Executive SaaS Dark Dashboard**:
   - Built with React + Vite in a modern glassmorphic dark theme.
   - Features interactive Recharts visual graphs, delayed work order escalation tables, owner workload matrices, and an Executive Leadership Sync generator.

---

## 🛠 Tech Stack

- **Backend**: Python 3.11, FastAPI, Uvicorn, HTTPX, Pydantic, Pytest
- **Frontend**: React 18, Vite, Lucide React Icons, Recharts, Custom Dark Glassmorphism CSS
- **AI Engine**: Google Gemini API (`gemini-1.5-flash`) + Fallback Executive Analyst Engine
- **Integration**: Monday.com API v2 GraphQL (`https://api.monday.com/v2`)

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- Python 3.10+ installed
- Node.js 18+ installed

### 1. Backend Setup (FastAPI)

```bash
# Navigate to project root
cd mondayCom

# Create virtual environment & install dependencies
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt  # or install fastapi uvicorn httpx pydantic requests python-dotenv google-generativeai pytest pytest-asyncio

# Create environment variables (.env)
cat <<EOT > .env
MONDAY_API_TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjY4NDg6MjI1..."
GEMINI_API_KEY="your-gemini-api-key-optional"
EOT

# Start FastAPI backend server
PYTHONPATH=. uvicorn backend.main:app --reload --port 8000
```

Backend will run at `http://localhost:8000` (Swagger docs available at `http://localhost:8000/docs`).

### 2. Backend Automated Tests

```bash
# Run backend pytest suite
PYTHONPATH=. ./venv/bin/pytest tests/test_analytics.py -v
```

### 3. Frontend Setup (React)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Frontend will run at `http://localhost:5173`.

---

## 🔌 API Endpoint Reference

| Endpoint | Method | Description |
|---|---|---|
| `GET /` | `GET` | System health check |
| `POST /api/chat` | `POST` | Process natural language question & return executive response |
| `GET /api/dashboard` | `GET` | Fetch overall KPI metrics, sector breakdown & delayed work orders |
| `GET /api/data-quality` | `GET` | Fetch itemized data quality audit report & confidence rating |
| `POST /api/leadership-update` | `POST` | Generate executive sync update brief for leadership |
| `GET /api/boards/refresh` | `GET` | Force real-time refresh from Monday API v2 |

---

## 🌐 Deployment Instructions

- **Frontend Deployment (Vercel)**:
  - Import `frontend/` directory to Vercel.
  - Set build command: `npm run build` and output directory: `dist`.

- **Backend Deployment (Render / Railway)**:
  - Deploy `backend/` directory as a Web Service.
  - Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`.
  - Add Environment Variable `MONDAY_API_TOKEN`.

---

## 📄 Deliverables

- `DECISION_LOG.md`: 2-page executive decision log detailing key assumptions, trade-offs, leadership update design, and future enhancements.
- `README.md`: Complete setup and architecture guide.
- `tests/`: Automated unit & integration test suite.
