# Habiko ⚡ AI-Powered Habit Tracker

A modern, full-stack habit tracking application built with React, TypeScript, Bun, Express, MongoDB, and the Google Gemini API. Habiko combines habit tracking and visualization with personalized AI recommendations, streak recovery plans, weekly insights, and contextual habit coaching.

**Live Demo:** https://habiko-ai.vercel.app
**Backend API:** https://habiko-backend.onrender.com

---

## ✨ Features

- **Daily & Weekly Tracking:** Create and track habits with daily or weekly schedules.
- **Streak & Momentum Engine:** Automatically calculates active streaks, personal bests, and consistency scores.
- **AI Morning Motivation:** Generates personalized daily motivation based on current streaks and progress.
- **AI Habit Recommendations:** Suggests personalized habits based on goals, productive time, schedules, and past struggles.
- **AI Streak Recovery:** Provides actionable 3-day recovery plans when significant streaks are broken.
- **AI Weekly Reports:** Generates personalized weekly reviews based on recent habit performance.
- **AI Habit Chat:** Ask natural-language questions about historical habit data and receive contextual insights.
- **Interactive Visualizations:** Includes a 90-day GitHub-style consistency heatmap and circular completion indicators.

---

## 🧠 AI Features

Habiko uses the Google Gemini API to provide personalized habit coaching, including:

**Morning motivation**
**Habit recommendations**
**Streak recovery plans**
**Weekly performance reports**
**Conversational habit analysis**

AI responses are generated using the user's available habit data and relevant context to provide personalized recommendations.

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React + Vite + TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React + React Icons
- **Animations:** Canvas Confetti
- **HTTP Client:** Axios with JWT interceptors
- **Deployment:** Vercel

### Backend

- **Runtime:** Bun
- **Framework:** Express.js + TypeScript
- **Database:** MongoDB Atlas + Mongoose
- **AI:** Google Gemini API
- **Authentication:** JWT + bcryptjs
- **Deployment:** Render

---

## 📁 Project Structure

```text
habiko/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── server.ts
│   ├── package.json
│   └── bun.lock
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── bun.lock
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+) or Bun
- MongoDB connection URI
- Google Gemini API key

---

### 1. Backend Setup

```
cd backend
bun install
```

Create a `.env` file in the `backend` root

```
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.6-flash
FRONTEND_URL=http://localhost:5173
```

Seed Sample Data (Optional)

```
bun run seed
```

Start the development server:

```
bun run dev
```

The backend will run on:

```
http://localhost:5000
```

### 1. Frontend Setup

```
cd frontend
bun install
```

Create a `.env` file in the `frontend` root:

```
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:

```
bun run dev
```

The frontend will run on:

```
http://localhost:5173
```

---

## 📡 API Reference Overview

| Route                    | Method            | Description                                   |
| ------------------------ | ----------------- | --------------------------------------------- |
| `/api/auth/register`     | `POST`            | Register a new user                           |
| `/api/auth/login`        | `POST`            | Authenticate user & get token                 |
| `/api/habits`            | `GET` / `POST`    | Fetch all user habits or create a new habit   |
| `/api/habits/:id`        | `PUT` / `DELETE`  | Update or remove a habit                      |
| `/api/logs`              | `POST` / `DELETE` | Mark or unmark a habit log for a given date   |
| `/api/logs/heatmap`      | `GET`             | 90-day aggregated completion metrics          |
| `/api/ai/morning`        | `GET`             | Generate morning motivation greeting          |
| `/api/ai/suggest-habits` | `POST`            | AI-generated habit suggestions                |
| `/api/ai/recovery-plan`  | `POST`            | Generate recovery advice for broken streaks   |
| `/api/ai/weekly-report`  | `POST`            | Compile weekly AI review                      |
| `/api/ai/chat`           | `POST`            | Ask questions regarding historical habit data |

---

## 🌐 Deployment

Frontend: The frontend is deployed on Vercel.
https://habiko-ai.vercel.app

Backend: The backend is deployed on Render.
https://habiko-backend.onrender.com

The production frontend communicates with the backend through the VITE_API_URL environment variable.

---

### 📄 License

This project is for educational and portfolio purposes.

---

Designed & Made by Nihal Sheikh
