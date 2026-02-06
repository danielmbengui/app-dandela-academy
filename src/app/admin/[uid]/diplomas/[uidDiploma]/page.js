"use client";

import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { IconCertificate, IconCamera, IconPicture, IconRemove } from "@/assets/icons/IconsComponent";
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
import { PAGE_ADMIN_DIPLOMAS } from "@/contexts/constants/constants_pages";
import { useDiploma } from "@/contexts/DiplomaProvider";
import { useLesson } from "@/contexts/LessonProvider";
import { useLanguage } from "@/contexts/LangProvider";
import { ClassUserAdministrator } from "@/classes/users/ClassUser";
import { ClassDiploma, ClassDiplomaTranslate } from "@/classes/ClassDiploma";
import { ClassFile } from "@/classes/ClassFile";
import AdminPageWrapper from "@/components/wrappers/AdminPageWrapper";
import FieldComponent from "@/components/elements/FieldComponent";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import AccordionComponent from "@/components/dashboard/elements/AccordionComponent";
import ButtonImportFiles from "@/components/elements/ButtonImportFiles";
import { Box, Grid, Stack, Typography, Chip, FormControlLabel, Switch, Autocomplete, TextField, CircularProgress, IconButton } from "@mui/material";
import { Icon } from "@iconify/react";
import { ClassLang } from "@/classes/ClassLang";
import Image from "next/image";

