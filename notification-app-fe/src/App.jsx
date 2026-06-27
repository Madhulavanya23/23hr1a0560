import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Container, Tabs, Tab, Box } from "@mui/material";
import { Notifications, PriorityHigh } from "@mui/icons-material";
import { Log, setToken } from "affordmed-logging-middleware";
import { NotificationsPage } from "./pages/NotificationsPage";
import PriorityPage from "./pages/PriorityPage";

const theme = createTheme({
  palette: { primary: { main: "#1565c0" }, background: { default: "#f5f7fa" } },
  typography: { fontFamily: "'Inter', -apple-system, sans-serif" },
});

setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtYWRodWxhdmFueWFsYXZhbnlhNjIxQGdtYWlsLmNvbSIsImV4cCI6MTc4MjUzOTE0MSwiaWF0IjoxNzgyNTM4MjQxLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMjdmM2RhZDctNmUyMS00ODAwLTk2ZjMtMmU2NmYwNzYyOTJjIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibWFkaHUgbGF2YW55YSIsInN1YiI6ImI4MDk1ZmFhLWFhNjctNDkyMS1hZThmLWRjZmIxNTBjZjYwOSJ9LCJlbWFpbCI6Im1hZGh1bGF2YW55YWxhdmFueWE2MjFAZ21haWwuY29tIiwibmFtZSI6Im1hZGh1IGxhdmFueWEiLCJyb2xsTm8iOiIyM2hyMWFvNTYwIiwiYWNjZXNzQ29kZSI6ImFUa3licyIsImNsaWVudElEIjoiYjgwOTVmYWEtYWE2Ny00OTIxLWFlOGYtZGNmYjE1MGNmNjA5IiwiY2xpZW50U2VjcmV0IjoiWURGZlJqZmtXZU55UlZKYSJ9.h-jGtRLXRPmzHIxYEpZ7KEjHDLh7N39sp2qiyl3vSJc");


function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const tab = location.pathname === "/priority" ? 1 : 0;

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        <Notifications sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Campus Notifications</Typography>
        <Tabs
          value={tab}
          onChange={(e, v) => {
            navigate(v === 0 ? "/" : "/priority");
            Log("frontend", "info", "component", `Navigated to ${v === 0 ? "All" : "Priority"} page`);
          }}
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab icon={<Notifications />} label="All" />
          <Tab icon={<PriorityHigh />} label="Priority" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  useEffect(() => {
    Log("frontend", "info", "config", "App initialized");
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
          <Routes>
            <Route path="/" element={<NotificationsPage />} />
            <Route path="/priority" element={<PriorityPage />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}
