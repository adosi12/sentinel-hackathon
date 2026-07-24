# Sentinel - AI Assisted Incident Intelligence Platform

Sentinel is a production-grade enterprise application designed to reduce MTTR through AI-powered historical intelligence, dependency analysis, and automated incident triage.

## Architecture

- **Frontend**: React 19, Next.js 15, TailwindCSS, Zustand, React Query
- **Backend**: FastAPI, PostgreSQL, Redis, ChromaDB
- **AI Core**: Multi-agent orchestration using Google Gemini 3.1 Pro

## Setup Instructions

Ensure you have Docker and Docker Compose installed.

### 1. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://sentinel:sentinel_password@db:5432/sentinel_db
REDIS_URL=redis://redis:6379/0
CHROMA_HOST=chromadb
CHROMA_PORT=8000
GEMINI_API_KEY=your_real_gemini_api_key_here
```

### 2. Run with Docker Compose

```bash
docker-compose up --build -d
```

Services will be available at:
- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Documentation (Swagger)**: http://localhost:8001/docs

### 3. Generate Synthetic Enterprise Data

To populate the application with realistic banking incidents:

```bash
docker exec -it sentinel-backend python scripts/generate_synthetic_data.py
```

## Features

- **Live System Map**: Interactive dependency graph showing blast radius.
- **AI Reasoning Panel**: Transparent chain of reasoning (Historical Match, Repository Findings, Confidence).
- **Incident Feed**: Real-time incident intake and triage.
- **Business Impact Engine**: Evaluates estimated financial exposure and MTTR saved.
- **AI-Powered Security Guardrails**: Proactively preventing vulnerabilities and decreasing ACM findings through automated, AI-driven real-time analysis and policy enforcement.
