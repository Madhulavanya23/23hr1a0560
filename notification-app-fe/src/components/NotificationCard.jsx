import { Card, CardContent, Typography, Chip, Stack, Box, Avatar } from "@mui/material";
import { Event, School, Work, FiberNew } from "@mui/icons-material";
import { Log } from "affordmed-logging-middleware";

const typeIcons = { Event: <Event />, Result: <School />, Placement: <Work /> };
const typeColors = { Event: "info", Result: "warning", Placement: "success" };

export function NotificationCard({ notification, isNew, onView, rank }) {
  const handleClick = () => {
    if (isNew && onView) {
      onView(notification.ID);
      Log("frontend", "info", "component", `Notification clicked: ${notification.ID} [${notification.Type}]`);
    }
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: isNew ? "pointer" : "default",
        border: isNew ? "2px solid #1976d2" : "1px solid #e0e0e0",
        bgcolor: isNew ? "#e3f2fd" : "#fff",
        transition: "all 0.2s",
        "&:hover": { boxShadow: 3, transform: "translateY(-1px)" },
      }}
    >
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {rank && (
            <Avatar sx={{ width: 28, height: 28, fontSize: 14, bgcolor: "primary.main" }}>
              {rank}
            </Avatar>
          )}
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                {typeIcons[notification.Type]}
                <Typography variant="body1" fontWeight={isNew ? 700 : 400}>
                  {notification.Message}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                {isNew && <FiberNew color="primary" fontSize="small" />}
                <Chip label={notification.Type} size="small" color={typeColors[notification.Type] || "default"} />
              </Stack>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              {new Date(notification.Timestamp).toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
