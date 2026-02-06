"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IconCertificate, IconSearch } from "@/assets/icons/IconsComponent";
import {
    NS_BUTTONS,
    NS_DASHBOARD_MENU,
    NS_DIPLOMAS,
} from "@/contexts/i18n/settings";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
    PAGE_ADMIN_DIPLOMAS,
    PAGE_ADMIN_CREATE_DIPLOMA,
    PAGE_ADMIN_ONE_DIPLOMA,
} from "@/contexts/constants/constants_pages";
import { useDiploma } from "@/contexts/DiplomaProvider";
import { ClassUserAdministrator } from "@/classes/users/ClassUser";
import { ClassDiploma } from "@/classes/ClassDiploma";
import AdminPageWrapper from "@/components/wrappers/AdminPageWrapper";
import FieldComponent from "@/components/elements/FieldComponent";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { Box, Grid, Stack, Typography, Chip, IconButton, Tooltip, CircularProgress } from "@mui/material";
import { Icon } from "@iconify/react";

const GRID_COLUMNS = "minmax(0, 0.8fr) minmax(0, 1.5fr) minmax(0, 0.6fr) minmax(0, 0.5fr) minmax(0, 0.5fr) minmax(0, 0.5fr)";

function DiplomasComponent() {
    const router = useRouter();
    const params = useParams();
    const { uid: uidUser } = params;
    const { t } = useTranslation([ClassDiploma.NS_COLLECTION, NS_DIPLOMAS, NS_BUTTONS, NS_DASHBOARD_MENU]);
    const { diplomas, isLoading, removeDiploma } = useDiploma();
    const [filter, setFilter] = useState({ search: "" });
    const [diplomasFilter, setDiplomasFilter] = useState([]);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        let list = [...diplomas];
        if (filter.search?.trim()) {
            const q = filter.search.toLowerCase();
            list = list.filter((d) => {
                const byTitle = d.translate?.title?.toLowerCase().includes(q);
                const byCode = d.code?.toLowerCase().includes(q);
                const byCategory = t(d.category)?.toLowerCase().includes(q);
                return byTitle || byCode || byCategory;
            });
        }
        setDiplomasFilter(list);
    }, [filter.search, diplomas, t]);

    const handleDelete = async (e, diplomaId) => {
        e.stopPropagation();
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce diplôme ?")) return;
        setDeleting(diplomaId);
        try {
            await removeDiploma(diplomaId);
        } catch (err) {
            console.error("Erreur suppression:", err);
        } finally {
            setDeleting(null);
        }
    };

    const cardSx = {
        bgcolor: "var(--card-color)",
        color: "var(--font-color)",
        borderRadius: 2,
        border: "1px solid var(--card-border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease",
        "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
    };

    const headerSx = {
        display: "grid",
        gridTemplateColumns: GRID_COLUMNS,
        gap: 1.5,
        px: 2,
        py: 1.5,
        bgcolor: "var(--grey-hyper-dark)",
        color: "var(--font-reverse-color)",
        borderBottom: "1px solid var(--card-border)",
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        "@media (max-width: 900px)": { display: "none" },
    };

    const rowSx = {
        display: "grid",
        gridTemplateColumns: GRID_COLUMNS,
        gap: 1.5,
        px: 2,
        py: 1.5,
        alignItems: "center",
        fontSize: "0.9rem",
        borderBottom: "1px solid var(--card-border)",
        transition: "background 0.2s ease",
        cursor: "pointer",
        "&:hover": {
            bgcolor: "rgba(255, 152, 0, 0.05)",
        },
        "@media (max-width: 900px)": {
            gridTemplateColumns: "1fr",
            gap: 1,
            p: 2,
            borderRadius: 2,
            border: "1px solid var(--card-border)",
            mb: 1,
        },
    };

    const cellSx = { minWidth: 0 };

    const nameSx = {
        m: 0,
        fontWeight: 600,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        color: "var(--font-color)",
    };

    const subSx = {
        m: 0,
        mt: 0.25,
        fontSize: "0.8rem",
        color: "var(--grey)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    };

    const getStatusColor = (status) => {
        switch (status) {
            case ClassDiploma.STATUS.ACTIVE:
                return "var(--success)";
            case ClassDiploma.STATUS.DRAFT:
                return "var(--warning)";
            case ClassDiploma.STATUS.ARCHIVED:
                return "var(--grey)";
            default:
                return "var(--grey)";
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ py: 4, textAlign: "center" }}>
                <CircularProgress size={32} color="warning" />
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", minHeight: "100%" }}>
            <Grid container spacing={2} sx={{ mb: 2.5 }} alignItems="center" justifyContent="space-between">
                <Grid size={{ xs: 12, sm: 6 }} sx={{ maxWidth: 400 }}>
                    <FieldComponent
                        name="search"
                        value={filter.search ?? ""}
                        placeholder="Rechercher un diplôme..."
                        fullWidth
                        type="text"
                        icon={<IconSearch width={18} />}
                        onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
                        onClear={() => setFilter((prev) => ({ ...prev, search: "" }))}
                        isAdmin={true}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: "auto" }}>
                    <Link href={PAGE_ADMIN_CREATE_DIPLOMA(uidUser)} style={{ textDecoration: "none" }}>
                        <ButtonConfirm
                            label={t("create", { ns: NS_BUTTONS })}
                            isAdmin={true}
                            icon={<Icon icon="ph:plus-bold" width={18} />}
                        />
                    </Link>
                </Grid>
            </Grid>

            <Box sx={cardSx}>
                <Box sx={headerSx}>
                    <span>Code</span>
                    <span>{t("title")}</span>
                    <span>{t("category")}</span>
                    <span>{t("level")}</span>
                    <span>Status</span>
                    <span>{t("actions", { ns: NS_BUTTONS }) || "Actions"}</span>
                </Box>

                <Stack component="div" sx={{ flexDirection: "column" }}>
                    {diplomasFilter.length === 0 && (
                        <Box sx={{ py: 4, px: 2, textAlign: "center", color: "var(--grey)", fontSize: "0.95rem" }}>
                            Aucun diplôme trouvé
                        </Box>
                    )}

                    {diplomasFilter.map((diploma, i) => (
                        <Box
                            key={diploma.uid}
                            onClick={() => router.push(PAGE_ADMIN_ONE_DIPLOMA(uidUser, diploma.uid))}
                            sx={{
                                ...rowSx,
                                borderBottom: i === diplomasFilter.length - 1 ? "none" : "1px solid var(--card-border)",
                            }}
                        >
                            <Box sx={cellSx}>
                                <Typography component="p" sx={{ ...nameSx, fontFamily: "monospace", fontSize: "0.85rem" }}>
                                    {diploma.code || "-"}
                                </Typography>
                            </Box>

                            <Box sx={cellSx}>
                                <Typography component="p" sx={nameSx}>
                                    {diploma.translate?.title || diploma.title || "-"}
                                </Typography>
                                {diploma.translate?.description && (
                                    <Typography component="p" sx={subSx}>
                                        {diploma.translate.description.slice(0, 60)}
                                        {diploma.translate.description.length > 60 ? "..." : ""}
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={cellSx}>
                                <Chip
                                    label={t(diploma.category) || diploma.category}
                                    size="small"
                                    sx={{
                                        bgcolor: "var(--warning-shadow-sm)",
                                        color: "var(--warning)",
                                        fontWeight: 500,
                                        fontSize: "0.75rem",
                                    }}
                                />
                            </Box>

                            <Box sx={cellSx}>
                                <Typography component="p" sx={subSx}>
                                    {t(diploma.level) || diploma.level}
                                </Typography>
                            </Box>

                            <Box sx={cellSx}>
                                <Chip
                                    label={t(diploma.status) || diploma.status}
                                    size="small"
                                    sx={{
                                        bgcolor: `${getStatusColor(diploma.status)}20`,
                                        color: getStatusColor(diploma.status),
                                        fontWeight: 500,
                                        fontSize: "0.75rem",
                                    }}
                                />
                            </Box>

                            <Box sx={{ ...cellSx, display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Tooltip title={t("edit", { ns: NS_BUTTONS })}>
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(PAGE_ADMIN_ONE_DIPLOMA(uidUser, diploma.uid));
                                        }}
                                        size="small"
                                        sx={{ color: "var(--warning)", "&:hover": { bgcolor: "rgba(255, 152, 0, 0.1)" } }}
                                    >
                                        <Icon icon="ph:pencil-simple-fill" width={18} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t("delete", { ns: NS_BUTTONS })}>
                                    <IconButton
                                        onClick={(e) => handleDelete(e, diploma.uid)}
                                        disabled={deleting === diploma.uid}
                                        size="small"
                                        sx={{ color: "var(--error)", "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" } }}
                                    >
                                        {deleting === diploma.uid ? (
                                            <CircularProgress size={16} color="error" />
                                        ) : (
                                            <Icon icon="ph:trash-fill" width={18} />
                                        )}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}

export default function AdminDiplomasListPage() {
    const { t } = useTranslation([NS_DIPLOMAS, NS_DASHBOARD_MENU, NS_BUTTONS]);
    const params = useParams();
    const { uid } = params;
    const { user } = useAuth();
    const isAuthorized = useMemo(() => user instanceof ClassUserAdministrator, [user]);

    return (
        <AdminPageWrapper
            isAuthorized={isAuthorized}
            titles={[{ name: t("diplomas", { ns: NS_DASHBOARD_MENU }), url: PAGE_ADMIN_DIPLOMAS(uid) }]}
            icon={<IconCertificate width={22} height={22} />}
        >
            <Stack alignItems="flex-start" spacing={2} sx={{ width: "100%", minHeight: "100%" }}>
                <DiplomasComponent />
            </Stack>
        </AdminPageWrapper>
    );
}
