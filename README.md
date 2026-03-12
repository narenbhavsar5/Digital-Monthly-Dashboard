# BenchWise — Digital Practice Monthly Updates Dashboard

A multi-region practice management system with Dashboard, Data Entry, Region Management, and User Profile pages.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (Dark Mode) |
| Charts | Recharts |
| Icons | Lucide React |
| API | GraphQL (Apollo Client) |
| Backend | Python FastAPI + Strawberry GraphQL |
| Database | MongoDB + Motor (async driver) |

## Prerequisites

- Python 3.9+
- Node.js 20+
- MongoDB running on `localhost:27017`

## Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Seed the Database

```bash
cd backend
python -m seed
```

### 3. Start the Backend

```bash
cd backend
python main.py
# or: uvicorn main:app --reload --port 8000
```

The GraphQL playground will be available at http://localhost:8000/graphql

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Environment Variables

Copy `.env.example` files to `.env` in both `backend/` and `frontend/` directories.

See the root `.env.example` for all available variables.

## Features

- **Dashboard**: Region selector (default: India), month navigation, key metrics cards, Recharts visualizations (headcount pie, diversity donut, attrition trend, revenue bars), pre-sales pipeline, grouped tables, action plans, challenges
- **Data Entry**: 8-tab interface with CRUD forms, drag-and-drop ordering for Pre-Sales and Action Plans
- **Region Management**: Full CRUD with active/inactive toggle
- **User Profile**: Personal info, notification preferences, theme toggle, default region

## Project Structure

```
bench-wise/
├── backend/
│   ├── app/
│   │   ├── config.py        # Environment config
│   │   ├── database.py      # MongoDB connection
│   │   ├── models.py        # Pydantic models
│   │   └── schema/
│   │       ├── types.py     # GraphQL types
│   │       └── resolvers.py # Queries & Mutations
│   ├── main.py              # FastAPI app
│   ├── seed.py              # Database seeder
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # Sidebar
│   │   ├── graphql/         # Apollo client & queries
│   │   ├── pages/           # Dashboard, DataEntry, Regions, Profile
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css        # Design system
│   └── index.html
└── .env.example
```
