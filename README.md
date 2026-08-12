# EduAware

**An AI-powered School Awareness & Life Skills Platform.**

EduAware helps schools organize, manage, and measure life-skills workshops — cybersecurity, mental health, financial literacy, digital safety, and more — through one platform instead of manual coordination over calls, WhatsApp, and spreadsheets.

## The Problem

Schools focus primarily on academics, but students also need practical life skills. Most schools don't have dedicated experts to teach these topics regularly, and the process of organizing external trainers is fragmented — manual trainer search, phone/WhatsApp coordination, Excel attendance tracking, manually created certificates, and no way to measure whether students actually learned anything.

## The Solution

EduAware provides a single platform where:
- **Schools** discover and book workshops
- **Admins** review requests and assign trainers
- **Trainers** conduct sessions, mark attendance, and launch quizzes
- **Students** take quizzes and earn verified digital certificates

The platform manages the entire workshop lifecycle — not just a one-time seminar, but bookings, assessments, certificates, and outcomes in one place.

## Core Flow

```
School registers → requests a workshop (topic, date, class, student count)
        ↓
Admin reviews the request → assigns a trainer
        ↓
Trainer conducts the session → marks attendance → creates a quiz
        ↓
Student takes the quiz → passes → auto-generated digital certificate
```

## Tech Stack

**Frontend:** React (Vite), React Router, Axios
**Backend:** Node.js, Express
**Database:** MongoDB (Mongoose ODM), hosted on MongoDB Atlas
**Auth:** JWT (JSON Web Tokens), bcrypt for password hashing

## User Roles

| Role | Capabilities |
|------|--------------|
| **School** | Register/login, submit workshop requests, track request status |
| **Admin** | View all requests, assign trainers to workshops |
| **Trainer** | View assigned workshops, mark attendance, build and publish quizzes |
| **Student** | View available quizzes, submit answers, receive certificates on passing |

## Project Structure

```
eduaware/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route logic (auth, workshops, quiz)
│   ├── middleware/      # JWT auth + role-based access control
│   ├── models/          # Mongoose schemas (User, WorkshopRequest, Quiz, Certificate)
│   ├── routes/          # API route definitions
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios instance with auth interceptor
│   │   ├── context/      # Auth context (React Context API)
│   │   ├── pages/
│   │   │   ├── auth/     # Role-specific login/register pages
│   │   │   ├── school/   # School dashboard
│   │   │   ├── trainer/  # Trainer dashboard
│   │   │   ├── student/  # Student dashboard
│   │   │   └── admin/    # Admin dashboard
│   │   └── App.jsx       # Routes
└── README.md
```

## Getting Started

### Prerequisites
- Node.js installed
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/eduaware.git
cd eduaware
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_string
```

Run the backend:
```bash
npm run dev
```
Server runs at `http://localhost:5000`

### 3. Frontend setup
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5173`

## API Overview

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a user (any role) |
| POST | `/api/auth/login` | Public | Log in, returns JWT |
| GET | `/api/users/trainers` | Admin | List all trainers |
| POST | `/api/workshops` | School | Create a workshop request |
| GET | `/api/workshops/my` | School | View own requests |
| GET | `/api/workshops` | Admin | View all requests |
| PUT | `/api/workshops/:id/assign` | Admin | Assign a trainer |
| GET | `/api/workshops/trainer` | Trainer | View assigned workshops |
| PUT | `/api/workshops/:id/attendance` | Trainer | Mark attendance, set status to conducted |
| POST | `/api/quiz` | Trainer | Create a quiz for a workshop |
| GET | `/api/quiz/available` | Student | View quizzes for conducted workshops |
| GET | `/api/quiz/:id` | Student | Get quiz questions (answers hidden) |
| POST | `/api/quiz/:id/submit` | Student | Submit answers, get score + certificate |

## Roadmap

Features planned beyond the MVP:
- AI-generated quizzes from workshop material
- Trainer marketplace with commission-based bookings
- CSR and NGO analytics dashboards
- Feedback analysis and personalized learning resources
- Impact reports and topic-wise performance analytics for schools

## Vision

*"Every school teaches mathematics, science, and languages. EduAware exists to ensure every student also learns the life skills needed to stay safe, healthy, and prepared for the future."*

## License

This project was built as an academic/portfolio MVP. License terms to be determined.
