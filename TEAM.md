# FlowEdu — Team Contributions

## Team Members & Responsibilities

This project was developed by a team of **4 members**, each responsible for a distinct module of the platform.

---

## Member 1 — Backend Core & Security

**Role:** Backend Architect & Security Lead

**Responsibility:** Designed and implemented the entire backend foundation — database schema, authentication system, security configuration, and core API infrastructure. Built the data layer with 13 JPA entities and all repository interfaces. Implemented JWT-based stateless authentication with role-based access control (ADMIN, TEACHER, STUDENT).

### Files Developed

| File | Lines | Description |
|------|:-----:|-------------|
| `backend/src/main/java/com/flowedu/Domain.java` | 182 | 13 JPA entities (User, Student, Course, Department, Assignment, Exam, AttendanceRecord, MarkRecord, Workflow, WorkflowRun, StepLog, AuditLog, Notification) |
| `backend/src/main/java/com/flowedu/Repos.java` | 65 | Spring Data JPA repository interfaces for all entities |
| `backend/src/main/java/com/flowedu/SecurityConfig.java` | 60 | Spring Security configuration with JWT filter chain, CORS, CSRF |
| `backend/src/main/java/com/flowedu/JwtService.java` | 39 | JWT token creation and validation with HMAC-SHA256 |
| `backend/src/main/java/com/flowedu/JwtAuthFilter.java` | 40 | HTTP filter for Bearer token extraction and authentication |
| `backend/src/main/java/com/flowedu/AuthController.java` | 130 | Login, user CRUD, profile editing, password change, forgot password |
| `backend/src/main/java/com/flowedu/InsightsController.java` | 204 | Academic data CRUD endpoints and student dashboard API |
| `backend/src/main/java/com/flowedu/AcademicController.java` | 190 | Department, course, student, assignment, exam REST endpoints |
| `backend/src/main/java/com/flowedu/ApiErrors.java` | 28 | Global exception handler (400, 404, 409 mapping) |
| `backend/src/main/java/com/flowedu/DataSeeder.java` | 84 | Demo data seeder for first-time startup |
| `backend/src/main/java/com/flowedu/FlowEduApplication.java` | 17 | Spring Boot application entry point |
| `backend/pom.xml` | 59 | Maven project configuration and dependencies |
| `backend/src/main/resources/application.yml` | 48 | Application configuration (database, JWT, CORS, AI keys) |
| `backend/run.sh` | 18 | Convenience startup script |

**Total: 1,164 lines of code across 14 files**

---

## Member 2 — Workflow Engine & Automation

**Role:** Workflow Engine Developer & AI Integration Lead

**Responsibility:** Designed and implemented the entire workflow automation engine — the core differentiator of FlowEdu. Built the trigger system (event, cron, date), condition evaluation engine, audience targeting, and multi-step action execution with retry and fallback. Integrated three AI providers (Gemini, Groq, OpenRouter) with automatic failover. Created the template library and execution logging system.

### Files Developed

