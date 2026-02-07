"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { IconArrowDown, IconArrowUp, IconCamera, IconCheck, IconLessons, IconRemove } from "@/assets/icons/IconsComponent";
import {
    NS_BUTTONS,
    NS_DASHBOARD_MENU,
    NS_LESSONS,
    NS_FORM,
    NS_LANGS,
    languages,
} from "@/contexts/i18n/settings";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter, useParams } from "next/navigation";
import { PAGE_ADMIN_LESSONS, PAGE_ADMIN_ONE_LESSON } from "@/contexts/constants/constants_pages";
import { useLesson } from "@/contexts/LessonProvider";
import { useLanguage } from "@/contexts/LangProvider";
import { ClassUserAdministrator } from "@/classes/users/ClassUser";
import { ClassLesson, ClassLessonTranslate } from "@/classes/ClassLesson";
import { ClassFile } from "@/classes/ClassFile";
import AdminPageWrapper from "@/components/wrappers/AdminPageWrapper";
import FieldComponent from "@/components/elements/FieldComponent";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import AccordionComponent from "@/components/dashboard/elements/AccordionComponent";
import { Box, Grid, Stack, Typography, Chip, Switch, IconButton } from "@mui/material";
import { Icon } from "@iconify/react";
import { ClassLang } from "@/classes/ClassLang";
import Image from "next/image";

