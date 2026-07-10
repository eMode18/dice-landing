import { useState } from "react";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";
import { getStoredToken } from "../../lib/api";

export function AdminPage() {
  const [authed, setAuthed] = useState(() => Boolean(getStoredToken()));

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  return <AdminDashboard onLogout={() => setAuthed(false)} />;
}
