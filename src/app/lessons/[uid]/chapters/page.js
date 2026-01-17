"use client"

import React, { useEffect } from "react";
import { Box, Chip, CircularProgress, Container, Grid, Stack, Typography } from "@mui/material";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import ChapterListComponent from "@/components/chapters/ChapterListComponent";
import { useTranslation } from "react-i18next";
import { NS_DASHBOARD_MENU } from "@/contexts/i18n/settings";
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import { useLesson } from "@/contexts/LessonProvider";
import { IconLessons } from "@/assets/icons/IconsComponent";
import { useParams } from "next/navigation";
import { ClassLesson } from "@/classes/ClassLesson";

const CardHeader = () => {
    const { t } = useTranslation([ClassLesson.NS_COLLECTION]);
    //const { stats, stat, getOneStatIndex } = useStat();
    const { lesson } = useLesson();
    const chipHeader = {
        color: "var(--font-color)",
        bgcolor: "rgba(255,255,255,0.12)",
        borderColor: "var(--card-border)",
        fontWeight: 900,
    };
    return (<Stack sx={{ background: '', width: '100%' }}>
        <Grid container>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, my: 0.5 }}>
                        {lesson?.translate?.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {lesson?.translate?.subtitle}
                    </Typography>
                    <Box sx={{py:0.5}}>
                    <Chip label={t(lesson?.category)} variant="outlined" sx={chipHeader} />
                    </Box>
                </Box>
            </Grid>
        </Grid>
    </Stack>)
}

export default function ChaptersPage() {
    const { t } = useTranslation();
    const { uid: uidLesson } = useParams();
    const { lesson, setUidLesson } = useLesson();
    useEffect(() => {
        setUidLesson(uidLesson);
    }, [uidLesson]);
    return (<DashboardPageWrapper
        titles={[
            { name: t('lessons', { ns: NS_DASHBOARD_MENU }), url: PAGE_LESSONS },
            { name: lesson?.translate?.title, url: `${PAGE_LESSONS}/${lesson?.uid}` },
            { name: t('chapters', { ns: NS_DASHBOARD_MENU }), url: `` },
            //{ name: `${chapter?.uid_intern}. ${chapter?.translate?.title}`, url: '' },
        ]}
        //title={`Cours / ${lesson?.title}`}
        //subtitle={lesson?.translate?.subtitle}
        icon={<IconLessons />}
    >
        <Container maxWidth="lg" disableGutters sx={{ p: 0, background: '' }}>
            {
                <Grid container spacing={1}>
                    <Grid size={12}>
                        <CardHeader />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <ChapterListComponent />
                    </Grid>
                </Grid>
            }
        </Container>
    </DashboardPageWrapper>)
}