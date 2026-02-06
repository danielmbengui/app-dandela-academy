"use client";

import React, { useMemo, useState } from "react";
import { IconCertificate } from "@/assets/icons/IconsComponent";
import {
    NS_BUTTONS,
    NS_DASHBOARD_MENU,
    NS_DIPLOMAS,
    NS_FORM,
    NS_LANGS,
    languages,
} from "@/contexts/i18n/settings";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter, useParams } from "next/navigation";
import { PAGE_ADMIN_DIPLOMAS, PAGE_ADMIN_ONE_DIPLOMA } from "@/contexts/constants/constants_pages";
import { useDiploma } from "@/contexts/DiplomaProvider";
import { useLesson } from "@/contexts/LessonProvider";
import { useLanguage } from "@/contexts/LangProvider";
import { ClassUserAdministrator } from "@/classes/users/ClassUser";
import { ClassDiploma, ClassDiplomaTranslate } from "@/classes/ClassDiploma";
import AdminPageWrapper from "@/components/wrappers/AdminPageWrapper";
import FieldComponent from "@/components/elements/FieldComponent";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import { Box, Grid, Stack, Typography, Chip, FormControlLabel, Switch, Autocomplete, TextField } from "@mui/material";
import { Icon } from "@iconify/react";
import { ClassLang } from "@/classes/ClassLang";

