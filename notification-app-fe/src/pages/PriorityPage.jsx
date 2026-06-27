import { useState, useEffect, useMemo } from "react";
import { Box, Typography, Slider, CircularProgress, Alert, Stack, Chip } from "@mui/material";
import { Log } from "affordmed-logging-middleware";
import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { fetchNotifications } from "../api/notifications";

const TYPE_WEIGHT = { Placement: 3, Result: 2, Event: 1 };

function calculateScore(notification) {
  const weight = TYPE_WEIGHT[notification.Type] || 0;
  const recency = new Date(notification.Timestamp).getTime();
  return weight * 1e13 + recency;
}

export default function PriorityPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topN, setTopN] = useState(10);
  const [filter, setFilter] = useState("All");
  const [viewedIds, setViewedIds] = useState(() => {
    const saved = localStorage.getItem("viewedNotifications");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    Log("frontend", "info", "page", "Priority Inbox page mounted");
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications({ limit: 50 });
      setNotifications(data);
      await Log("frontend", "info", "state", `Priority page loaded ${data.length} notifications`);
    } catch (err) {
      setError(err.message);
      await Log("frontend", "error", "api", `Priority page fetch failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const prioritized = useMemo(() => {
    let filtered = notifications;
    if (filter && filter !== "All") {
      filtered = notifications.filter((n) => n.Type === filter);
    }
    const scored = filtered.map((n) => ({ ...n, score: calculateScore(n) }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topN);
  }, [notifications, topN, filter]);

  const handleView = (id) => {
    const updated = [...new Set([...viewedIds, id])];
    setViewedIds(updated);
    localStorage.setItem("viewedNotifications", JSON.stringify(updated));
    Log("frontend", "info", "state", `Priority: notification ${id} marked as viewed`);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>Priority Inbox</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing top {topN} notifications ranked by importance (Placement &gt; Result &gt; Event) and recency.
      </Typography>

      <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <Box sx={{ minWidth: 200 }}>
          <Typography variant="caption">Top N:</Typography>
          <Slider
            value={topN}
            onChange={(e, v) => { setTopN(v); Log("frontend", "debug", "component", `TopN slider: ${v}`); }}
            min={5} max={30} step={5}
            marks={[{value:5,label:"5"},{value:10,label:"10"},{value:15,label:"15"},{value:20,label:"20"},{value:30,label:"30"}]}
            valueLabelDisplay="auto"
          />
        </Box>
        <NotificationFilter value={filter} onChange={setFilter} />
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip label={`Showing: ${prioritized.length}`} size="small" />
        <Chip label="Placement = High" color="success" size="small" variant="outlined" />
        <Chip label="Result = Medium" color="warning" size="small" variant="outlined" />
        <Chip label="Event = Low" color="info" size="small" variant="outlined" />
      </Stack>

      {loading && <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>}
      {!loading && error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && prioritized.length === 0 && <Alert severity="info">No notifications match criteria.</Alert>}

      {!loading && !error && prioritized.length > 0 && (
        <Stack spacing={1.5}>
          {prioritized.map((n, i) => (
            <NotificationCard
              key={n.ID}
              notification={n}
              rank={i + 1}
              isNew={!viewedIds.includes(n.ID)}
              onView={handleView}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