const makeId = () => (crypto?.randomUUID?.() ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

// Composant pour les tableaux (prérequis, objectifs)
function CustomArrayAccordion({ expanded = false, onChange = null, title = "", array_name = "", diploma = null, onDiplomaChange = null }) {
    const { t } = useTranslation([ClassDiploma.NS_COLLECTION, NS_BUTTONS]);
    const { lang } = useLanguage();
    const [array, setArray] = useState([]);
    const originalRef = useRef([]);
    const [newValue, setNewValue] = useState("");
    const [state, setState] = useState({ processing: false, text: "" });

    useEffect(() => {
        if (diploma) {
            const translate = diploma.translates?.find(tr => tr.lang === lang) || diploma.translates?.[0];
            const initial = Array.isArray(translate?.[array_name]) ? translate[array_name] : [];
            originalRef.current = initial;
            setArray(initial.map((val) => ({ id: makeId(), value: val ?? "" })));
        }
    }, [diploma, array_name, lang]);

    const sameValues = useMemo(() => {
        const translate = diploma?.translates?.find(tr => tr.lang === lang);
        const original = translate?.[array_name] || [];
        const current = array.map((r) => r.value);
        if (current.length !== original.length) return false;
        return current.every((c, i) => (c ?? "") === (original[i] ?? ""));
    }, [array, diploma, array_name, lang]);

    const onChangeValue = useCallback((e, index) => {
        const value = e?.target?.value ?? "";
        setArray((prev) =>
            prev.map((row, i) => (i === index ? { ...row, value } : row))
        );
        if (index < 0) setNewValue(value);
    }, []);

    const onClearValue = useCallback((index) => {
        setArray((prev) =>
            prev.map((row, i) => (i === index ? { ...row, value: "" } : row))
        );
        if (index < 0) setNewValue("");
    }, []);

    const onDeleteValue = useCallback((index) => {
        setArray(prev => prev.filter((_, i) => i !== index));
    }, []);

    const onAddValue = useCallback((value) => {
        if (!value?.trim()) return;
        setArray(prev => [...prev, { id: makeId(), value }]);
        setNewValue("");
    }, []);

    const onResetAllValues = useCallback(() => {
        const translate = diploma?.translates?.find(tr => tr.lang === lang);
        const original = translate?.[array_name] || [];
        originalRef.current = original;
        setArray(original.map((val) => ({ id: makeId(), value: val ?? "" })));
        setNewValue("");
    }, [diploma, array_name, lang]);

    const onSubmit = async () => {
        try {
            setState((p) => ({ ...p, processing: true, text: "Traitement..." }));
            setState((p) => ({ ...p, text: "Traduction des valeurs..." }));

            const transData = { [array_name]: array.map((a) => a.value) };
            const qs = encodeURIComponent(JSON.stringify(transData));
            const res = await fetch(`/api/test?lang=${lang}&translations=${qs}`);
            const data = await res.json();

            const langsResult = Object.keys(data);
            const trs = Object.values(data)?.map?.((trans, i) =>
                new ClassDiplomaTranslate({ ...trans, lang: langsResult[i] })
            );

            const actualTranslates = diploma?.translates ?? [];
            const newTranslates = actualTranslates.map((trans) => {
                const translated = trs?.find((x) => x.lang === trans.lang);
                return new ClassDiplomaTranslate({ ...trans.toJSON(), [array_name]: translated?.[array_name] || trans[array_name] });
            });

            setState((p) => ({ ...p, text: "Modification du diplôme..." }));
            diploma?.update({ translates: newTranslates });
            const patched = await diploma?.updateFirestore();
            if (onDiplomaChange && patched) onDiplomaChange(patched);
        } catch (err) {
            console.error("Erreur traduction:", err);
        } finally {
            setState((p) => ({ ...p, processing: false, text: "" }));
        }
    };

    const rowSx = {
        p: 1,
        borderRadius: 1,
        bgcolor: "transparent",
        transition: "background 0.2s",
        "&:hover": { bgcolor: "var(--warning-shadow-sm)" },
    };

    return (
        <AccordionComponent title={t(title)} expanded={expanded} onChange={onChange} isAdmin={true}>
            <Box onClick={(e) => e.stopPropagation()}>
            <Stack spacing={1} alignItems="stretch" sx={{ py: 1.5, px: 1 }}>
                {array?.map?.((item, i) => (
                    <Grid
                        key={item.id}
                        container
                        alignItems="center"
                        direction="row"
                        spacing={1.5}
                        sx={{ width: "100%", ...rowSx }}
                    >
                        <Grid size="auto">
                            <Typography variant="body2" sx={{ color: "var(--grey)", fontWeight: 600, minWidth: 24 }}>
                                {i + 1}.
                            </Typography>
                        </Grid>
                        <Grid size="grow">
                            <FieldComponent
                                disabled={state.processing}
                                type="multiline"
                                name={item.id}
                                value={item.value}
                                fullWidth
                                minRows={1}
                                maxRows={10}
                                onChange={(e) => onChangeValue(e, i)}
                                onClear={() => onClearValue(i)}
                                removable={!state.processing}
                                onRemove={() => onDeleteValue(i)}
                                isAdmin={true}
                            />
                        </Grid>
                    </Grid>
                ))}
                <Grid
                    container
                    alignItems="center"
                    direction="row"
                    spacing={1.5}
                    sx={{ width: "100%", ...rowSx }}
                >
                    <Grid size="auto">
                        <Typography variant="body2" sx={{ color: "var(--grey)", fontWeight: 600, minWidth: 24 }}>
                            {array.length + 1}.
                        </Typography>
                    </Grid>
                    <Grid size="grow">
                        <FieldComponent
                            disabled={state.processing}
                            type="multiline"
                            name="create"
                            value={newValue}
                            fullWidth
                            minRows={1}
                            maxRows={10}
                            onChange={(e) => onChangeValue(e, -1)}
                            onClear={() => onClearValue(-1)}
                            editable={newValue.length > 0}
                            onSubmit={() => onAddValue(newValue)}
                            isAdmin={true}
                        />
                    </Grid>
                </Grid>
            </Stack>
            {!sameValues && (
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    spacing={1.5}
                    sx={{ px: 1.5, py: 1, borderTop: "1px solid var(--card-border)" }}
                >
                    <ButtonCancel
                        onClick={onResetAllValues}
                        disabled={state.processing}
                        label={t("reset", { ns: NS_BUTTONS })}
                        isAdmin={true}
                    />
                    <ButtonConfirm
                        loading={state.processing}
                        onClick={onSubmit}
                        label={t("edit", { ns: NS_BUTTONS })}
                        isAdmin={true}
                    />
                </Stack>
            )}
            </Box>
        </AccordionComponent>
    );
}

// Composant pour les infos de base
function InfosComponent({ diploma, onDiplomaChange }) {
    const { t } = useTranslation([ClassDiploma.NS_COLLECTION, NS_BUTTONS, NS_FORM]);
    const { lang } = useLanguage();
    const { ALL_CATEGORIES, ALL_LEVELS, ALL_FORMATS, ALL_STATUS } = useDiploma();
    const [diplomaEdit, setDiplomaEdit] = useState(null);
    const [state, setState] = useState({ processing: false, text: "" });

    useEffect(() => {
        if (diploma) {
            setDiplomaEdit(diploma.clone());
        }
    }, [diploma]);

    const sameDiploma = useMemo(() => {
        if (!diploma || !diplomaEdit) return true;
        if (diploma.code !== diplomaEdit.code) return false;
        if (diploma.title !== diplomaEdit.title) return false;
        if (diploma.description !== diplomaEdit.description) return false;
        if (diploma.category !== diplomaEdit.category) return false;
        if (diploma.level !== diplomaEdit.level) return false;
        if (diploma.format !== diplomaEdit.format) return false;
        if (diploma.status !== diplomaEdit.status) return false;
        return true;
    }, [diploma, diplomaEdit]);

    const mustTranslate = useMemo(() => {
        if (!diploma || !diplomaEdit) return false;
        if (diploma.title !== diplomaEdit.title) return true;
        if (diploma.description !== diplomaEdit.description) return true;
        return false;
    }, [diploma, diplomaEdit]);

    const onChangeValue = (e) => {
        const { name, value } = e.target;
        setDiplomaEdit(prev => {
            if (!prev) return diploma?.clone();
            prev.update({ [name]: value });
            // Mettre à jour aussi la traduction active pour title et description
            if ((name === 'title' || name === 'description') && prev._translate) {
                prev._translate[name] = value;
            }
            return prev.clone();
        });
    };

    const onClearValue = (name) => {
        setDiplomaEdit(prev => {
            if (!prev) return diploma?.clone();
            prev.update({ [name]: "" });
            // Mettre à jour aussi la traduction active pour title et description
            if ((name === 'title' || name === 'description') && prev._translate) {
                prev._translate[name] = "";
            }
            return prev.clone();
        });
    };

    const onResetValue = (name) => {
        setDiplomaEdit(prev => {
            if (!prev) return diploma?.clone();
            prev.update({ [name]: diploma[name] });
            // Mettre à jour aussi la traduction active pour title et description
            if ((name === 'title' || name === 'description') && prev._translate) {
                prev._translate[name] = diploma[name];
            }
            return prev.clone();
        });
    };

    const onSubmit = async () => {
        try {
            setState(prev => ({ ...prev, processing: true, text: "Traitement..." }));

            if (mustTranslate) {
                setState(prev => ({ ...prev, text: "Traduction des valeurs..." }));
                const transData = {
                    title: diplomaEdit?.title,
                    description: diplomaEdit?.description,
                };
                const qs = encodeURIComponent(JSON.stringify(transData));
                const res = await fetch(`/api/test?lang=${lang}&translations=${qs}`);
                const data = await res.json();

                const langsResult = Object.keys(data);
                const translates = Object.values(data)?.map?.((trans, i) =>
                    new ClassDiplomaTranslate({ ...trans, lang: langsResult[i] })
                );

                const actualTranslates = diplomaEdit?.translates || [];
                const newTranslates = actualTranslates.map(trans => {
                    const tr = translates.find(x => x.lang === trans.lang);
                    return new ClassDiplomaTranslate({
                        ...trans.toJSON(),
                        title: tr?.title || trans.title,
                        description: tr?.description || trans.description
                    });
                });
                diplomaEdit?.update({ translates: newTranslates });
            }

            setState(prev => ({ ...prev, text: "Modification du diplôme..." }));
            const patched = await diplomaEdit?.updateFirestore();
            if (onDiplomaChange && patched) onDiplomaChange(patched);
        } catch (err) {
            console.error("Erreur:", err);
        } finally {
            setState(prev => ({ ...prev, processing: false, text: "" }));
        }
    };

    const cardSx = {
        bgcolor: "var(--card-color)",
        color: "var(--font-color)",
        borderRadius: 2,
        border: "1px solid var(--card-border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        p: 3,
        transition: "box-shadow 0.2s ease",
        "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
    };

    return (
        <Box sx={cardSx}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FieldComponent
                        label={t("code", { ns: NS_FORM })}
                        required
                        type="text"
                        name="code"
                        value={diplomaEdit?.code || ""}
                        onChange={onChangeValue}
                        onClear={() => onClearValue("code")}
                        resetable={diploma?.code !== diplomaEdit?.code}
                        onCancel={() => onResetValue("code")}
                        fullWidth
                        disabled={state.processing}
                        isAdmin={true}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectComponentDark
                        required
                        name="status"
                        label={t("status", { ns: NS_FORM })}
                        value={diplomaEdit?.status || ""}
                        values={ALL_STATUS.map(st => ({ id: st, value: t(st) }))}
                        onChange={onChangeValue}
                        hasNull={false}
                        disabled={state.processing}
                        isAdmin={true}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <FieldComponent
                        label={t("title", { ns: NS_FORM })}
                        required
                        type="text"
                        name="title"
                        value={diplomaEdit?.title || ""}
                        onChange={onChangeValue}
                        onClear={() => onClearValue("title")}
                        resetable={diploma?.title !== diplomaEdit?.title}
                        onCancel={() => onResetValue("title")}
                        fullWidth
                        disabled={state.processing}
                        isAdmin={true}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <FieldComponent
                        label={t("description", { ns: NS_FORM })}
                        type="multiline"
                        fullWidth
                        name="description"
                        value={diplomaEdit?.description || ""}
                        onChange={onChangeValue}
                        onClear={() => onClearValue("description")}
                        minRows={2}
                        maxRows={10}
                        resetable={diploma?.description !== diplomaEdit?.description}
                        onCancel={() => onResetValue("description")}
                        disabled={state.processing}
                        isAdmin={true}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <SelectComponentDark
                        name="category"
                        label={t("category", { ns: NS_FORM })}
                        value={diplomaEdit?.category || ""}
                        values={ALL_CATEGORIES.map(cat => ({ id: cat, value: t(cat) }))}
                        onChange={onChangeValue}
                        hasNull={false}
                        disabled={state.processing}
                        isAdmin={true}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <SelectComponentDark
                        name="level"
                        label={t("level", { ns: NS_FORM })}
                        value={diplomaEdit?.level || ""}
                        values={ALL_LEVELS.map(lv => ({ id: lv, value: t(lv) }))}
                        onChange={onChangeValue}
                        hasNull={false}
                        disabled={state.processing}
                        isAdmin={true}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <SelectComponentDark
                        name="format"
                        label={t("format", { ns: NS_FORM })}
                        value={diplomaEdit?.format || ""}
                        values={ALL_FORMATS.map(fmt => ({ id: fmt, value: t(fmt) }))}
                        onChange={onChangeValue}
                        hasNull={false}
                        disabled={state.processing}
                        isAdmin={true}
                    />
                </Grid>
                <Grid size={12}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        flexWrap="wrap"
                        gap={1.5}
                        sx={{ pt: 1, mt: 0.5, borderTop: "1px solid var(--card-border)" }}
                    >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <ButtonCancel
                                onClick={() => setDiplomaEdit(diploma?.clone())}
                                loading={state.processing}
                                disabled={sameDiploma}
                                label={t("reset", { ns: NS_BUTTONS })}
                                size="medium"
                                isAdmin={true}
                            />
                            <ButtonConfirm
                                onClick={onSubmit}
                                loading={state.processing}
                                disabled={sameDiploma}
                                label={t("edit", { ns: NS_BUTTONS })}
                                size="medium"
                                isAdmin={true}
                            />
                        </Stack>
                        {state.processing && state.text && (
                            <Typography variant="body2" sx={{ color: "var(--grey)", fontWeight: 500 }}>
                                {state.text}
                            </Typography>
                        )}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}

// Composant pour les seuils et durées
function ConfigComponent({ diploma, onDiplomaChange }) {
    const { t } = useTranslation([ClassDiploma.NS_COLLECTION, NS_BUTTONS, NS_FORM]);
    const [diplomaEdit, setDiplomaEdit] = useState(null);
    const [state, setState] = useState({ processing: false });

    useEffect(() => {
        if (diploma) {
            setDiplomaEdit(diploma.clone());
        }
    }, [diploma]);

    const sameConfig = useMemo(() => {
        if (!diploma || !diplomaEdit) return true;
        if (diploma.passing_percentage !== diplomaEdit.passing_percentage) return false;
        if (diploma.good_percentage !== diplomaEdit.good_percentage) return false;
        if (diploma.excellent_percentage !== diplomaEdit.excellent_percentage) return false;
        if (diploma.max_percentage !== diplomaEdit.max_percentage) return false;
        if (diploma.duration_hours_online !== diplomaEdit.duration_hours_online) return false;
        if (diploma.duration_hours_onsite !== diplomaEdit.duration_hours_onsite) return false;
        if (diploma.exam_duration_minutes !== diplomaEdit.exam_duration_minutes) return false;
        if (diploma.enabled !== diplomaEdit.enabled) return false;
        return true;
    }, [diploma, diplomaEdit]);

    const onChangeValue = (e) => {
        const { name, value, type, checked } = e.target;
        setDiplomaEdit(prev => {
            if (!prev) return diploma?.clone();
            const newValue = type === "checkbox" ? checked : (type === "number" ? parseInt(value) || 0 : value);
            prev.update({ [name]: newValue });
            return prev.clone();
        });
    };

    const onSubmit = async () => {
        try {
            setState({ processing: true });
            const patched = await diplomaEdit?.updateFirestore();
            if (onDiplomaChange && patched) onDiplomaChange(patched);
        } catch (err) {
            console.error("Erreur:", err);
        } finally {
            setState({ processing: false });
        }
    };

    const cardSx = {
        bgcolor: "var(--card-color)",
        color: "var(--font-color)",
        borderRadius: 2,
        border: "1px solid var(--card-border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        p: 3,
    };

    return (
        <Box sx={cardSx}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "var(--warning)" }}>
                        <Icon icon="ph:chart-bar-fill" width={18} style={{ marginRight: 8, verticalAlign: "middle" }} />
                        Seuils de réussite
                    </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <FieldComponent
                        label="Réussite (%)"
                        name="passing_percentage"
                        type="number"
                        value={diplomaEdit?.passing_percentage || 0}
                        onChange={onChangeValue}
                        isAdmin
                        disabled={state.processing}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <FieldComponent
                        label="Bien (%)"
                        name="good_percentage"
                        type="number"
                        value={diplomaEdit?.good_percentage || 0}
                        onChange={onChangeValue}
                        isAdmin
                        disabled={state.processing}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <FieldComponent
                        label="Excellent (%)"
                        name="excellent_percentage"
                        type="number"
                        value={diplomaEdit?.excellent_percentage || 0}
                        onChange={onChangeValue}
                        isAdmin
                        disabled={state.processing}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <FieldComponent
                        label="Max (%)"
                        name="max_percentage"
                        type="number"
                        value={diplomaEdit?.max_percentage || 0}
                        onChange={onChangeValue}
                        isAdmin
                        disabled={state.processing}
                    />
                </Grid>

                <Grid size={12} sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "var(--warning)" }}>
                        <Icon icon="ph:clock-fill" width={18} style={{ marginRight: 8, verticalAlign: "middle" }} />
                        Durées
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <FieldComponent
                        label="Heures en ligne"
                        name="duration_hours_online"
                        type="number"
                        value={diplomaEdit?.duration_hours_online || 0}
                        onChange={onChangeValue}
                        isAdmin
                        disabled={state.processing}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <FieldComponent
                        label="Heures présentiel"
                        name="duration_hours_onsite"
                        type="number"
                        value={diplomaEdit?.duration_hours_onsite || 0}
                        onChange={onChangeValue}
                        isAdmin
                        disabled={state.processing}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <FieldComponent
                        label="Durée examen (min)"
                        name="exam_duration_minutes"
                        type="number"
                        value={diplomaEdit?.exam_duration_minutes || 0}
                        onChange={onChangeValue}
                        isAdmin
                        disabled={state.processing}
                    />
                </Grid>

                <Grid size={12} sx={{ mt: 2 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <FormControlLabel
                            control={
                                <Switch
                                    name="enabled"
                                    checked={diplomaEdit?.enabled || false}
                                    onChange={onChangeValue}
                                    disabled={state.processing}
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
                        <Stack direction="row" spacing={1.5}>
                            <ButtonCancel
                                onClick={() => setDiplomaEdit(diploma?.clone())}
                                disabled={sameConfig || state.processing}
                                label={t("reset", { ns: NS_BUTTONS })}
                                isAdmin={true}
                            />
                            <ButtonConfirm
                                onClick={onSubmit}
                                loading={state.processing}
                                disabled={sameConfig}
                                label={t("edit", { ns: NS_BUTTONS })}
                                isAdmin={true}
                            />
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}

// Composant pour les leçons associées
function LessonsComponent({ diploma, onDiplomaChange }) {
    const { t } = useTranslation([ClassDiploma.NS_COLLECTION, NS_BUTTONS]);
    const { lessons } = useLesson();
    const [diplomaEdit, setDiplomaEdit] = useState(null);
    const [state, setState] = useState({ processing: false });

    useEffect(() => {
        if (diploma) {
            setDiplomaEdit(diploma.clone());
        }
    }, [diploma]);

    const sameLessons = useMemo(() => {
        if (!diploma || !diplomaEdit) return true;
        const orig = diploma.uid_lessons || [];
        const edit = diplomaEdit.uid_lessons || [];
        if (orig.length !== edit.length) return false;
        return orig.every((uid, i) => uid === edit[i]);
    }, [diploma, diplomaEdit]);

    const onSubmit = async () => {
        try {
            setState({ processing: true });
            const patched = await diplomaEdit?.updateFirestore();
            if (onDiplomaChange && patched) onDiplomaChange(patched);
        } catch (err) {
            console.error("Erreur:", err);
        } finally {
            setState({ processing: false });
        }
    };

    const cardSx = {
        bgcolor: "var(--card-color)",
        color: "var(--font-color)",
        borderRadius: 2,
        border: "1px solid var(--card-border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        p: 3,
    };

    return (
        <Box sx={cardSx}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: "var(--warning)" }}>
                <Icon icon="ph:books-fill" width={18} style={{ marginRight: 8, verticalAlign: "middle" }} />
                Leçons associées ({diplomaEdit?.uid_lessons?.length || 0})
            </Typography>
            <Autocomplete
                multiple
                options={lessons}
                getOptionLabel={(option) => option.translate?.title || option.title || option.uid}
                value={lessons.filter((l) => diplomaEdit?.uid_lessons?.includes(l.uid))}
                onChange={(e, newValue) => {
                    setDiplomaEdit(prev => {
                        if (!prev) return diploma?.clone();
                        prev.update({ uid_lessons: newValue.map((l) => l.uid) });
                        return prev.clone();
                    });
                }}
                disabled={state.processing}
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
                    mb: 2,
                    "& .MuiAutocomplete-popupIndicator": {
                        color: "var(--warning)",
                    },
                    "& .MuiAutocomplete-clearIndicator": {
                        color: "var(--warning)",
                    },
                }}
            />
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                <ButtonCancel
                    onClick={() => setDiplomaEdit(diploma?.clone())}
                    disabled={sameLessons || state.processing}
                    label={t("reset", { ns: NS_BUTTONS })}
                    isAdmin={true}
                />
                <ButtonConfirm
                    onClick={onSubmit}
                    loading={state.processing}
                    disabled={sameLessons}
                    label={t("edit", { ns: NS_BUTTONS })}
                    isAdmin={true}
                />
            </Stack>
        </Box>
    );
}

