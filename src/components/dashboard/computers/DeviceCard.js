// components/DeviceCard.jsx
import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Chip,
  Stack,
  Typography,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import ComputerIcon from "@mui/icons-material/Computer";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import EditIcon from "@mui/icons-material/Edit";

function formatDate(value) {
  if (!value) return "-";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusConfig(status) {
  // Adapte selon tes enums ClassDevice.STATUS
  const map = {
    AVAILABLE: { label: "Disponible", color: "success" },
    BUSY: { label: "Occupé", color: "warning" },
    MAINTENANCE: { label: "Maintenance", color: "info" },
    HS: { label: "HS", color: "error" },
    DISABLED: { label: "Désactivé", color: "default" },
  };

  return map[status] || { label: status || "Inconnu", color: "default" };
}

export default function DeviceCard({
  device,
  onClick,
  onEdit,
  onToggleEnabled,
}) {
  if (!device) return null;

  const {
    uid,
    uid_intern,
    uid_room,
    name,
    name_normalized,
    office,
    enabled,
    status,
    type,
    last_update,
    created_time,
    last_edit_time,
  } = device;

  const statusCfg = getStatusConfig(status);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow 0.2s, transform 0.1s",
        "&:hover": onClick
          ? {
              boxShadow: 4,
              transform: "translateY(-2px)",
            }
          : undefined,
      }}
      onClick={onClick}
    >
      <CardHeader
        avatar={<ComputerIcon />}
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1" fontWeight={600}>
              {name || uid || "Appareil"}
            </Typography>
            {uid_room && (
              <Chip
                size="small"
                label={`Salle ${uid_room}`}
                variant="outlined"
              />
            )}
          </Stack>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            UID: {uid || "-"}
          </Typography>
        }
      />

      <Divider />

      <CardContent>
        <Stack spacing={1.2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
              Statut :
            </Typography>
            <Chip
              size="small"
              label={statusCfg.label}
              color={statusCfg.color}
              variant={statusCfg.color === "default" ? "outlined" : "filled"}
            />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
              Type :
            </Typography>
            <Typography variant="body2">
              {type || "-"}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
              Bureau :
            </Typography>
            <Typography variant="body2">
              {office || "-"}
            </Typography>
          </Stack>

          {uid_intern && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minWidth: 90 }}
              >
                ID interne :
              </Typography>
              <Typography variant="body2">{uid_intern}</Typography>
            </Stack>
          )}

          {name_normalized && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minWidth: 90 }}
              >
                Nom norm. :
              </Typography>
              <Typography variant="body2">{name_normalized}</Typography>
            </Stack>
          )}

          <Divider flexItem sx={{ my: 0.5 }} />

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 90 }}>
              Créé le :
            </Typography>
            <Typography variant="caption">
              {formatDate(created_time)}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 90 }}>
              Dernière maj :
            </Typography>
            <Typography variant="caption">
              {formatDate(last_update || last_edit_time)}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>

      <CardActions
        sx={{
          justifyContent: "space-between",
          px: 2,
          pb: 1.5,
        }}
      >
        <Chip
          size="small"
          label={enabled ? "Activé" : "Désactivé"}
          color={enabled ? "success" : "default"}
          variant={enabled ? "outlined" : "filled"}
        />

        <Stack direction="row" spacing={1}>
          {onToggleEnabled && (
            <Tooltip title={enabled ? "Désactiver l'appareil" : "Activer l'appareil"}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleEnabled(device);
                }}
              >
                <PowerSettingsNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {onEdit && (
            <Tooltip title="Modifier l'appareil">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(device);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
}
