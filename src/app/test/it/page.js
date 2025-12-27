// src/app/courses/it-intro/page.js
"use client";

import { Container, Grid, Stack } from "@mui/material";
//import CourseHero from "@/components/CourseHero";
//import LessonCard from "@/components/LessonCard";
//import ProgressBarMini from "@/components/ProgressBarMini";
import { COURSE_IT_INTRO, flattenLessons } from "@/data/course_it_intro";
import CourseHero from "@/components/lesson/CourseHero";
import LessonCard from "@/components/lesson/LessonCard";
import ProgressBarMini from "@/components/lesson/ProgressBarMini";
//import { COURSE_IT_INTRO, flattenLessons } from "@/data/course_it_intro";

export default function Page() {
  const lessons = flattenLessons(COURSE_IT_INTRO);

  // demo: tu pourras brancher ça à Firestore ensuite
  const doneCount = 0;
  const progress = lessons.length ? (doneCount / lessons.length) * 100 : 0;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <CourseHero
          title={COURSE_IT_INTRO.title}
          subtitle={COURSE_IT_INTRO.subtitle}
          level={COURSE_IT_INTRO.level}
          hours={COURSE_IT_INTRO.estimatedHours}
        />

        <ProgressBarMini value={progress} label="Progression du cours" />

        <Grid container spacing={2.2}>
          {lessons.map((lesson) => (
            <Grid key={lesson.slug} item xs={12} md={6}>
              <LessonCard basePath="/test/it" lesson={lesson} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