// Composant Image
function ImageComponent({ src = null, uid = '' }) {
    return (
        <Box
            sx={{
                width: '100%',
                borderRadius: 1,
                overflow: 'hidden',
                bgcolor: 'var(--grey-hyper-light)',
            }}
        >
            <Image
                src={src}
                alt={`image-diploma-${uid}`}
                quality={100}
                width={300}
                height={150}
                priority
                style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 180,
                    objectFit: 'contain',
                }}
            />
        </Box>
    );
}

// Composant pour télécharger une photo
function DownloadPhotoComponent({ file = null, setFile = null }) {
    const { t } = useTranslation([NS_BUTTONS]);
    const imageRef = useRef(null);

    useEffect(() => {
        if (!file && imageRef.current) {
            imageRef.current.value = "";
        }
    }, [file]);

    const handleClickFile = () => {
        imageRef.current.click();
    };

    const handleChangeFile = (e) => {
        const _selectedFiles = [...(e.target.files || [])];
        const _file = _selectedFiles.length > 0 ? _selectedFiles[0] : null;
        if (_file && setFile) {
            setFile([_file]);
        }
    };

    const dropzoneSx = {
        width: '100%',
        border: '2px dashed var(--card-border)',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s',
        '&:hover': {
            borderColor: 'var(--warning)',
            bgcolor: 'var(--warning-shadow-sm)',
        },
    };

    return (
        <>
            <input
                ref={imageRef}
                type="file"
                required
                multiple={false}
                accept={ClassFile.SUPPORTED_IMAGES_TYPES.map(type => type.value).join(',')}
                onChange={handleChangeFile}
                style={{ display: 'none' }}
            />
            <Stack spacing={1.5} alignItems="center">
                <Box sx={dropzoneSx} onClick={handleClickFile}>
                    <Stack spacing={1.5} alignItems="center">
                        {!file && (
                            <>
                                <Box sx={{ color: 'var(--warning)', p: 1 }}>
                                    <IconCamera width={32} height={32} />
                                </Box>
                                <ButtonCancel
                                    label={t('choose-photo')}
                                    icon={<Icon icon="material-symbols:upload" width="20" height="20" />}
                                    isAdmin={true}
                                    sx={{
                                        border: '1px solid var(--card-border)',
                                        color: 'var(--font-color)',
                                    }}
                                />
                            </>
                        )}
                    </Stack>
                </Box>
            </Stack>
        </>
    );
}