| File | Lines | Description |
|------|:-----:|-------------|
| `backend/src/main/java/com/flowedu/WorkflowEngine.java` | 316 | Core execution engine: audience resolution, condition evaluation, step execution with retry |
| `backend/src/main/java/com/flowedu/WorkflowSupport.java` | 147 | Template rendering (Mustache-style), condition matching, audience filtering, JSON helpers |
| `backend/src/main/java/com/flowedu/Actions.java` | 275 | Action implementations: EmailAction, TelegramAction, AiAction (multi-provider), WebhookAction |
| `backend/src/main/java/com/flowedu/Action.java` | 20 | Action interface with type dispatch and dry-run support |
| `backend/src/main/java/com/flowedu/Triggers.java` | 88 | Event listeners (MarksUploaded, AssignmentSubmitted), cron scheduler, date trigger evaluation |
| `backend/src/main/java/com/flowedu/WorkflowController.java` | 90 | Workflow CRUD, test-run, preview, send-to-me execution modes |
| `backend/src/main/java/com/flowedu/WorkflowService.java` | 102 | Workflow business logic layer |
| `backend/src/main/java/com/flowedu/TemplateController.java` | 116 | 5 pre-built workflow templates (Low Attendance, Deadline Reminder, Low Grade, Weekly Summary, Exam Reminder) |
| `backend/src/main/java/com/flowedu/ImportService.java` | 176 | CSV import parser with auto-entity creation, fires MarksUploaded event |
| `backend/src/main/java/com/flowedu/ImportController.java` | 30 | File upload endpoint for CSV import |
| `backend/src/main/java/com/flowedu/ExportController.java` | 91 | CSV export with proper escaping and content headers |
| `backend/src/main/java/com/flowedu/RiskController.java` | 102 | At-risk student detection with weighted scoring algorithm |
| `backend/src/main/java/com/flowedu/AnnouncementController.java` | 87 | Bulk announcement system with multi-channel delivery |
| `backend/src/main/java/com/flowedu/NotificationController.java` | 47 | In-app notification inbox with ownership-verified mark-as-read |
| `backend/src/main/java/com/flowedu/AuditService.java` | 24 | Centralized audit logging service |
| `backend/src/main/java/com/flowedu/AuditController.java` | 20 | Admin-only audit log viewer endpoint |

**Total: 1,731 lines of code across 16 files**

---

## Member 3 — Frontend UI & Core Pages

**Role:** Frontend Developer & UI/UX Lead

**Responsibility:** Built the entire frontend foundation — React application shell, routing system, authentication flow, reusable UI component library, and design system. Developed the core user-facing pages: login, academics management (6 tabs), student dashboard, profile, user management, and the import/export interface. Created the CSS design tokens, component styles, and chart visualization system.

### Files Developed

| File | Lines | Description |
|------|:-----:|-------------|
| `frontend/src/App.jsx` | 105 | Main router with role-based navigation, sidebar menu, TopNav with profile/notifications |
| `frontend/src/api.js` | 64 | API client with JWT auth, `download()` for authenticated CSV export, `useApi()` data hook |
| `frontend/src/auth.jsx` | 23 | Auth context provider with role helpers (canWrite, isAdmin, etc.) |
| `frontend/src/ui.jsx` | 100 | Reusable components: Card, Button, Input, Badge, Table, Modal, Restricted |
| `frontend/src/meta.js` | 95 | Workflow variables, event types, data sources, formatters |
| `frontend/src/charts.jsx` | 263 | Bar charts, donut charts, stat cards for dashboard visualizations |
| `frontend/src/StyleGuide.jsx` | 90 | Component showcase for development reference |
| `frontend/src/main.jsx` | 16 | React DOM root with BrowserRouter |
| `frontend/src/tokens.css` | 115 | Design tokens: colors, spacing, typography, shadows |
| `frontend/src/components.css` | 116 | Component styles: cards, buttons, inputs, badges, tables |
| `frontend/src/app.css` | 51 | Layout styles: sidebar, topnav, page structure |
| `frontend/src/charts.css` | 154 | Chart and data visualization styles |
| `frontend/src/pages/Login.jsx` | 84 | Login form with forgot-password modal flow |
| `frontend/src/pages/Academics.jsx` | 248 | 6-tab academic management (departments, courses, students, assignments, exams, attendance) |
| `frontend/src/pages/StudentDashboard.jsx` | 143 | Personalized student overview with stats, marks, attendance, deadlines |
| `frontend/src/pages/Profile.jsx` | 73 | Self-service profile editing and password change |
| `frontend/src/pages/UserManagement.jsx` | 109 | Admin user CRUD with role selection |
| `frontend/src/pages/ImportPage.jsx` | 92 | CSV import with file upload and format guide |
| `frontend/index.html` | 12 | HTML entry point |
| `frontend/package.json` | 20 | npm dependencies and scripts |
| `frontend/vite.config.js` | 10 | Vite config with API proxy to backend |

