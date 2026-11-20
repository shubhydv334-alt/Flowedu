# FlowEdu — Intelligent Academic Workflow Automation Platform

FlowEdu is a full-stack academic management system that automates student engagement workflows using AI-powered messaging, real-time risk detection, and multi-channel notifications. Built for colleges and universities to monitor student performance and trigger automated interventions.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-green)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Features

### Core Academic Management
- **Department & Course Management** — Create and organize departments, courses with teacher assignments
- **Student Records** — Comprehensive student profiles with roll numbers, sections, batches
- **Attendance Tracking** — Course-wise attendance percentage monitoring
- **Marks Management** — Exam-wise marks recording with percentage calculations
- **Assignment Tracking** — Assignment creation, deadline management, submission tracking

### Workflow Automation Engine
- **Visual Workflow Builder** — Drag-and-drop interface to create automation rules
- **Trigger Types:**
  - **Event-based** — MARKS_UPLOADED, ASSIGNMENT_SUBMITTED
  - **Cron-based** — Scheduled recurring workflows (e.g., weekly summaries)
  - **Date-based** — X days before assignment deadline or exam date
- **Action Types:**
  - **Email** — Send templated emails via SMTP
  - **Telegram** — Send messages via Telegram Bot API
  - **AI-Generated Messages** — Multi-provider AI with failover (Gemini → Groq → OpenRouter)
  - **Webhook** — HTTP POST to external services
- **Template Library** — 5 pre-built workflow templates for common scenarios
- **Condition Engine** — Filter workflows by attendance %, marks, submission status
- **Audience Targeting** — Filter by department, semester, section, batch
- **Digest Mode** — Aggregate student data into teacher summary reports
- **Retry & Fallback** — 3 retry attempts with AI fallback to plain templates

### Student Engagement
- **At-Risk Detection** — Algorithmic risk scoring (attendance 40%, marks 35%, submissions 25%)
- **Personalized Student Dashboard** — Academic overview, upcoming deadlines, marks summary
- **Bulk Announcements** — Multi-channel announcements with audience targeting
- **In-App Notifications** — Real-time notification inbox with read/unread tracking

### Administration
- **User Management** — CRUD operations with role assignment (ADMIN, TEACHER, STUDENT)
- **Audit Logging** — Track all administrative actions with timestamps
- **CSV Import/Export** — Bulk data operations for students, attendance, marks
- **Profile Management** — Self-service profile editing and password change
- **Forgot Password** — Email-based password reset flow

### Security
- **JWT Authentication** — Stateless token-based auth with 24-hour expiry
- **Role-Based Access Control** — Three roles: ADMIN, TEACHER, STUDENT
- **Spring Security** — @PreAuthorize annotations on sensitive endpoints
- **Ownership Verification** — Users can only modify their own notifications
- **Authenticated Downloads** — CSV exports require valid JWT tokens

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA |
| **Database** | H2 (file-based, zero config) — easily switchable to PostgreSQL/MySQL |
| **Frontend** | React 18, Vite 5, React Router v7 |
| **Auth** | JWT (HMAC-SHA256) with role claims |
| **AI** | Multi-provider: Google Gemini, Groq, OpenRouter |
| **Messaging** | JavaMail (SMTP), Telegram Bot API |
| **Build** | Maven (backend), npm + Vite (frontend) |

---

## Project Structure