// Composant pour une photo par langue
function OnePhotoComponent({ files = [], setFiles = null, diplomaEdit = null, setDiplomaEdit = null, translation = {}, originalDiploma = null }) {
    const { t } = useTranslation([ClassDiploma.NS_COLLECTION, NS_BUTTONS, NS_LANGS]);
    const [state, setState] = useState({ processing: false });

    const fileItem = useMemo(() => {
        return files.find(f => f?.lang === translation?.lang) || null;
    }, [files, translation?.lang]);

    const { photoUrl, uid, langId, langFlag } = useMemo(() => {
        const l = ClassLang.getOneLang(translation?.lang);
        const currentFile = files.find(f => f?.lang === translation?.lang)?.file;
        return {
            photoUrl: currentFile ? null : (translation?.photo_url || null),
            uid: `photo-${translation?.lang}`,
            langId: l?.id,
            langFlag: l?.flag_str ?? "",
        };
    }, [translation, files]);

    const initialPhoto = useMemo(() => {
        if (!originalDiploma) return "";
        const photo = originalDiploma.translates?.find(tx => tx?.lang === langId)?.photo_url || "";
        return photo;
    }, [originalDiploma, langId]);

    const handleRemoveFile = () => {
        setFiles(prev => prev.map(f =>
            f?.lang === translation?.lang ? { ...f, file: null } : f
        ));
    };

    const handleSetFile = (newFiles) => {
        const file = newFiles && newFiles.length > 0 ? newFiles[0] : null;
        if (file) {
            setFiles(prev => {
                const updated = prev.map(f =>
                    f?.lang === translation?.lang ? { ...f, file } : f
                );
                const exists = updated.some(f => f?.lang === translation?.lang);
                if (!exists) {
                    updated.push({ lang: translation?.lang, file });
                }
                return updated;
            });
        }
    };

    const cardSx = {
        bgcolor: 'var(--card-color)',
        border: '1px solid var(--card-border)',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        p: 2,
        transition: 'box-shadow 0.2s ease',
        '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
    };

    return (
        <Box sx={cardSx}>
            <Stack spacing={1.5} alignItems="stretch">
                <Chip
                    label={`${langFlag} ${t(langId, { ns: NS_LANGS })}`}
                    size="small"
                    sx={{
                        alignSelf: 'flex-start',
                        fontWeight: 600,
                        bgcolor: 'transparent',
                        color: 'var(--font-color)',
                        border: '0.1px solid var(--card-border)',
                        '& .MuiChip-label': { px: 1.5 },
                    }}
                />

                {!fileItem?.file && !photoUrl && (
                    <Stack spacing={1.5}>
                        <DownloadPhotoComponent file={fileItem?.file} setFile={handleSetFile} />
                        {initialPhoto && (translation?.photo_url === '' || translation?.photo_url !== initialPhoto) && (
                            <ButtonCancel
                                disabled={state.processing}
                                icon={<IconPicture width={12} height={12} />}
                                label={t('reset-photo', { ns: NS_BUTTONS })}
                                size="small"
                                isAdmin={true}
                                onClick={() => {
                                    setDiplomaEdit(prev => {
                                        if (!prev) return originalDiploma?.clone();
                                        const tr = [...prev.translates];
                                        const i = tr.findIndex(tx => tx?.lang === translation?.lang);
                                        if (i >= 0 && tr[i]) {
                                            tr[i] = new ClassDiplomaTranslate({ ...tr[i].toJSON(), photo_url: initialPhoto });
                                        }
                                        prev.update({ translates: tr });
                                        return prev.clone();
                                    });
                                }}
                            />
                        )}
                    </Stack>
                )}

                {!fileItem?.file && photoUrl && (
                    <Stack spacing={1.5}>
                        <Box sx={{ borderRadius: 1, overflow: 'hidden', border: '1px solid var(--card-border)' }}>
                            <ImageComponent src={photoUrl} uid={uid} />
                        </Box>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {initialPhoto && (translation?.photo_url !== initialPhoto || translation?.photo_url === '') && (
                                <ButtonCancel
                                    disabled={state.processing}
                                    icon={<IconPicture width={12} height={12} />}
                                    label={t('reset-photo', { ns: NS_BUTTONS })}
                                    size="small"
                                    isAdmin={true}
                                    onClick={() => {
                                        setDiplomaEdit(prev => {
                                            if (!prev) return originalDiploma?.clone();
                                            const tr = [...prev.translates];
                                            const i = tr.findIndex(tx => tx?.lang === translation?.lang);
                                            if (i >= 0 && tr[i]) {
                                                tr[i] = new ClassDiplomaTranslate({ ...tr[i].toJSON(), photo_url: initialPhoto });
                                            }
                                            prev.update({ translates: tr });
                                            return prev.clone();
                                        });
                                    }}
                                />
                            )}
                            <ButtonConfirm
                                isAdmin={true}
                                icon={<IconRemove width={12} height={12} />}
                                disabled={state.processing}
                                label={t('remove-photo', { ns: NS_BUTTONS })}
                                size="small"
                                sx={{ bgcolor: 'var(--error)', '&:hover': { bgcolor: 'var(--error-dark)' } }}
                                onClick={() => {
                                    setDiplomaEdit(prev => {
                                        if (!prev) return originalDiploma?.clone();
                                        const tr = [...prev.translates];
                                        const i = tr.findIndex(tx => tx?.lang === langId);
                                        if (i >= 0 && tr[i]) {
                                            tr[i] = new ClassDiplomaTranslate({ ...tr[i].toJSON(), photo_url: '' });
                                        }
                                        prev.update({ translates: tr });
                                        return prev.clone();
                                    });
                                }}
                            />
                        </Stack>
                        <ButtonImportFiles
                            disabled={state.processing}
                            files={[]}
                            setFiles={handleSetFile}
                            supported_files={ClassFile.SUPPORTED_IMAGES_TYPES.map(type => type.value)}
                        />
                    </Stack>
                )}

                {fileItem?.file && (
                    <Stack spacing={1.5}>
                        <Box sx={{ borderRadius: 1, overflow: 'hidden', border: '1px solid var(--card-border)' }}>
                            <ImageComponent src={URL.createObjectURL(fileItem.file)} uid={diplomaEdit?.uid || uid} />
                        </Box>
                        <Stack onClick={handleRemoveFile} direction={"row"} spacing={1} justifyContent={'center'} alignItems="center" sx={{ color: 'var(--error)', cursor: 'pointer' }}>
                            <IconButton sx={{ background: 'rgba(0,0,0,0.75)', cursor: 'pointer' }}>
                                <Icon color="red" icon="mdi:delete-outline" width="12" height="12" />
                            </IconButton>
                            <Typography>{`${ClassFile.formatFileName(fileItem.file.name)}`}</Typography>
                        </Stack>
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}

// Helper pour le storage path des diplômes
const getDiplomaStoragePath = (uidDiploma = "", lang = "fr", extension = "") => {
    return `${ClassDiploma.COLLECTION}/${uidDiploma}/photo_url-${lang}.${extension}`;
};

// Composant pour les photos (3 langues)
function PhotosComponent({ diploma, onDiplomaChange }) {
    const { t } = useTranslation([ClassDiploma.NS_COLLECTION, NS_BUTTONS, NS_LANGS]);
    const { lang } = useLanguage();
    const [diplomaEdit, setDiplomaEdit] = useState(null);
    const [files, setFiles] = useState([]);
    const [translates, setTranslates] = useState([]);
    const [samePhotos, setSamePhotos] = useState(true);
    const [state, setState] = useState({ processing: false, text: "" });

    useEffect(() => {
        if (diploma) {
            setDiplomaEdit(diploma.clone());
            const _translates = [...(diploma.translates || [])];
            setTranslates(_translates);
            setFiles(_translates.map(trans => ({ lang: trans.lang, file: null })));
        }
    }, [diploma]);

    useEffect(() => {
        if (diplomaEdit) {
            setTranslates([...(diplomaEdit.translates || [])]);
        }
    }, [diplomaEdit]);

    // Calculer samePhotos
    useEffect(() => {
        if (!diploma || !diplomaEdit) {
            setSamePhotos(true);
            return;
        }
        const hasFiles = files.some(item => item?.file);
        if (hasFiles) {
            setSamePhotos(false);
            return;
        }
        const allLangs = new Set([
            ...(diploma.translates || []).map(t => t.lang),
            ...(diplomaEdit.translates || []).map(t => t.lang)
        ]);
        const photosChanged = Array.from(allLangs).some(langKey => {
            const origTrans = (diploma.translates || []).find(t => t.lang === langKey);
            const editTrans = (diplomaEdit.translates || []).find(t => t.lang === langKey);
            if (!origTrans && editTrans) return true;
            if (origTrans && !editTrans) return true;
            if (origTrans && editTrans) {
                const origUrl = (origTrans.photo_url || '').trim();
                const editUrl = (editTrans.photo_url || '').trim();
                if (origUrl !== editUrl) return true;
            }
            return false;
        });
        setSamePhotos(!photosChanged);
    }, [diploma, diplomaEdit, files]);

    const translations = useMemo(() => {
        if (!translates || translates.length === 0) return [];
        return [...translates].sort((a, b) => {
            if (a.lang === lang) return -1;
            if (b.lang === lang) return 1;
            return t(a.lang, { ns: NS_LANGS }).localeCompare(t(b.lang, { ns: NS_LANGS }));
        });
    }, [translates, lang, t]);

    const onResetAllPhotos = useCallback(() => {
        if (!diploma) return;
        setDiplomaEdit(diploma.clone());
        setFiles([...(diploma.translates || [])].map(trans => ({ lang: trans.lang, file: null })));
        setSamePhotos(true);
    }, [diploma]);

    const onEdit = async () => {
        try {
            setState(prev => ({ ...prev, processing: true, text: "Traitement..." }));

            // Uploader les fichiers sélectionnés
            const uploadedFiles = await Promise.all(
                files
                    .filter(({ file }) => file)
                    .map(async ({ lang: fileLang, file }) => {
                        const filename = file.name;
                        const extension = filename.split('.').pop().toLowerCase();
                        const _path = getDiplomaStoragePath(diplomaEdit?.uid, fileLang, extension);
                        const resultFile = await ClassFile.uploadFileToFirebase({
                            file: file,
                            path: _path,
                        });
                        const newFile = new ClassFile({
                            id: "",
                            uri: resultFile?.uri || "",
                            path: resultFile?.path,
                            name: resultFile?.name,
                            type: resultFile?.type,
                            size: resultFile?.size,
                            tag: `diploma`,
                        }).toJSON();
                        return {
                            lang: fileLang,
                            url: newFile?.uri || "",
                        };
                    })
            );

            const actualTranslates = diplomaEdit?.translates || [];
            const newTranslates = actualTranslates.map(trans => {
                const l = trans.lang;
                const uploaded = uploadedFiles.find(x => x.lang === l);
                const photoUrl = uploaded ? uploaded.url : (trans.photo_url || '');
                return new ClassDiplomaTranslate({ ...trans.toJSON(), photo_url: photoUrl });
            });

            const translate = newTranslates.find(trans => trans.lang === lang);
            diplomaEdit?.update({ translates: newTranslates, translate });

            setState(prev => ({ ...prev, text: 'Modification du diplôme...' }));
            const patched = await diplomaEdit?.updateFirestore();

            if (patched && onDiplomaChange) {
                onDiplomaChange(patched);
                setDiplomaEdit(patched.clone());
                setTranslates([...(patched.translates || [])]);
                setFiles([...(patched.translates || [])].map(trans => ({ lang: trans.lang, file: null })));
            }
        } catch (error) {
            console.error("Erreur onEdit photos:", error);
        } finally {
            setState(prev => ({ ...prev, processing: false, text: "" }));
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ rowGap: 3 }}>
                    {translations.map((translation, i) => (
                        <Grid key={translation?.lang ?? i} size={{ xs: 12, sm: 6, md: 4 }}>
                            <OnePhotoComponent
                                files={files}
                                setFiles={setFiles}
                                translation={translation}
                                setDiplomaEdit={setDiplomaEdit}
                                diplomaEdit={diplomaEdit}
                                originalDiploma={diploma}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Grid size={12}>
                <Stack direction="row" spacing={1.5} sx={{ pt: 2 }}>
                    <ButtonCancel
                        onClick={onResetAllPhotos}
                        disabled={state.processing || samePhotos}
                        size="medium"
                        label={t('reset', { ns: NS_BUTTONS })}
                        isAdmin={true}
                    />
                    <ButtonConfirm
                        loading={state.processing}
                        disabled={state.processing || samePhotos}
                        size="medium"
                        label={t('edit', { ns: NS_BUTTONS })}
                        onClick={onEdit}
                        isAdmin={true}
                    />
                </Stack>
            </Grid>
        </Grid>
    );
}

export default function AdminEditDiplomaPage() {
    const router = useRouter();
    const params = useParams();
    const { uid: uidUser, uidDiploma } = params;
    const { t } = useTranslation([ClassDiploma.NS_COLLECTION, NS_DIPLOMAS, NS_BUTTONS, NS_DASHBOARD_MENU]);
    const { user } = useAuth();
    const { diploma, setUidDiploma, removeDiploma, isLoading } = useDiploma();
    const [localDiploma, setLocalDiploma] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [openedView, setOpenedView] = useState("infos");
    const [modeAccordion, setModeAccordion] = useState("");

    const isAuthorized = useMemo(() => user instanceof ClassUserAdministrator, [user]);

    useEffect(() => {
        if (uidDiploma) {
            setUidDiploma(uidDiploma);
        }
    }, [uidDiploma, setUidDiploma]);

    useEffect(() => {
        if (diploma) {
            setLocalDiploma(diploma.clone());
        }
    }, [diploma]);

    const handleDelete = async () => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer ce diplôme ?`)) return;
        setDeleting(true);
        try {
            const success = await removeDiploma(uidDiploma);
            if (success) {
                router.push(PAGE_ADMIN_DIPLOMAS(uidUser));
            }
        } catch (err) {
            console.error("Erreur suppression:", err);
        } finally {
            setDeleting(false);
        }
    };

    if (isLoading || !localDiploma) {
        return (
            <AdminPageWrapper
                isAuthorized={isAuthorized}
                titles={[
                    { name: t("diplomas", { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_DIPLOMAS(uidUser) },
                    { name: "Chargement...", url: null },
                ]}
                icon={<IconCertificate width={22} height={22} />}
            >
                <Box sx={{ py: 4, textAlign: "center" }}>
                    <CircularProgress size={32} color="warning" />
                </Box>
            </AdminPageWrapper>
        );
    }

    return (
        <AdminPageWrapper
            isAuthorized={isAuthorized}
            titles={[
                { name: t("diplomas", { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_DIPLOMAS(uidUser) },
                { name: localDiploma.translate?.title || localDiploma.title || localDiploma.code, url: null },
            ]}
            icon={<IconCertificate width={22} height={22} />}
        >
            <Stack spacing={2} sx={{ width: "100%", maxWidth: 1000 }}>
                {/* Boutons de navigation */}
                <Stack direction="row" spacing={1.5} justifyContent="space-between">
                    <ButtonCancel
                        onClick={() => router.push(PAGE_ADMIN_DIPLOMAS(uidUser))}
                        label={t("back", { ns: NS_BUTTONS })}
                        isAdmin={true}
                    />
                    <ButtonConfirm
                        onClick={handleDelete}
                        loading={deleting}
                        label={t("delete", { ns: NS_BUTTONS })}
                        isAdmin={true}
                        icon={<Icon icon="ph:trash-fill" width={18} />}
                        sx={{ bgcolor: "var(--error)", "&:hover": { bgcolor: "var(--error-dark)" } }}
                    />
                </Stack>

                {/* Accordéon Informations */}
                <AccordionComponent
                    title={t("infos") || "Informations"}
                    expanded={openedView === "infos"}
                    onChange={() => setOpenedView(openedView === "infos" ? "" : "infos")}
                    isAdmin={true}
                >
                    <Box onClick={(e) => e.stopPropagation()}>
                        <InfosComponent diploma={localDiploma} onDiplomaChange={setLocalDiploma} />
                    </Box>
                </AccordionComponent>

                {/* Accordéon Configuration */}
                <AccordionComponent
                    title="Configuration"
                    expanded={openedView === "config"}
                    onChange={() => setOpenedView(openedView === "config" ? "" : "config")}
                    isAdmin={true}
                >
                    <Box onClick={(e) => e.stopPropagation()}>
                        <ConfigComponent diploma={localDiploma} onDiplomaChange={setLocalDiploma} />
                    </Box>
                </AccordionComponent>

                {/* Accordéon Leçons */}
                <AccordionComponent
                    title={t("lessons", { ns: NS_DASHBOARD_MENU }) || "Leçons"}
                    expanded={openedView === "lessons"}
                    onChange={() => setOpenedView(openedView === "lessons" ? "" : "lessons")}
                    isAdmin={true}
                >
                    <Box onClick={(e) => e.stopPropagation()}>
                        <LessonsComponent diploma={localDiploma} onDiplomaChange={setLocalDiploma} />
                    </Box>
                </AccordionComponent>

                {/* Accordéon Photos */}
                <AccordionComponent
                    title="Photos"
                    expanded={openedView === "photos"}
                    onChange={() => setOpenedView(openedView === "photos" ? "" : "photos")}
                    isAdmin={true}
                >
                    <Box onClick={(e) => e.stopPropagation()}>
                        <PhotosComponent diploma={localDiploma} onDiplomaChange={setLocalDiploma} />
                    </Box>
                </AccordionComponent>

                {/* Section Contenu traduisible */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "var(--font-color)", mt: 2 }}>
                    Contenu traduisible
                </Typography>
                <Stack spacing={0.5}>
                    <CustomArrayAccordion
                        expanded={modeAccordion === "prerequisites"}
                        onChange={() => setModeAccordion(modeAccordion === "prerequisites" ? "" : "prerequisites")}
                        title="prerequisites"
                        array_name="prerequisites"
                        diploma={localDiploma}
                        onDiplomaChange={setLocalDiploma}
                    />
                    <CustomArrayAccordion
                        expanded={modeAccordion === "goals"}
                        onChange={() => setModeAccordion(modeAccordion === "goals" ? "" : "goals")}
                        title="goals"
                        array_name="goals"
                        diploma={localDiploma}
                        onDiplomaChange={setLocalDiploma}
                    />
                </Stack>
            </Stack>
        </AdminPageWrapper>
    );
}