**Total: 1,983 lines of code across 21 files**

---

## Member 4 — Frontend Features & Documentation

**Role:** Frontend Feature Developer & Documentation Lead

**Responsibility:** Built all advanced frontend pages — the visual workflow builder, execution log viewer, dashboard, announcement system, notifications, and at-risk monitoring. Created the full project documentation including the production-grade README, contributing guidelines, GitHub issue/PR templates, and environment configuration guide. Managed sample data files for testing.

### Files Developed

| File | Lines | Description |
|------|:-----:|-------------|
| `frontend/src/pages/WorkflowBuilder.jsx` | 347 | Visual workflow editor: trigger config, audience targeting, condition builder, multi-step actions |
| `frontend/src/pages/Dashboard.jsx` | 136 | Admin/teacher metrics overview with workflow stats and recent runs |
| `frontend/src/pages/Logs.jsx` | 101 | Real-time execution log viewer with expandable step details, auto-refresh |
| `frontend/src/pages/Workflows.jsx` | 64 | Workflow list and management page |
| `frontend/src/pages/Templates.jsx` | 50 | Template library browser for quick workflow creation |
| `frontend/src/pages/Announcements.jsx` | 104 | Bulk messaging with audience targeting and channel selection |
| `frontend/src/pages/Notifications.jsx` | 54 | Notification inbox with read/unread status |
| `frontend/src/pages/AtRisk.jsx` | 76 | At-risk student monitoring with risk score visualization |
| `frontend/src/pages/AuditLog.jsx` | 42 | Admin activity trail viewer |
| `README.md` | 513 | Production-grade startup documentation with architecture, API reference, guides |
| `docs/DESIGN-elevenlabs.md` | 504 | ElevenLabs integration design specification |
| `.env.example` | 32 | Environment variable template with setup instructions |
| `.gitignore` | 26 | Git ignore rules for Java, Node, IDE, OS files |
| `LICENSE` | 21 | MIT License |
| `.github/ISSUE_TEMPLATE/bug_report.md` | 32 | Bug report issue template |
| `.github/ISSUE_TEMPLATE/feature_request.md` | 19 | Feature request issue template |
| `.github/pull_request_template.md` | 27 | Pull request template with testing checklist |
| `sample-data/students.csv` | 4 | Sample student data for import testing |
| `sample-data/attendance.csv` | 17 | Sample attendance data |
| `sample-data/marks.csv` | 5 | Sample marks data |

**Total: 2,174 lines across 20 files**

---

## Summary

| Member | Role | Backend Files | Frontend Files | Other Files | Total Lines |
|:------:|------|:------------:|:--------------:|:-----------:|:-----------:|
| **Member 1** | Backend Core & Security | 12 | 0 | 2 | ~1,164 |
| **Member 2** | Workflow Engine & Automation | 16 | 0 | 0 | ~1,731 |
| **Member 3** | Frontend UI & Core Pages | 0 | 21 | 0 | ~1,983 |
| **Member 4** | Frontend Features & Docs | 0 | 9 | 11 | ~2,174 |
| | **Totals** | **28** | **30** | **13** | **~7,052** |

---

## How We Collaborated

1. **Member 1** built the backend foundation first — database entities, repositories, authentication, and security. This established the API contract that the frontend would consume.

2. **Member 2** built the workflow engine on top of Member 1's data layer — the trigger system, action implementations, AI integration, and all automation logic.

3. **Member 3** developed the frontend application shell, component library, design system, and all core user-facing pages that consume the APIs from Members 1 and 2.

4. **Member 4** built the advanced frontend features (workflow builder, logs, dashboards) and authored all project documentation, GitHub templates, and configuration guides.

All members used **Git feature branches** and **pull requests** for code review before merging to main.
