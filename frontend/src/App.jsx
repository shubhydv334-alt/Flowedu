import React from "react";
import { Routes, Route, Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { TopNav, Button } from "./ui";
import { useAuth } from "./auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Academics from "./pages/Academics";
import ImportPage from "./pages/ImportPage";
import Workflows from "./pages/Workflows";
import WorkflowBuilder from "./pages/WorkflowBuilder";
import Templates from "./pages/Templates";
import Logs from "./pages/Logs";
import StyleGuide from "./StyleGuide";
import UserManagement from "./pages/UserManagement";
import Profile from "./pages/Profile";
import StudentDashboard from "./pages/StudentDashboard";
import Notifications from "./pages/Notifications";
import AtRisk from "./pages/AtRisk";
import Announcements from "./pages/Announcements";
import AuditLog from "./pages/AuditLog";

const MENU = {
  ADMIN: [
    ["Dashboard", "/dashboard"], ["Academics", "/academics"], ["Import", "/import"],
    ["Workflows", "/workflows"], ["Templates", "/templates"], ["Logs", "/logs"],
    ["At Risk", "/at-risk"], ["Announcements", "/announcements"],
    ["Users", "/users"], ["Audit Log", "/audit"],
  ],
  TEACHER: [
    ["Dashboard", "/dashboard"], ["Academics", "/academics"], ["Import", "/import"],
    ["Workflows", "/workflows"], ["Templates", "/templates"], ["Logs", "/logs"],
    ["At Risk", "/at-risk"], ["Announcements", "/announcements"],
  ],
  STUDENT: [["Dashboard", "/dashboard"], ["Academics", "/academics"], ["Notifications", "/notifications"]],
};

function Layout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const items = (MENU[user.role] || MENU.STUDENT).map(([label, href]) => ({ label, href }));
  const active = items.find((i) => pathname.startsWith(i.href))?.href;
  return (
    <>
      <TopNav
        brand="FlowEdu"
        items={items}
        activePath={active}
        renderLink={(it, cls) => <Link key={it.href} to={it.href} className={cls}>{it.label}</Link>}
        actions={
          <>
            <Link to="/profile" className="caption muted" style={{ textDecoration: "none" }}>{user.name} · {user.role.toLowerCase()}</Link>
            <Button variant="outline" className="btn-sm" onClick={logout}>Sign out</Button>
          </>
        }
      />
      <main className="container page">
        <Outlet />
      </main>
    </>
  );
}

function Protected() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout />;
}

function Restricted({ children }) {
  const { canWrite } = useAuth();
  return canWrite ? children : <Navigate to="/dashboard" replace />;
}

function DashboardSwitch() {
  const { user } = useAuth();
  return user?.role === "STUDENT" ? <StudentDashboard /> : <Dashboard />;
}

export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/styleguide" element={<StyleGuide />} />
      <Route element={<Protected />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardSwitch />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/import" element={<Restricted><ImportPage /></Restricted>} />
        <Route path="/workflows" element={<Restricted><Workflows /></Restricted>} />
        <Route path="/workflows/new" element={<Restricted><WorkflowBuilder /></Restricted>} />
        <Route path="/workflows/:id" element={<Restricted><WorkflowBuilder /></Restricted>} />
        <Route path="/templates" element={<Restricted><Templates /></Restricted>} />
        <Route path="/logs" element={<Restricted><Logs /></Restricted>} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/at-risk" element={<Restricted><AtRisk /></Restricted>} />
        <Route path="/announcements" element={<Restricted><Announcements /></Restricted>} />
        <Route path="/users" element={<Restricted><UserManagement /></Restricted>} />
        <Route path="/audit" element={<Restricted><AuditLog /></Restricted>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