const makeId = () => (crypto?.randomUUID?.() ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

// Helper function for ClassLesson storage path
const getStoragePath = (uidLesson = "", lang = "fr", extension = "") => {
    return `${ClassLesson.COLLECTION}/${uidLesson}/photo_url-${lang}.${extension}`;
};

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
                alt={`image-lesson-${uid}`}
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

function DownloadPhotoComponent({ file = null, setFile = null }) {
    const { t } = useTranslation([NS_BUTTONS]);
    const imageRef = useRef(null);

    const handleClickFile = () => {
        imageRef.current?.click();
    };

    const handleChangeFile = (e) => {
        const _selectedFiles = [...(e.target.files || [])];
        const _file = _selectedFiles.length > 0 ? _selectedFiles[0] : null;
        if (_file && setFile) {
            setFile(_file);
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
            <Box sx={dropzoneSx} onClick={handleClickFile}>
                <Stack spacing={1.5} alignItems="center">
                    <Box sx={{ color: 'var(--warning)', p: 1 }}>
                        <IconCamera width={32} height={32} />
                    </Box>
                    <ButtonCancel
                        label={t('choose-photo', { ns: NS_BUTTONS }) || "Choisir une photo"}
                        icon={<Icon icon="material-symbols:upload" width="20" height="20" />}
                        isAdmin={true}
                        sx={{
                            border: '1px solid var(--card-border)',
                            color: 'var(--font-color)',
                            transition: 'border-color 0.2s, background 0.2s'
                        }}
                    />
                </Stack>
            </Box>
        </>
    );
}

function PhotoCardComponent({ langKey, file, onSetFile, onRemoveFile, disabled = false }) {
    const { t } = useTranslation([NS_LANGS, NS_BUTTONS]);
    const langInfo = ClassLang.getOneLang(langKey);

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
                    label={`${langInfo?.flag_str || ""} ${t(langKey, { ns: NS_LANGS })}`}
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

                {!file && (
                    <DownloadPhotoComponent file={file} setFile={onSetFile} />
                )}

                {file && (
                    <Stack spacing={1.5}>
                        <Box sx={{ borderRadius: 1, overflow: 'hidden', border: '1px solid var(--card-border)' }}>
                            <ImageComponent src={URL.createObjectURL(file)} uid={`preview-${langKey}`} />
                        </Box>
                        <Stack
                            onClick={onRemoveFile}
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                            alignItems="center"
                            sx={{ color: 'var(--error)', cursor: 'pointer' }}
                        >
                            <IconButton sx={{ background: 'rgba(0,0,0,0.75)', cursor: 'pointer' }}>
                                <Icon color="red" icon="mdi:delete-outline" width="12" height="12" />
                            </IconButton>
                            <Typography sx={{ fontSize: '0.85rem' }}>
                                {ClassFile.formatFileName(file.name)}
                            </Typography>
                        </Stack>
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}

/** Composant pour gérer une liste de valeurs simples (goals, programs, etc.) */
function ContentListSection({ title, array, setArray, disabled = false }) {
    const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_BUTTONS]);
    const [newValue, setNewValue] = useState("");

    const onAddValue = useCallback(() => {
        if (newValue.trim().length === 0) return;
        setArray(prev => [...prev, { id: makeId(), value: newValue.trim() }]);
        setNewValue("");
    }, [newValue, setArray]);

    const onChangeValue = useCallback((index, value) => {
        setArray(prev => prev.map((row, i) => (i === index ? { ...row, value } : row)));
    }, [setArray]);

    const onDeleteValue = useCallback((index) => {
        setArray(prev => prev.filter((_, i) => i !== index));
    }, [setArray]);

    const onMoveValue = useCallback((fromIndex, toIndex) => {
        if (fromIndex < 0 || toIndex < 0 || fromIndex >= array.length || toIndex >= array.length) return;
        setArray(prev => {
            const newArray = [...prev];
            const [movedItem] = newArray.splice(fromIndex, 1);
            newArray.splice(toIndex, 0, movedItem);
            return newArray;
        });
    }, [array.length, setArray]);

    const rowSx = {
        p: 1,
        borderRadius: 1,
        bgcolor: "transparent",
        transition: "background 0.2s",
        "&:hover": { bgcolor: "var(--warning-shadow-sm)" },
    };

    return (
        <Stack spacing={1} alignItems="stretch" sx={{ py: 1.5, px: 1 }} onClick={(e) => e.stopPropagation()}>
            {array?.map?.((item, i) => (
                <Grid
                    key={item.id}
                    container
                    alignItems="center"
                    justifyContent="stretch"
                    direction="row"
                    spacing={1.5}
                    sx={{ width: "100%", ...rowSx }}
                >
                    {item.value.length > 0 && (
                        <Grid size="auto">
                            <Box onClick={() => i > 0 && onMoveValue(i, i - 1)} sx={{ cursor: i > 0 ? 'pointer' : 'default' }}>
                                <IconArrowUp color={`var(--${i > 0 ? 'warning' : 'grey-light'})`} />
                            </Box>
                            <Box onClick={() => i < array.length - 1 && onMoveValue(i, i + 1)} sx={{ cursor: i < array.length - 1 ? 'pointer' : 'default' }}>
                                <IconArrowDown color={`var(--${i < array.length - 1 ? 'warning' : 'grey-light'})`} />
                            </Box>
                        </Grid>
                    )}
                    <Grid size="auto">
                        <Typography variant="body2" sx={{ color: "var(--grey)", fontWeight: 600, minWidth: 24 }}>
                            {i + 1}.
                        </Typography>
                    </Grid>
                    <Grid size="grow">
                        <FieldComponent
                            disabled={disabled}
                            type="multiline"
                            name={item.id}
                            value={item.value}
                            fullWidth
                            minRows={1}
                            maxRows={10}
                            onChange={(e) => onChangeValue(i, e.target.value)}
                            onClear={() => onChangeValue(i, "")}
                            removable={!disabled}
                            onRemove={() => onDeleteValue(i)}
                            isAdmin={true}
                        />
                    </Grid>
                </Grid>
            ))}
            <Grid
                container
                alignItems="center"
                justifyContent="stretch"
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
                        disabled={disabled}
                        type="multiline"
                        name="create"
                        value={newValue}
                        fullWidth
                        minRows={1}
                        maxRows={10}
                        onChange={(e) => setNewValue(e.target.value)}
                        onClear={() => setNewValue("")}
                        editable={newValue.length > 0}
                        onSubmit={onAddValue}
                        isAdmin={true}
                    />
                </Grid>
            </Grid>
        </Stack>
    );
}

/** Composant pour gérer les tags (title + subtitle) */
function TagsListSection({ array, setArray, disabled = false }) {
    const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_BUTTONS, NS_FORM]);
    const [newValue, setNewValue] = useState({ title: "", subtitle: "" });

    const onAddValue = useCallback(() => {
        if (newValue.title.trim().length === 0 || newValue.subtitle.trim().length === 0) return;
        setArray(prev => [...prev, { id: makeId(), value: { title: newValue.title.trim(), subtitle: newValue.subtitle.trim() } }]);
        setNewValue({ title: "", subtitle: "" });
    }, [newValue, setArray]);

    const onChangeValue = useCallback((index, field, value) => {
        setArray(prev => prev.map((row, i) => (i === index ? { ...row, value: { ...row.value, [field]: value } } : row)));
    }, [setArray]);

    const onDeleteValue = useCallback((index) => {
        setArray(prev => prev.filter((_, i) => i !== index));
    }, [setArray]);

    const onMoveValue = useCallback((fromIndex, toIndex) => {
        if (fromIndex < 0 || toIndex < 0 || fromIndex >= array.length || toIndex >= array.length) return;
        setArray(prev => {
            const newArray = [...prev];
            const [movedItem] = newArray.splice(fromIndex, 1);
            newArray.splice(toIndex, 0, movedItem);
            return newArray;
        });
    }, [array.length, setArray]);

    const rowSx = {
        p: 1,
        borderRadius: 1,
        bgcolor: "transparent",
        transition: "background 0.2s",
        "&:hover": { bgcolor: "var(--warning-shadow-sm)" },
    };

    return (
        <Stack spacing={1} alignItems="stretch" sx={{ py: 1.5, px: 1 }} onClick={(e) => e.stopPropagation()}>
            {array?.map?.((item, i) => (
                <Grid
                    key={item.id}
                    container
                    alignItems="center"
                    justifyContent="stretch"
                    direction="row"
                    spacing={1.5}
                    sx={{ width: "100%", ...rowSx }}
                >
                    {item.value.title.length > 0 && item.value.subtitle.length > 0 && (
                        <Grid size="auto">
                            <Box onClick={() => i > 0 && onMoveValue(i, i - 1)} sx={{ cursor: i > 0 ? 'pointer' : 'default' }}>
                                <IconArrowUp color={`var(--${i > 0 ? 'warning' : 'grey-light'})`} />
                            </Box>
                            <Box onClick={() => i < array.length - 1 && onMoveValue(i, i + 1)} sx={{ cursor: i < array.length - 1 ? 'pointer' : 'default' }}>
                                <IconArrowDown color={`var(--${i < array.length - 1 ? 'warning' : 'grey-light'})`} />
                            </Box>
                        </Grid>
                    )}
                    <Grid size="auto">
                        <Typography variant="body2" sx={{ color: "var(--grey)", fontWeight: 600, minWidth: 24 }}>
                            {i + 1}.
                        </Typography>
                    </Grid>
                    <Grid size="grow">
                        <Stack spacing={1}>
                            <FieldComponent
                                disabled={disabled}
                                type="multiline"
                                name="title"
                                placeholder={t("title", { ns: NS_FORM }) || "Titre"}
                                value={item.value.title}
                                fullWidth
                                minRows={1}
                                maxRows={10}
                                onChange={(e) => onChangeValue(i, 'title', e.target.value)}
                                onClear={() => onChangeValue(i, 'title', "")}
                                isAdmin={true}
                            />
                            <FieldComponent
                                disabled={disabled}
                                type="multiline"
                                name="subtitle"
                                placeholder={t("subtitle", { ns: NS_FORM }) || "Sous-titre"}
                                value={item.value.subtitle}
                                fullWidth
                                minRows={1}
                                maxRows={10}
                                onChange={(e) => onChangeValue(i, 'subtitle', e.target.value)}
                                onClear={() => onChangeValue(i, 'subtitle', "")}
                                isAdmin={true}
                            />
                        </Stack>
                    </Grid>
                    <Grid size="auto">
                        <IconButton
                            onClick={() => onDeleteValue(i)}
                            disabled={disabled}
                            sx={{
                                background: 'red',
                                color: "var(--background)",
                                width: '24px',
                                height: '24px',
                                '&:hover': {
                                    color: 'background.main',
                                    backgroundColor: 'error.main',
                                    boxShadow: '0 0 0 0.2rem rgba(255,0,0,0.5)',
                                },
                            }}
                            size="small"
                        >
                            <IconRemove width={14} height={14} />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
            <Grid
                container
                alignItems="center"
                justifyContent="stretch"
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
                    <Stack spacing={1}>
                        <FieldComponent
                            disabled={disabled}
                            type="multiline"
                            name="title"
                            placeholder={t("title", { ns: NS_FORM }) || "Titre"}
                            value={newValue.title}
                            fullWidth
                            minRows={1}
                            maxRows={10}
                            onChange={(e) => setNewValue(prev => ({ ...prev, title: e.target.value }))}
                            onClear={() => setNewValue(prev => ({ ...prev, title: "" }))}
                            isAdmin={true}
                        />
                        <FieldComponent
                            disabled={disabled}
                            type="multiline"
                            name="subtitle"
                            placeholder={t("subtitle", { ns: NS_FORM }) || "Sous-titre"}
                            value={newValue.subtitle}
                            fullWidth
                            minRows={1}
                            maxRows={10}
                            onChange={(e) => setNewValue(prev => ({ ...prev, subtitle: e.target.value }))}
                            onClear={() => setNewValue(prev => ({ ...prev, subtitle: "" }))}
                            isAdmin={true}
                        />
                    </Stack>
                </Grid>
                <Grid size="auto">
                    <IconButton
                        disabled={disabled || newValue.title.length === 0 || newValue.subtitle.length === 0}
                        onClick={onAddValue}
                        sx={{
                            background: 'var(--warning)',
                            color: 'var(--background)',
                            width: '25px',
                            height: '25px',
                            '&:hover': {
                                color: 'var(--background)',
                                backgroundColor: 'var(--warning)',
                                boxShadow: '0 0 0 0.2rem var(--warning-shadow-sm)',
                            },
                        }}
                        size="small"
                    >
                        <IconCheck sx={{ fontSize: '15px' }} />
                    </IconButton>
                </Grid>
            </Grid>
        </Stack>
    );
}

export default function AdminCreateLessonPage() {
    const router = useRouter();
    const params = useParams();
    const { uid: uidUser } = params;
    const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_LESSONS, NS_BUTTONS, NS_DASHBOARD_MENU, NS_FORM, NS_LANGS]);
    const { user } = useAuth();
    const { create: createLesson } = useLesson();
    const { lang } = useLanguage();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        code: "",
        title: "",
        subtitle: "",
        description: "",
        enabled: false,
        category: ClassLesson.CATEGORY.OFFICE,
        certified: false,
    });

    // Photos par langue (fichiers)
    const [photoFiles, setPhotoFiles] = useState(
        languages.reduce((acc, l) => {
            acc[l] = null;
            return acc;
        }, {})
    );

    // Contenu du cours
    const [goals, setGoals] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [notes, setNotes] = useState([]);
    const [targetAudiences, setTargetAudiences] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [prerequisites, setPrerequisites] = useState([]);
    const [tags, setTags] = useState([]);

    // Accordion state
    const [modeAccordion, setModeAccordion] = useState('');
    const [openedView, setOpenedView] = useState('');

    const isAuthorized = useMemo(
        () => user instanceof ClassUserAdministrator,
        [user]
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleClear = (name) => {
        setFormData((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSetPhotoFile = (langKey, file) => {
        setPhotoFiles(prev => ({ ...prev, [langKey]: file }));
    };

    const handleRemovePhotoFile = (langKey) => {
        setPhotoFiles(prev => ({ ...prev, [langKey]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            // Créer d'abord un uid pour le lesson
            const tempLesson = new ClassLesson({});
            const uidLesson = tempLesson.createFirestoreDocUid();

            // Uploader les fichiers photos si présents
            const uploadedPhotos = {};
            for (const [langKey, file] of Object.entries(photoFiles)) {
                if (file) {
                    const filename = file.name;
                    const extension = filename.split('.').pop().toLowerCase();
                    const _path = getStoragePath(uidLesson, langKey, extension);
                    const resultFile = await ClassFile.uploadFileToFirebase({
                        file: file,
                        path: _path,
                    });
                    uploadedPhotos[langKey] = resultFile?.uri || "";
                }
            }

            // Préparer les données de contenu à traduire
            const contentData = {
                title: formData.title,
                subtitle: formData.subtitle,
                description: formData.description,
                goals: goals.map(g => g.value),
                programs: programs.map(p => p.value),
                notes: notes.map(n => n.value),
                target_audiences: targetAudiences.map(t => t.value),
                materials: materials.map(m => m.value),
                prerequisites: prerequisites.map(p => p.value),
                tags: tags.map(t => ({ title: t.value.title, subtitle: t.value.subtitle })),
            };

            const qs = encodeURIComponent(JSON.stringify(contentData));
            const res = await fetch(`/api/test?lang=${lang}&translations=${qs}`);
            const data = await res.json();

            // Créer les instances de traduction avec les traductions automatiques
            const translateInstances = Object.entries(data).map(([langKey, trans]) =>
                new ClassLessonTranslate({
                    lang: langKey,
                    title: trans.title || "",
                    subtitle: trans.subtitle || "",
                    description: trans.description || "",
                    prerequisites: trans.prerequisites || [],
                    goals: trans.goals || [],
                    programs: trans.programs || [],
                    target_audiences: trans.target_audiences || [],
                    materials: trans.materials || [],
                    notes: trans.notes || [],
                    tags: trans.tags || [],
                    photo_url: uploadedPhotos[langKey] || "",
                })
            );

            // Créer l'instance de leçon avec l'uid généré
            const lesson = new ClassLesson({
                uid: uidLesson,
                code: formData.code,
                enabled: formData.enabled,
                category: formData.category,
                certified: formData.certified,
                translates: translateInstances,
            });

            const created = await createLesson(lesson);
            if (created) {
                router.push(PAGE_ADMIN_ONE_LESSON(uidUser, created.uid));
            } else {
                throw new Error("Échec de la création du cours");
            }
        } catch (err) {
            console.error("Erreur création cours:", err);
            setError(err.message || "Une erreur est survenue");
        } finally {
            setSaving(false);
        }
    };

    const configBlockSx = {
        bgcolor: 'var(--card-color)',
        color: 'var(--font-color)',
        borderRadius: 2,
        border: '1px solid var(--card-border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        p: 2.5,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': { boxShadow: '0 4px 14px rgba(0,0,0,0.06)' },
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
                { name: t("lessons", { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_LESSONS(uidUser) },
                { name: t("title-create", { ns: NS_LESSONS }) || "Nouveau cours", url: null },
            ]}
            icon={<IconLessons width={22} height={22} />}
        >
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 1000 }}>
                {/* En-tête avec titre et sous-titre */}
                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "var(--font-color)",
                            mb: 1,
                        }}
                    >
                        {t("title-create", { ns: NS_LESSONS }) || "Nouveau cours"}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "var(--grey-light)",
                            fontSize: "0.95rem",
                        }}
                    >
                        {t("subtitle-create", { ns: NS_LESSONS }) || "Remplis les informations ci-dessous pour créer un nouveau cours sur la plateforme."}
                    </Typography>
                </Box>

                {/* Bouton retour */}
                <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                    <ButtonCancel
                        onClick={() => router.push(PAGE_ADMIN_LESSONS(uidUser))}
                        label={t("back", { ns: NS_BUTTONS })}
                        isAdmin={true}
                    />
                </Stack>

                {error && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: "rgba(239, 68, 68, 0.1)", borderRadius: 1, color: "#ef4444" }}>
                        {error}
                    </Box>
                )}

                {/* Configuration - Enabled Block */}
                <Box sx={configBlockSx}>
                    <Stack direction="row" alignItems="center" spacing={2} flex={1} minWidth={0}>
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2,
                                bgcolor: formData.enabled ? 'var(--warning-shadow-sm)' : 'var(--grey-hyper-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background 0.2s ease',
                            }}
                        >
                            <Icon
                                icon={formData.enabled ? 'mdi:eye-check' : 'mdi:eye-off-outline'}
                                width={26}
                                height={26}
                                style={{ color: formData.enabled ? 'var(--warning)' : 'var(--grey)' }}
                            />
                        </Box>
                        <Stack spacing={0.25}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--font-color)' }}>
                                {t('enabled')}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'var(--grey)', fontSize: '0.875rem' }}>
                                {t('enabled_description')}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Switch
                        name="enabled"
                        checked={formData.enabled}
                        onChange={handleChange}
                        disabled={saving}
                        size="medium"
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: 'var(--warning)',
                                '& + .MuiSwitch-track': { bgcolor: 'var(--warning) !important', opacity: 0.4 },
                            },
                        }}
                    />
                </Box>

                {/* Configuration - Certified Block */}
                <Box sx={configBlockSx}>
                    <Stack direction="row" alignItems="center" spacing={2} flex={1} minWidth={0}>
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2,
                                bgcolor: formData.certified ? 'var(--warning-shadow-sm)' : 'var(--grey-hyper-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background 0.2s ease',
                            }}
                        >
                            <Icon
                                icon="qlementine-icons:certified-16"
                                width={26}
                                height={26}
                                style={{ color: formData.certified ? 'var(--warning)' : 'var(--grey)' }}
                            />
                        </Box>
                        <Stack spacing={0.25}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--font-color)' }}>
                                {t('certified')}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'var(--grey)', fontSize: '0.875rem' }}>
                                {t('certified_short')}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Switch
                        name="certified"
                        checked={formData.certified}
                        onChange={handleChange}
                        disabled={saving}
                        size="medium"
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: 'var(--warning)',
                                '& + .MuiSwitch-track': { bgcolor: 'var(--warning) !important', opacity: 0.4 },
                            },
                        }}
                    />
                </Box>

                {/* Informations générales - Accordion */}
                <Box component="div" onClick={() => setOpenedView(openedView === 'infos' ? '' : 'infos')} sx={{ cursor: "pointer", mb: 1 }}>
                    <AccordionComponent title={t("infos")} expanded={openedView === 'infos'} isAdmin={true}>
                        <Box sx={{ p: 2 }} onClick={(e) => e.stopPropagation()}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <SelectComponentDark
                                        name="category"
                                        label={t("category")}
                                        value={formData.category}
                                        values={ClassLesson.ALL_CATEGORIES.map(cat => ({ id: cat, value: t(cat) }))}
                                        onChange={handleChange}
                                        hasNull={false}
                                        fullWidth
                                        disabled={saving}
                                        isAdmin={true}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <FieldComponent
                                        label={t("code", { ns: NS_FORM })}
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        onClear={() => handleClear("code")}
                                        placeholder="COURS-DAND-XXX-2026"
                                        required
                                        fullWidth
                                        isAdmin
                                        disabled={saving}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <FieldComponent
                                        label={t("title")}
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        onClear={() => handleClear("title")}
                                        placeholder={t("placeholder_title", { ns: NS_LESSONS }) || "Titre du cours..."}
                                        required
                                        fullWidth
                                        isAdmin
                                        disabled={saving}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <FieldComponent
                                        label={t("subtitle")}
                                        name="subtitle"
                                        value={formData.subtitle}
                                        onChange={handleChange}
                                        onClear={() => handleClear("subtitle")}
                                        placeholder={t("placeholder_subtitle", { ns: NS_LESSONS }) || "Sous-titre du cours..."}
                                        fullWidth
                                        isAdmin
                                        disabled={saving}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <FieldComponent
                                        label={t("description")}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        onClear={() => handleClear("description")}
                                        type="multiline"
                                        minRows={2}
                                        maxRows={6}
                                        fullWidth
                                        isAdmin
                                        disabled={saving}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </AccordionComponent>
                </Box>

                {/* Photos par langue - Accordion */}
                <Box component="div" onClick={() => setOpenedView(openedView === 'photos' ? '' : 'photos')} sx={{ cursor: "pointer", mb: 1 }}>
                    <AccordionComponent title={t("photos")} expanded={openedView === 'photos'} isAdmin={true}>
                        <Box sx={{ p: 2 }} onClick={(e) => e.stopPropagation()}>
                            <Grid container spacing={2}>
                                {languages.map((l) => (
                                    <Grid key={l} size={{ xs: 12, sm: 6, md: 4 }}>
                                        <PhotoCardComponent
                                            langKey={l}
                                            file={photoFiles[l]}
                                            onSetFile={(file) => handleSetPhotoFile(l, file)}
                                            onRemoveFile={() => handleRemovePhotoFile(l)}
                                            disabled={saving}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </AccordionComponent>
                </Box>

                {/* Contenu du cours */}
                <Box sx={{ mb: 2 }}>
                    <Typography sx={{ ...sectionTitleSx, mb: 1.5 }}>
                        <Icon icon="ph:list-bullets-fill" width={20} />
                        {t("content") || "Contenu du cours"}
                    </Typography>
                    <Stack spacing={0.5}>
                        {/* Objectifs */}
                        <Box component="div" onClick={() => setModeAccordion(modeAccordion === 'goals' ? '' : 'goals')} sx={{ cursor: "pointer" }}>
                            <AccordionComponent title={t("goals")} expanded={modeAccordion === 'goals'} isAdmin={true}>
                                <ContentListSection
                                    title="goals"
                                    array={goals}
                                    setArray={setGoals}
                                    disabled={saving}
                                />
                            </AccordionComponent>
                        </Box>

                        {/* Programmes */}
                        <Box component="div" onClick={() => setModeAccordion(modeAccordion === 'programs' ? '' : 'programs')} sx={{ cursor: "pointer" }}>
                            <AccordionComponent title={t("programs")} expanded={modeAccordion === 'programs'} isAdmin={true}>
                                <ContentListSection
                                    title="programs"
                                    array={programs}
                                    setArray={setPrograms}
                                    disabled={saving}
                                />
                            </AccordionComponent>
                        </Box>

                        {/* Notes */}
                        <Box component="div" onClick={() => setModeAccordion(modeAccordion === 'notes' ? '' : 'notes')} sx={{ cursor: "pointer" }}>
                            <AccordionComponent title={t("notes")} expanded={modeAccordion === 'notes'} isAdmin={true}>
                                <ContentListSection
                                    title="notes"
                                    array={notes}
                                    setArray={setNotes}
                                    disabled={saving}
                                />
                            </AccordionComponent>
                        </Box>

                        {/* Publics cibles */}
                        <Box component="div" onClick={() => setModeAccordion(modeAccordion === 'target_audiences' ? '' : 'target_audiences')} sx={{ cursor: "pointer" }}>
                            <AccordionComponent title={t("target_audiences")} expanded={modeAccordion === 'target_audiences'} isAdmin={true}>
                                <ContentListSection
                                    title="target_audiences"
                                    array={targetAudiences}
                                    setArray={setTargetAudiences}
                                    disabled={saving}
                                />
                            </AccordionComponent>
                        </Box>

                        {/* Matériels */}
                        <Box component="div" onClick={() => setModeAccordion(modeAccordion === 'materials' ? '' : 'materials')} sx={{ cursor: "pointer" }}>
                            <AccordionComponent title={t("materials")} expanded={modeAccordion === 'materials'} isAdmin={true}>
                                <ContentListSection
                                    title="materials"
                                    array={materials}
                                    setArray={setMaterials}
                                    disabled={saving}
                                />
                            </AccordionComponent>
                        </Box>

                        {/* Prérequis */}
                        <Box component="div" onClick={() => setModeAccordion(modeAccordion === 'prerequisites' ? '' : 'prerequisites')} sx={{ cursor: "pointer" }}>
                            <AccordionComponent title={t("prerequisites")} expanded={modeAccordion === 'prerequisites'} isAdmin={true}>
                                <ContentListSection
                                    title="prerequisites"
                                    array={prerequisites}
                                    setArray={setPrerequisites}
                                    disabled={saving}
                                />
                            </AccordionComponent>
                        </Box>

                        {/* Tags */}
                        <Box component="div" onClick={() => setModeAccordion(modeAccordion === 'tags' ? '' : 'tags')} sx={{ cursor: "pointer" }}>
                            <AccordionComponent title={t("tags")} expanded={modeAccordion === 'tags'} isAdmin={true}>
                                <TagsListSection
                                    array={tags}
                                    setArray={setTags}
                                    disabled={saving}
                                />
                            </AccordionComponent>
                        </Box>
                    </Stack>
                </Box>

                {/* Boutons */}
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                    <ButtonCancel
                        onClick={() => router.push(PAGE_ADMIN_LESSONS(uidUser))}
                        label={t("cancel", { ns: NS_BUTTONS })}
                        isAdmin
                        disabled={saving}
                    />
                    <ButtonConfirm
                        type="submit"
                        label={saving ? (t("creating", { ns: NS_BUTTONS }) || "Création...") : (t("save", { ns: NS_BUTTONS }))}
                        isAdmin
                        disabled={saving || !formData.code || !formData.title}
                        loading={saving}
                        icon={<Icon icon="ph:floppy-disk-fill" width={18} />}
                    />
                </Stack>
            </Box>
        </AdminPageWrapper>
    );
}