```
FlowEdu/
├── backend/
│   ├── pom.xml                          # Maven dependencies
│   └── src/main/
│       ├── java/com/flowedu/
│       │   ├── FlowEduApplication.java  # Spring Boot entry point
│       │   ├── Domain.java              # 13 JPA entities
│       │   ├── Repos.java               # Spring Data repositories
│       │   ├── SecurityConfig.java      # JWT filter + security rules
│       │   ├── JwtService.java          # Token creation/validation
│       │   ├── AuthController.java      # Login, users, profile, password
│       │   ├── InsightsController.java  # Academic CRUD + dashboards
│       │   ├── WorkflowController.java  # Workflow CRUD + execution
│       │   ├── WorkflowEngine.java      # Core execution engine
│       │   ├── WorkflowSupport.java     # Template rendering + conditions
│       │   ├── Triggers.java            # Event/cron/date triggers
│       │   ├── Action.java              # Action interface
│       │   ├── Actions.java             # Email, Telegram, AI, Webhook
│       │   ├── TemplateController.java  # 5 workflow templates
│       │   ├── RiskController.java      # At-risk student detection
│       │   ├── AnnouncementController.java
│       │   ├── NotificationController.java
│       │   ├── ImportService.java       # CSV parsing
│       │   ├── ImportController.java    # File upload endpoint
│       │   ├── ExportController.java    # CSV download
│       │   ├── AuditService.java        # Centralized audit logging
│       │   ├── AuditController.java     # Audit log viewer
│       │   ├── DataSeeder.java          # Demo data on first run
│       │   └── ApiErrors.java           # Global error handler
│       └── resources/
│           └── application.yml          # App configuration
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx                     # React entry point
│       ├── App.jsx                      # Router + layout + navigation
│       ├── api.js                       # API client + download helper
│       ├── auth.jsx                     # Auth context provider
│       ├── ui.jsx                       # Reusable UI components
│       ├── meta.js                      # App metadata + constants
│       ├── tokens.css                   # Design tokens
│       ├── components.css               # Component styles
│       ├── app.css                      # Layout styles
│       ├── charts.css                   # Chart styles
│       └── pages/
│           ├── Login.jsx
│           ├── Academics.jsx            # Tabbed academic management
│           ├── WorkflowBuilder.jsx      # Visual workflow editor
│           ├── Logs.jsx                 # Execution log viewer
│           ├── ImportPage.jsx           # CSV import
│           ├── StudentDashboard.jsx     # Student-only dashboard
│           ├── AtRisk.jsx               # Risk monitoring
│           ├── Announcements.jsx        # Bulk messaging
│           ├── Notifications.jsx        # Notification inbox
│           ├── UserManagement.jsx       # Admin user CRUD
│           ├── Profile.jsx              # Self-service profile
│           └── AuditLog.jsx             # Admin activity log
└── sample-data/
    ├── students.csv
    ├── attendance.csv
    └── marks.csv
```

---

## Getting Started

### Prerequisites
- **Java 21** (JDK)
- **Maven 3.9+**
- **Node.js 18+** and npm

### 1. Clone the repository
```bash
git clone https://github.com/shubhydv334-alt/Flowedu.git
cd Flowedu
```

### 2. Start the backend
```bash
cd backend
mvn spring-boot:run
```
The API server starts at `http://localhost:8080/api`.

### 3. Start the frontend
```bash
cd frontend
npm install
npm run dev
```
The dev server starts at `http://localhost:5173` and proxies API calls to the backend.

### 4. Login with demo credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@flowedu.local` | `admin123` |
| **Teacher** | `teacher@flowedu.local` | `teacher123` |
| **Student** | `student@flowedu.local` | `student123` |

---

## Configuration

### Environment Variables (application.yml)

| Property | Default | Description |
|----------|---------|-------------|
| `flowedu.jwt-secret` | `change-me-...` | JWT signing secret (change in production!) |
| `flowedu.gemini-key` | — | Google Gemini API key for AI workflows |
| `flowedu.groq-key` | — | Groq API key (AI fallback) |
| `flowedu.openrouter-key` | — | OpenRouter API key (AI fallback) |
| `flowedu.telegram-bot-token` | — | Telegram Bot API token |
| `spring.mail.*` | — | SMTP configuration for email actions |

### Database
By default, FlowEdu uses an **H2 file database** stored at `./data/flowedu`. To switch to PostgreSQL or MySQL, update the `spring.datasource` section in `application.yml`.

---

## API Endpoints

### Authentication
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login (public) |
| POST | `/api/auth/forgot-password` | Password reset (public) |
| GET | `/api/auth/me` | Current user profile |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/change-password` | Change password |
| GET | `/api/auth/users` | List users (admin) |
| POST | `/api/auth/users` | Create user (admin) |

### Academic Data
| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/departments` | Departments CRUD |
| GET/POST | `/api/courses` | Courses CRUD |
| GET/POST | `/api/students` | Students CRUD |
| GET/POST | `/api/assignments` | Assignments CRUD |
| GET/POST | `/api/exams` | Exams CRUD |
| GET | `/api/attendance` | Attendance records |
| GET | `/api/marks` | Marks records |
| GET | `/api/dashboard/student` | Student dashboard data |

### Workflows
| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/workflows` | Workflow CRUD |
| POST | `/api/workflows/{id}/run` | Execute workflow |
| GET | `/api/runs` | Execution logs |
| GET | `/api/templates` | Workflow templates |

### Other
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/risk/at-risk` | At-risk students |
| POST | `/api/announcements` | Send announcements |
| GET | `/api/notifications` | User notifications |
| POST | `/api/import/{type}` | CSV import |
| GET | `/api/export/{type}` | CSV export |
| GET | `/api/audit-logs` | Audit trail (admin) |

---

## Screenshots

The application features a modern, responsive UI with:
- Clean sidebar navigation with role-based menu items
- Card-based layouts with search and filter capabilities
- Visual workflow builder with step configuration
- Real-time execution log viewer with expandable details
- Student dashboard with academic performance overview

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