export default function AdminCreateDiplomaPage() {
    const router = useRouter();
    const params = useParams();
    const { uid: uidUser } = params;
    const { t } = useTranslation([ClassDiploma.NS_COLLECTION, NS_DIPLOMAS, NS_BUTTONS, NS_DASHBOARD_MENU, NS_FORM, NS_LANGS]);
    const { user } = useAuth();
    const { createDiploma, ALL_CATEGORIES, ALL_LEVELS, ALL_FORMATS, ALL_STATUS } = useDiploma();
    const { lessons } = useLesson();
    const { lang } = useLanguage();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        code: "",
        title: "",
        description: "",
        enabled: false,
        category: ClassDiploma.CATEGORY.OFFICE,
        level: ClassDiploma.LEVEL.BEGINNER,
        format: ClassDiploma.FORMAT.ONLINE,
        status: ClassDiploma.STATUS.DRAFT,
        uid_lessons: [],
        passing_percentage: 70,
        good_percentage: 80,
        excellent_percentage: 90,
        max_percentage: 100,
        duration_hours_online: 0,
        duration_hours_onsite: 0,
        exam_duration_minutes: 60,
    });

    // Photos par langue
    const [photos, setPhotos] = useState(
        languages.reduce((acc, l) => {
            acc[l] = "";
            return acc;
        }, {})
    );

    const isAuthorized = useMemo(
        () => user instanceof ClassUserAdministrator,
        [user]
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" ? parseInt(value) || 0 : value)
        }));
    };

    const handleClear = (name) => {
        setFormData((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            // Traduire les champs title et description
            const transData = {
                title: formData.title,
                description: formData.description,
            };
            const qs = encodeURIComponent(JSON.stringify(transData));
            const res = await fetch(`/api/test?lang=${lang}&translations=${qs}`);
            const data = await res.json();

            // Créer les instances de traduction avec les traductions automatiques
            const translateInstances = Object.entries(data).map(([langKey, trans]) =>
                new ClassDiplomaTranslate({
                    lang: langKey,
                    title: trans.title || "",
                    description: trans.description || "",
                    prerequisites: [],
                    goals: [],
                    photo_url: photos[langKey] || "",
                })
            );

            // Créer l'instance de diplôme
            const diploma = new ClassDiploma({
                ...formData,
                translates: translateInstances,
            });

            const created = await createDiploma(diploma);
            if (created) {
                router.push(PAGE_ADMIN_ONE_DIPLOMA(uidUser, created.uid));
            } else {
                throw new Error("Échec de la création du diplôme");
            }
        } catch (err) {
            console.error("Erreur création diplôme:", err);
            setError(err.message || "Une erreur est survenue");
        } finally {
            setSaving(false);
        }
    };

    const cardSx = {
        bgcolor: "var(--card-color)",
        color: "var(--font-color)",
        borderRadius: 2,
        border: "1px solid var(--card-border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        p: 3,
        mb: 2,
        transition: "box-shadow 0.2s ease",
        "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
    };

    const sectionTitleSx = {
        fontWeight: 600,
        fontSize: "0.95rem",
        mb: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
        color: "var(--warning)",
    };

    return (
        <AdminPageWrapper
            isAuthorized={isAuthorized}
            titles={[
                { name: t("diplomas", { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_DIPLOMAS(uidUser) },
                { name: t("create", { ns: NS_BUTTONS }), url: null },
            ]}
            icon={<IconCertificate width={22} height={22} />}
        >
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 1000 }}>
                {/* Bouton retour */}
                <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                    <ButtonCancel
                        onClick={() => router.push(PAGE_ADMIN_DIPLOMAS(uidUser))}
                        label={t("back", { ns: NS_BUTTONS })}
                        isAdmin={true}
                    />
                </Stack>

                {error && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: "rgba(239, 68, 68, 0.1)", borderRadius: 1, color: "#ef4444" }}>
                        {error}
                    </Box>
                )}

                {/* Informations générales */}
                <Box sx={cardSx}>
                    <Typography sx={sectionTitleSx}>
                        <Icon icon="ph:info-fill" width={20} />
                        Informations générales
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FieldComponent
                                label={t("code", { ns: NS_FORM })}
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                onClear={() => handleClear("code")}
                                placeholder="DIPL-DAND-XXX-2026"
                                required
                                isAdmin
                                disabled={saving}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <SelectComponentDark
                                required
                                name="status"
                                label={t("status", { ns: NS_FORM })}
                                value={formData.status}
                                values={ALL_STATUS.map(st => ({ id: st, value: t(st) }))}
                                onChange={handleChange}
                                hasNull={false}
                                disabled={saving}
                                isAdmin={true}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FieldComponent
                                label={t("title", { ns: NS_FORM })}
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                onClear={() => handleClear("title")}
                                placeholder="Diplôme Professionnel..."
                                required
                                isAdmin
                                disabled={saving}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FieldComponent
                                label={t("description", { ns: NS_FORM })}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                onClear={() => handleClear("description")}
                                type="multiline"
                                minRows={2}
                                maxRows={6}
                                isAdmin
                                disabled={saving}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Configuration */}
                <Box sx={cardSx}>
                    <Typography sx={sectionTitleSx}>
                        <Icon icon="ph:gear-fill" width={20} />
                        Configuration
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <SelectComponentDark
                                name="category"
                                label={t("category", { ns: NS_FORM })}
                                value={formData.category}
                                values={ALL_CATEGORIES.map(cat => ({ id: cat, value: t(cat) }))}
                                onChange={handleChange}
                                hasNull={false}
                                disabled={saving}
                                isAdmin={true}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <SelectComponentDark
                                name="level"
                                label={t("level", { ns: NS_FORM })}
                                value={formData.level}
                                values={ALL_LEVELS.map(lv => ({ id: lv, value: t(lv) }))}
                                onChange={handleChange}
                                hasNull={false}
                                disabled={saving}
                                isAdmin={true}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <SelectComponentDark
                                name="format"
                                label={t("format", { ns: NS_FORM })}
                                value={formData.format}
                                values={ALL_FORMATS.map(fmt => ({ id: fmt, value: t(fmt) }))}
                                onChange={handleChange}
                                hasNull={false}
                                disabled={saving}
                                isAdmin={true}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="enabled"
                                        checked={formData.enabled}
                                        onChange={handleChange}
                                        disabled={saving}
                                        sx={{
                                            "& .MuiSwitch-switchBase.Mui-checked": {
                                                color: "var(--warning)",
                                                "& + .MuiSwitch-track": { bgcolor: "var(--warning) !important", opacity: 0.4 },
                                            },
                                        }}
                                    />
                                }
                                label={t("enabled", { ns: NS_FORM })}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Leçons associées */}
                <Box sx={cardSx}>
                    <Typography sx={sectionTitleSx}>
                        <Icon icon="ph:books-fill" width={20} />
                        Leçons associées
                    </Typography>
                    <Autocomplete
                        multiple
                        options={lessons}
                        getOptionLabel={(option) => option.translate?.title || option.title || option.uid}
                        value={lessons.filter((l) => formData.uid_lessons.includes(l.uid))}
                        onChange={(e, newValue) => setFormData(prev => ({ ...prev, uid_lessons: newValue.map((l) => l.uid) }))}
                        disabled={saving}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Sélectionner les leçons..."
                                variant="outlined"
                                size="small"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        color: "var(--font-color)",
                                        "& fieldset": {
                                            borderColor: "var(--warning)",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "var(--warning)",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "var(--warning)",
                                        },
                                    },
                                    "& .MuiInputLabel-root": {
                                        color: "var(--warning)",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "var(--warning)",
                                    },
                                    "& .MuiInputBase-input::placeholder": {
                                        color: "var(--grey)",
                                        opacity: 0.7,
                                    },
                                }}
                            />
                        )}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    {...getTagProps({ index })}
                                    key={option.uid}
                                    label={option.translate?.title || option.title}
                                    size="small"
                                    sx={{ bgcolor: "var(--warning)", color: "#fff" }}
                                />
                            ))
                        }
                        sx={{
                            width: "100%",
                            "& .MuiAutocomplete-popupIndicator": {
                                color: "var(--warning)",
                            },
                            "& .MuiAutocomplete-clearIndicator": {
                                color: "var(--warning)",
                            },
                        }}
                    />
                </Box>

                {/* Seuils de réussite */}
                <Box sx={cardSx}>
                    <Typography sx={sectionTitleSx}>
                        <Icon icon="ph:chart-bar-fill" width={20} />
                        Seuils de réussite
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <FieldComponent
                                label="Réussite (%)"
                                name="passing_percentage"
                                type="number"
                                value={formData.passing_percentage}
                                onChange={handleChange}
                                isAdmin
                                disabled={saving}
                            />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <FieldComponent
                                label="Bien (%)"
                                name="good_percentage"
                                type="number"
                                value={formData.good_percentage}
                                onChange={handleChange}
                                isAdmin
                                disabled={saving}
                            />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <FieldComponent
                                label="Excellent (%)"
                                name="excellent_percentage"
                                type="number"
                                value={formData.excellent_percentage}
                                onChange={handleChange}
                                isAdmin
                                disabled={saving}
                            />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <FieldComponent
                                label="Max (%)"
                                name="max_percentage"
                                type="number"
                                value={formData.max_percentage}
                                onChange={handleChange}
                                isAdmin
                                disabled={saving}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Durées */}
                <Box sx={cardSx}>
                    <Typography sx={sectionTitleSx}>
                        <Icon icon="ph:clock-fill" width={20} />
                        Durées
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FieldComponent
                                label="Heures en ligne"
                                name="duration_hours_online"
                                type="number"
                                value={formData.duration_hours_online}
                                onChange={handleChange}
                                isAdmin
                                disabled={saving}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FieldComponent
                                label="Heures présentiel"
                                name="duration_hours_onsite"
                                type="number"
                                value={formData.duration_hours_onsite}
                                onChange={handleChange}
                                isAdmin
                                disabled={saving}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FieldComponent
                                label="Durée examen (min)"
                                name="exam_duration_minutes"
                                type="number"
                                value={formData.exam_duration_minutes}
                                onChange={handleChange}
                                isAdmin
                                disabled={saving}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Photos par langue */}
                <Box sx={cardSx}>
                    <Typography sx={sectionTitleSx}>
                        <Icon icon="ph:image-fill" width={20} />
                        Photos par langue
                    </Typography>
                    <Grid container spacing={2}>
                        {languages.map((l) => {
                            const langInfo = ClassLang.getOneLang(l);
                            return (
                                <Grid key={l} size={{ xs: 12, sm: 4 }}>
                                    <Box sx={{ p: 1.5, border: "1px solid var(--card-border)", borderRadius: 1 }}>
                                        <Chip
                                            label={`${langInfo?.flag_str || ""} ${t(l, { ns: NS_LANGS })}`}
                                            size="small"
                                            sx={{
                                                mb: 1,
                                                fontWeight: 600,
                                                bgcolor: "transparent",
                                                color: "var(--font-color)",
                                                border: "1px solid var(--card-border)",
                                            }}
                                        />
                                        <FieldComponent
                                            label="Photo URL"
                                            type="text"
                                            name={`photo_${l}`}
                                            value={photos[l] || ""}
                                            onChange={(e) => setPhotos(prev => ({ ...prev, [l]: e.target.value }))}
                                            fullWidth
                                            isAdmin
                                            disabled={saving}
                                        />
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>

                {/* Boutons */}
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                    <ButtonCancel
                        onClick={() => router.push(PAGE_ADMIN_DIPLOMAS(uidUser))}
                        label={t("cancel", { ns: NS_BUTTONS })}
                        isAdmin
                        disabled={saving}
                    />
                    <ButtonConfirm
                        type="submit"
                        label={saving ? "Création..." : (t("save", { ns: NS_BUTTONS }))}
                        isAdmin
                        disabled={saving || !formData.code || !formData.title}
                        icon={saving ? <Icon icon="ph:spinner" width={18} className="spin" /> : <Icon icon="ph:floppy-disk-fill" width={18} />}
                    />
                </Stack>
            </Box>
        </AdminPageWrapper>
    );
}
