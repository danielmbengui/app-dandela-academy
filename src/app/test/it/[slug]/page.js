// src/app/courses/it-intro/[slug]/page.js
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { COURSE_IT_INTRO, getLessonBySlug } from "@/data/course_it_intro";
import { useParams } from "next/navigation";
//import { COURSE_IT_INTRO, getLessonBySlug } from "@/data/course_it_intro";

export default function LessonPage() {
  const params = useParams();
  const { slug } = params;
  const lesson = getLessonBySlug(COURSE_IT_INTRO, slug);

  if (!lesson) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Leçon introuvable
        </Typography>
        <Button component={Link} href="/courses/it-intro" sx={{ mt: 2 }}>
          Retour au cours
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
          <Chip label={`Partie ${lesson.partKey}`} variant="outlined" />
          <Chip label={lesson.partTitle} variant="outlined" />
        </Stack>

        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.6 }}>
          {lesson.title}
        </Typography>

        <Typography sx={{ color: "text.secondary", fontSize: "1.05rem" }}>
          {lesson.goal}
        </Typography>

        <Stack direction="row" spacing={1.2}>
          <Button
            component={Link}
            href={`/test/it/${lesson.slug}/exercise`}
            variant="contained"
            sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 800 }}
          >
            Faire l’exercice
          </Button>
          <Button
            component={Link}
            href="/courses/it-intro"
            variant="text"
            sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 800 }}
          >
            Retour
          </Button>
        </Stack>

        <Divider />

        <Stack spacing={2}>
          {(lesson.content || []).map((block, idx) => {
            if (block.type === "bullets") {
              return (
                <Box key={idx}>
                  <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
                    {block.title}
                  </Typography>
                  <Stack component="ul" sx={{ pl: 2, m: 0 }} spacing={0.6}>
                    {block.items.map((it, i) => (
                      <Typography key={i} component="li">
                        {it}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              );
            }
            if (block.type === "tips") {
              return (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid rgba(30,64,175,0.18)",
                    background:
                      "linear-gradient(135deg, rgba(30,64,175,0.10), rgba(30,64,175,0.02))",
                  }}
                >
                  <Typography sx={{ fontWeight: 900, mb: 0.5 }}>
                    {block.title}
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {block.text}
                  </Typography>
                </Box>
              );
            }
            return null;
          })}
        </Stack>

        {Array.isArray(lesson.images) && lesson.images.length > 0 && (
          <>
            <Divider />
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Illustrations
            </Typography>

            <Stack spacing={1.5}>
              {lesson.images.map((src, i) => (
                <Box
                  key={src}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(0,0,0,0.02)",
                  }}
                >
                  <Box sx={{ position: "relative", width: "100%", height: 280 }}>
                    <Image
                      src={src}
                      alt={`Illustration ${i + 1}`}
                      //fill
                      height={100}
                      width={200}
                      style={{ objectFit: "cover", height:'100%', width:'auto' }}
                      sizes="(max-width: 900px) 100vw, 900px"
                      priority={i === 0}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Container>
  );
}
