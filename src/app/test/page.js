// /pages/app/courses/index.js
"use client";
import React, { useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Button,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  useMediaQuery,
  Drawer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import { useTheme } from "@mui/material/styles";

// ---- MOCK (à remplacer par tes données Firestore) ----
const MOCK_COURSES = [
  {
    id: "excel-50",
    title: "Excel 50 - Maîtriser les bases",
    code: "EXC-050",
    category: "Bureautique",
    level: "Débutant",
    durationHours: 12,
    status: "actif",
    enrolled: 18,
    maxStudents: 25,
    tutorName: "João Pereira",
    nextSession: "2026-01-15",
    shortDescription:
      "Découvrir les fonctions essentielles d'Excel pour le monde professionnel.",
  },
  {
    id: "ai-text",
    title: "IA Textuelle - ChatGPT & Co",
    code: "AI-TXT-101",
    category: "Intelligence artificielle",
    level: "Intermédiaire",
    durationHours: 20,
    status: "brouillon",
    enrolled: 0,
    maxStudents: 30,
    tutorName: "Daniel Mbengui",
    nextSession: null,
    shortDescription:
      "Apprendre à utiliser l'IA textuelle pour gagner du temps au quotidien.",
  },
  {
    id: "web-dev",
    title: "Développement Web Moderne",
    code: "WEB-200",
    category: "Développement",
    level: "Avancé",
    durationHours: 40,
    status: "archivé",
    enrolled: 46,
    maxStudents: 50,
    tutorName: "Floriane A.",
    nextSession: "2025-11-10",
    shortDescription:
      "HTML, CSS, JavaScript moderne et introduction aux frameworks.",
  },
];

// ---- Petites fonctions UI ----
function getStatusConfig(status) {
  switch (status) {
    case "actif":
      return { label: "Actif", color: "success" };
    case "brouillon":
      return { label: "Brouillon", color: "warning" };
    case "archivé":
      return { label: "Archivé", color: "default" };
    default:
      return { label: status, color: "default" };
  }
}

export default function CoursesListPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState(null);

  const categories = useMemo(() => {
    const set = new Set(MOCK_COURSES.map((c) => c.category));
    return Array.from(set);
  }, []);

  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter((course) => {
      const text = (
        course.title +
        course.code +
        course.category +
        course.tutorName
      )
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");

      const query = search
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");

      if (query && !text.includes(query)) return false;
      if (statusFilter !== "all" && course.status !== statusFilter)
        return false;
      if (categoryFilter !== "all" && course.category !== categoryFilter)
        return false;
      return true;
    });
  }, [search, statusFilter, categoryFilter]);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setEditMode(false);
    setEditValues(course);
  };

  const handleCloseDrawer = () => {
    setSelectedCourse(null);
    setEditMode(false);
    setEditValues(null);
  };

  const handleChangeEditField = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveCourse = () => {
    // 👉 Ici tu pourras appeler ton API / Firestore pour sauvegarder
    console.log("SAVE COURSE", editValues);
    setSelectedCourse(editValues);
    setEditMode(false);
    // Optionnel : afficher un snackbar de succès
  };

  const handleCreateCourse = () => {
    // 👉 Redirection vers une page /app/courses/new ou ouverture d'un autre drawer
    console.log("Create new course…");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        p: { xs: 2, md: 3 },
      }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" mb={3} gap={2}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Liste des cours
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gère tous les modules de Dandela Academy : création, édition,
            archivage.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCourse}
        >
          Nouveau cours
        </Button>
      </Stack>

      {/* Filtres */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(15,23,42,0.15)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          gap={2}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <TextField
            fullWidth
            size="small"
            label="Rechercher un cours"
            placeholder="Titre, code, formateur…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Statut</InputLabel>
            <Select
              label="Statut"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="actif">Actifs</MenuItem>
              <MenuItem value="brouillon">Brouillons</MenuItem>
              <MenuItem value="archivé">Archivés</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Catégorie</InputLabel>
            <Select
              label="Catégorie"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">Toutes</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Liste des cours */}
      {isMobile ? (
        // --- Version cartes (mobile) ---
        <Stack spacing={2}>
          {filteredCourses.map((course) => {
            const statusCfg = getStatusConfig(course.status);
            return (
              <Paper
                key={course.id}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 10px 22px rgba(15,23,42,0.25)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.15s ease-out",
                }}
                onClick={() => handleSelectCourse(course)}
              >
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography fontWeight={600}>{course.title}</Typography>
                  <Chip
                    size="small"
                    label={statusCfg.label}
                    color={statusCfg.color}
                    variant="outlined"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {course.shortDescription}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Chip
                    size="small"
                    icon={<CategoryIcon fontSize="small" />}
                    label={course.category}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    icon={<SchoolIcon fontSize="small" />}
                    label={`Niveau : ${course.level}`}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    icon={<AccessTimeIcon fontSize="small" />}
                    label={`${course.durationHours} h`}
                    variant="outlined"
                  />
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      ) : (
        // --- Version tableau (desktop) ---
        <Paper
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 16px 40px rgba(15,23,42,0.25)",
          }}
        >
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Cours</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell>Niveau</TableCell>
                  <TableCell>Durée</TableCell>
                  <TableCell>Formateur</TableCell>
                  <TableCell align="center">Inscrits</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCourses.map((course) => {
                  const statusCfg = getStatusConfig(course.status);
                  const ratio = `${course.enrolled}/${course.maxStudents}`;
                  return (
                    <TableRow
                      key={course.id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleSelectCourse(course)}
                    >
                      <TableCell>
                        <Stack spacing={0.3}>
                          <Typography fontWeight={600}>
                            {course.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            {course.shortDescription}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{course.code}</TableCell>
                      <TableCell>{course.category}</TableCell>
                      <TableCell>{course.level}</TableCell>
                      <TableCell>{course.durationHours} h</TableCell>
                      <TableCell>{course.tutorName}</TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <PeopleIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2">{ratio}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={statusCfg.label}
                          color={statusCfg.color}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCourse(course);
                            setEditMode(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Aucun cours trouvé avec ces filtres.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Drawer détails / édition */}
      <Drawer
        anchor="right"
        open={Boolean(selectedCourse)}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: { width: { xs: "100%", md: 420 }, p: 2.5 },
        }}
      >
        {selectedCourse && editValues && (
          <Stack spacing={2} height="100%">
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="h6" fontWeight={600}>
                {editMode ? "Modifier le cours" : "Détails du cours"}
              </Typography>
              <IconButton size="small" onClick={handleCloseDrawer}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <Chip
              size="small"
              label={getStatusConfig(editValues.status).label}
              color={getStatusConfig(editValues.status).color}
              sx={{ alignSelf: "flex-start" }}
            />

            <Divider />

            <Stack spacing={1.5} flex={1} overflow="auto">
              <TextField
                label="Titre du cours"
                value={editValues.title}
                onChange={(e) =>
                  handleChangeEditField("title", e.target.value)
                }
                fullWidth
                disabled={!editMode}
              />
              <TextField
                label="Code"
                value={editValues.code}
                onChange={(e) => handleChangeEditField("code", e.target.value)}
                fullWidth
                disabled={!editMode}
              />
              <TextField
                label="Catégorie"
                value={editValues.category}
                onChange={(e) =>
                  handleChangeEditField("category", e.target.value)
                }
                fullWidth
                disabled={!editMode}
              />
              <TextField
                label="Niveau"
                value={editValues.level}
                onChange={(e) =>
                  handleChangeEditField("level", e.target.value)
                }
                fullWidth
                disabled={!editMode}
              />
              <TextField
                label="Formateur principal"
                value={editValues.tutorName}
                onChange={(e) =>
                  handleChangeEditField("tutorName", e.target.value)
                }
                fullWidth
                disabled={!editMode}
              />
              <TextField
                label="Durée (heures)"
                type="number"
                value={editValues.durationHours}
                onChange={(e) =>
                  handleChangeEditField("durationHours", Number(e.target.value))
                }
                fullWidth
                disabled={!editMode}
              />
              <TextField
                label="Description courte"
                multiline
                minRows={3}
                value={editValues.shortDescription}
                onChange={(e) =>
                  handleChangeEditField("shortDescription", e.target.value)
                }
                fullWidth
                disabled={!editMode}
              />
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Stack direction="row" justifyContent="space-between" gap={1}>
              {!editMode ? (
                <>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setEditMode(true)}
                    startIcon={<EditIcon />}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="text"
                    color="error"
                    fullWidth
                    onClick={() => console.log("TODO: archive/delete")}
                  >
                    Archiver / Supprimer
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      setEditMode(false);
                      setEditValues(selectedCourse);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSaveCourse}
                  >
                    Sauvegarder
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
        )}
      </Drawer>
    </Box>
  );
}
