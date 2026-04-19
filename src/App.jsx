import { AppProvider, useApp } from "./context/AppContext";
import { TopBar, NavBar } from "./components/Layout";
import { Toast } from "./components/UI";
import { useState } from "react";
import Auth      from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Expenses  from "./pages/Expenses";
import Friends   from "./pages/Friends";
import Settings  from "./pages/Settings";

function InnerApp() {
  const { isAuthed, toastMsg, clearToast, logout } = useApp();
  const [page, setPage] = useState("dashboard");

  if (!isAuthed) return <Auth />;

  const pages = {
    dashboard: <Dashboard setPage={setPage} />,
    expenses:  <Expenses />,
    friends:   <Friends />,
    settings:  <Settings onLogout={logout} />,
  };

  return (
    <>
      <TopBar onSettings={() => setPage("settings")} />
      {pages[page] ?? pages.dashboard}
      <NavBar page={page} setPage={setPage} />
      {toastMsg && <Toast msg={toastMsg} onClose={clearToast} />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <InnerApp />
    </AppProvider>
  );
}
