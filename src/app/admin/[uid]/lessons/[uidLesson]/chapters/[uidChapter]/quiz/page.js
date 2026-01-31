"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Slide,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { ClassLessonChapter } from "@/classes/lessons/ClassLessonChapter";
import { ClassLesson } from "@/classes/ClassLesson";
import { ClassUserDandela } from "@/classes/users/ClassUser";
import {
  ClassLessonChapterQuiz,
  ClassLessonChapterQuestion,
  ClassLessonChapterQuestionTranslation,
} from "@/classes/lessons/ClassLessonChapterQuiz";
import { useAuth } from "@/contexts/AuthProvider";
import { useLesson } from "@/contexts/LessonProvider";
import { useChapter } from "@/contexts/ChapterProvider";
import { defaultLanguage } from "@/contexts/i18n/settings";
import {
  NS_ADMIN_CHAPTERS,
  NS_BUTTONS,
  NS_DASHBOARD_MENU,
} from "@/contexts/i18n/settings";
import {
  PAGE_ADMIN_CHAPTERS,
  PAGE_ADMIN_ONE_CHAPTER,
  PAGE_ADMIN_CHAPTER_QUIZ,
  PAGE_ADMIN_ONE_QUIZ,
  PAGE_ADMIN_LESSONS,
  PAGE_ADMIN_ONE_LESSON,
} from "@/contexts/constants/constants_pages";
import { IconArrowDown, IconArrowUp, IconLessons } from "@/assets/icons/IconsComponent";

import AdminPageWrapper from "@/components/wrappers/AdminPageWrapper";
import ButtonCancel from "@/components/dashboard/elements/ButtonCancel";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import DialogConfirmAction from "@/components/dashboard/elements/DialogConfirmAction";
import FieldComponent from "@/components/elements/FieldComponent";
import SelectComponentDark from "@/components/elements/SelectComponentDark";
import AccordionComponent from "@/components/dashboard/elements/AccordionComponent";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}
function QuestionComponent({
  question,
  index,
  onUpdateQuestion,
  onRemoveQuestion,
  onConfirmRemoveQuestion,
  isCollapsed = false,
  onExpand,
  onCollapse,
  t,
}) {
  const [questionText, setQuestionText] = useState(question?.question || "");
  const [proposals, setProposals] = useState(question?.proposals || []);
  const [answer, setAnswer] = useState(question?.answer || {});
  const [newProposal, setNewProposal] = useState("");
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const initialQuestionRef = useRef(null);

  useEffect(() => {
    if (question != null && initialQuestionRef.current === null) {
      initialQuestionRef.current = JSON.parse(JSON.stringify(question));
    }
  }, [question]);

  useEffect(() => {
    setQuestionText(question?.question || "");
    setProposals(question?.proposals || []);
    setAnswer(question?.answer || {});
  }, [question]);

  const handleQuestionChange = (e) => {
    const value = e.target.value;
    setQuestionText(value);
    onUpdateQuestion(index, { ...question, question: value });
  };

  const handleProposalChange = (proposalIndex, value) => {
    const newProposals = [...proposals];
    newProposals[proposalIndex] = {
      ...newProposals[proposalIndex],
      value: value,
    };
    setProposals(newProposals);
    onUpdateQuestion(index, { ...question, proposals: newProposals });
  };

  const handleRemoveProposal = (proposalIndex) => {
    const newProposals = proposals.filter((_, i) => i !== proposalIndex);
    // Recalculer les uid_intern
    const updatedProposals = newProposals.map((p, i) => ({
      ...p,
      uid_intern: i + 1,
    }));
    setProposals(updatedProposals);

    // Si la réponse était cette proposition, réinitialiser
    let newAnswer = answer;
    if (answer?.uid_intern === proposals[proposalIndex]?.uid_intern) {
      newAnswer = {};
    } else if (answer?.uid_intern > proposalIndex + 1) {
      // Ajuster l'uid_intern de la réponse si nécessaire
      newAnswer = { ...answer, uid_intern: answer.uid_intern - 1 };
    }
    setAnswer(newAnswer);
    onUpdateQuestion(index, {
      ...question,
      proposals: updatedProposals,
      answer: newAnswer,
    });
  };

  const handleAddProposal = () => {
    if (!newProposal.trim()) return;
    const newProposalObj = {
      uid_intern: proposals.length + 1,
      value: newProposal.trim(),
    };
    const newProposals = [...proposals, newProposalObj];
    setProposals(newProposals);
    setNewProposal("");
    onUpdateQuestion(index, { ...question, proposals: newProposals });
  };

  const handleMoveProposalUp = (pIndex) => {
    if (pIndex <= 0) return;
    const newProposals = [...proposals];
    [newProposals[pIndex - 1], newProposals[pIndex]] = [newProposals[pIndex], newProposals[pIndex - 1]];
    const updatedProposals = newProposals.map((p, i) => ({ ...p, uid_intern: i + 1 }));
    const answerValue = answer?.value;
    const newAnswer = answerValue
      ? (() => {
          const found = updatedProposals.find((p) => p.value === answerValue);
          return found ? { uid_intern: found.uid_intern, value: found.value } : answer;
        })()
      : answer;
    setProposals(updatedProposals);
    setAnswer(newAnswer);
    onUpdateQuestion(index, { ...question, proposals: updatedProposals, answer: newAnswer });
  };

  const handleMoveProposalDown = (pIndex) => {
    if (pIndex >= proposals.length - 1) return;
    const newProposals = [...proposals];
    [newProposals[pIndex], newProposals[pIndex + 1]] = [newProposals[pIndex + 1], newProposals[pIndex]];
    const updatedProposals = newProposals.map((p, i) => ({ ...p, uid_intern: i + 1 }));
    const answerValue = answer?.value;
    const newAnswer = answerValue
      ? (() => {
          const found = updatedProposals.find((p) => p.value === answerValue);
          return found ? { uid_intern: found.uid_intern, value: found.value } : answer;
        })()
      : answer;
    setProposals(updatedProposals);
    setAnswer(newAnswer);
    onUpdateQuestion(index, { ...question, proposals: updatedProposals, answer: newAnswer });
  };

  const handleAnswerChange = (e) => {
    const selectedUidIntern = parseInt(e.target.value, 10);
    const selectedProposal = proposals.find(
      (p) => p.uid_intern === selectedUidIntern
    );
    if (selectedProposal) {
      const newAnswer = {
        uid_intern: selectedProposal.uid_intern,
        value: selectedProposal.value,
      };
      setAnswer(newAnswer);
      onUpdateQuestion(index, { ...question, answer: newAnswer });
    }
  };

  const handleReset = () => {
    const initial = initialQuestionRef.current;
    if (!initial) return;
    const origQuestion = initial.question ?? "";
    const origProposals = Array.isArray(initial.proposals) ? [...initial.proposals] : [];
    const origAnswer = initial.answer ? { ...initial.answer } : {};
    setQuestionText(origQuestion);
    setProposals(origProposals);
    setAnswer(origAnswer);
    setNewProposal("");
    onUpdateQuestion(index, {
      ...question,
      question: origQuestion,
      proposals: origProposals,
      answer: origAnswer,
    });
  };

  const answerOptions = proposals.sort((a, b) => a.uid_intern - b.uid_intern).map((p) => ({
    value: p.uid_intern,
    label: p.value || `${t("proposal-n", { ns: NS_ADMIN_CHAPTERS })}${p.uid_intern}`,
  }));

  const initial = initialQuestionRef.current;
  const hasQuestionChanged = initial
    ? !questionContentEqual(
        { question: questionText, proposals, answer },
        {
          question: initial.question ?? "",
          proposals: initial.proposals ?? [],
          answer: initial.answer ?? {},
        }
      )
    : false;

  /** L’icône reset est active seulement si les propositions ou la réponse ont changé (pas le texte de la question) */
  const hasProposalOrAnswerChanged = initial
    ? !proposalsAndAnswerEqual(
        { proposals, answer },
        { proposals: initial.proposals ?? [], answer: initial.answer ?? {} }
      )
    : false;

  const isValid = questionText?.trim() && proposals.length >= 2 && answer?.uid_intern;

  const questionTitle = `${t("question-n", { ns: NS_ADMIN_CHAPTERS })}${index + 1}${
    questionText ? ` : ${questionText.substring(0, 50)}${questionText.length > 50 ? "..." : ""}` : ""
  }`;

  const questionContent = (
    <>
      <FieldComponent
        label={t("question", { ns: NS_ADMIN_CHAPTERS })}
        value={questionText}
        name={`question_${index}`}
        type="multiline"
        onChange={handleQuestionChange}
        minRows={2}
        maxRows={4}
        fullWidth
        isAdmin
      />

      <Divider sx={{ borderColor: "var(--card-border)" }} />

      <Typography
        variant="subtitle2"
        sx={{ color: "var(--font-color)", fontWeight: 600 }}
      >
        {t("proposals", { ns: NS_ADMIN_CHAPTERS })}
      </Typography>

      {proposals.map((proposal, pIndex) => (
        <Grid
          key={`proposal-${index}-${pIndex}`}
          container
          alignItems="center"
          spacing={1}
          sx={{ width: "100%" }}
        >
          <Grid size="auto">
            <Stack direction="column" spacing={0}>
              <Box
                onClick={() => handleMoveProposalUp(pIndex)}
                sx={{
                  cursor: pIndex > 0 ? "pointer" : "default",
                  display: "flex",
                  color: pIndex > 0 ? "var(--warning)" : "var(--grey-light)",
                }}
              >
                <IconArrowUp width={18} height={18} />
              </Box>
              <Box
                onClick={() => handleMoveProposalDown(pIndex)}
                sx={{
                  cursor: pIndex < proposals.length - 1 ? "pointer" : "default",
                  display: "flex",
                  color: pIndex < proposals.length - 1 ? "var(--warning)" : "var(--grey-light)",
                }}
              >
                <IconArrowDown width={18} height={18} />
              </Box>
            </Stack>
          </Grid>
          <Grid size="grow">
            <FieldComponent
              label={`${t("proposal-n", { ns: NS_ADMIN_CHAPTERS })}${pIndex + 1}`}
              value={proposal.value || ""}
              name={`proposal_${index}_${pIndex}`}
              type="text"
              onChange={(e) => handleProposalChange(pIndex, e.target.value)}
              onClear={() => handleProposalChange(pIndex, "")}
              removable
              onRemove={() => handleRemoveProposal(pIndex)}
              fullWidth
              isAdmin
            />
          </Grid>
        </Grid>
      ))}

      <FieldComponent
        label={t("new-proposal", { ns: NS_ADMIN_CHAPTERS })}
        value={newProposal}
        name={`new_proposal_${index}`}
        type="text"
        onChange={(e) => setNewProposal(e.target.value)}
        onClear={() => setNewProposal("")}
        editable
        onSubmit={handleAddProposal}
        fullWidth
        isAdmin
      />

      <Divider sx={{ borderColor: "var(--card-border)" }} />

      <Typography
        variant="subtitle2"
        sx={{ color: "var(--font-color)", fontWeight: 600 }}
      >
        {t("answer", { ns: NS_ADMIN_CHAPTERS })}
      </Typography>

      <SelectComponentDark
        label={t("answer", { ns: NS_ADMIN_CHAPTERS })}
        value={answer?.uid_intern || ""}
        name={`answer_${index}`}
        onChange={handleAnswerChange}
        values={answerOptions}
        disabled={proposals.length === 0}
        fullWidth={false}
      />

      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={1}
        sx={{ pt: 1 }}
      >
        <IconButton
          onClick={handleReset}
          disabled={!hasProposalOrAnswerChanged}
          sx={{
            color: hasProposalOrAnswerChanged ? "var(--warning)" : "var(--grey-light)",
          }}
          title={t("reset", { ns: NS_BUTTONS })}
        >
          <Icon icon="mdi:restore" width={20} height={20} />
        </IconButton>
        <IconButton
          onClick={() => setConfirmRemoveOpen(true)}
          sx={{ color: "var(--error)" }}
          title={t("remove-question", { ns: NS_ADMIN_CHAPTERS })}
        >
          <Icon icon="mdi:delete-outline" width={20} height={20} />
        </IconButton>
      </Stack>

      <DialogConfirmAction
        open={confirmRemoveOpen}
        setOpen={setConfirmRemoveOpen}
        title={t("confirm-remove-question", { ns: NS_ADMIN_CHAPTERS })}
        labelConfirm={t("remove-question", { ns: NS_ADMIN_CHAPTERS })}
        labelCancel={t("cancel", { ns: NS_BUTTONS })}
        severity="error"
        actionCancel={() => setConfirmRemoveOpen(false)}
        actionConfirm={async () => {
          if (onConfirmRemoveQuestion) await onConfirmRemoveQuestion(index);
        }}
        isAdmin
      />
    </>
  );

  if (isCollapsed) {
    return (
      <AccordionComponent
        title={questionTitle}
        expanded={false}
        onChange={onExpand}
        isAdmin={true}
      >
        <Stack spacing={1} sx={{ p: 2 }}>
          {questionContent}
        </Stack>
      </AccordionComponent>
    );
  }

  return (
    <Stack
      spacing={1}
      sx={{
        p: 2,
        background: "var(--card-color)",
        borderRadius: 2,
        border: "1px solid var(--card-border)",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "var(--font-color)", fontWeight: 600 }}
        >
          {questionTitle}
        </Typography>
        {onCollapse && (
          <ButtonCancel
            label={t("collapse", { ns: NS_ADMIN_CHAPTERS })}
            isAdmin
            onClick={onCollapse}
          />
        )}
      </Stack>

      {questionContent}
    </Stack>
  );
}

/** Compare le contenu de deux questions (énoncé, propositions, réponse) sans les traductions */
function questionContentEqual(a, b) {
  if ((a?.question ?? "") !== (b?.question ?? "")) return false;
  const pa = a?.proposals ?? [];
  const pb = b?.proposals ?? [];
  if (pa.length !== pb.length) return false;
  for (let i = 0; i < pa.length; i++) {
    if ((pa[i]?.value ?? "") !== (pb[i]?.value ?? "")) return false;
    if ((pa[i]?.uid_intern ?? 0) !== (pb[i]?.uid_intern ?? 0)) return false;
  }
  if ((a?.answer?.uid_intern ?? null) !== (b?.answer?.uid_intern ?? null)) return false;
  if ((a?.answer?.value ?? "") !== (b?.answer?.value ?? "")) return false;
  return true;
}

/** Compare uniquement propositions et réponse (pour l’état actif de l’icône reset) */
function proposalsAndAnswerEqual(a, b) {
  const pa = a?.proposals ?? [];
  const pb = b?.proposals ?? [];
  if (pa.length !== pb.length) return false;
  for (let i = 0; i < pa.length; i++) {
    if ((pa[i]?.value ?? "") !== (pb[i]?.value ?? "")) return false;
    if ((pa[i]?.uid_intern ?? 0) !== (pb[i]?.uid_intern ?? 0)) return false;
  }
  if ((a?.answer?.uid_intern ?? null) !== (b?.answer?.uid_intern ?? null)) return false;
  if ((a?.answer?.value ?? "") !== (b?.answer?.value ?? "")) return false;
  return true;
}

export default function ChapterQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { uid: uidUser, uidLesson, uidChapter } = params;
  const { user } = useAuth();
  const { lesson, isLoading: isLoadingLesson, setUidLesson } = useLesson();
  const { chapter, isLoading: isLoadingChapter, setUidChapter } = useChapter();
  const { t } = useTranslation([
    NS_ADMIN_CHAPTERS,
    NS_BUTTONS,
    NS_DASHBOARD_MENU,
    ClassLesson.NS_COLLECTION,
    ClassLessonChapter.NS_COLLECTION,
  ]);

  const [questions, setQuestions] = useState([]);
  const [initialQuestions, setInitialQuestions] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /** Compare le contenu de deux questions (énoncé, propositions, réponse) sans les traductions */

  /** True si une nouvelle question a été ajoutée ou si le contenu d’une question a changé */
  const hasQuizChanged = useMemo(() => {
    if (initialQuestions.length === 0) {
      return questions.length > 0;
    }
    if (questions.length !== initialQuestions.length) return true;
    return questions.some((q, i) => !questionContentEqual(q, initialQuestions[i]));
  }, [questions, initialQuestions]);

  const isAuthorized = useMemo(
    () => user instanceof ClassUserDandela,
    [user]
  );

  useEffect(() => {
    if (uidLesson && !isLoadingLesson) setUidLesson(uidLesson);
  }, [uidLesson, isLoadingLesson, setUidLesson]);

  useEffect(() => {
    if (uidChapter) setUidChapter(uidChapter);
  }, [uidChapter, setUidChapter]);

  // Charger les questions existantes si le chapitre a déjà un quiz
  useEffect(() => {
    if (chapter?.quiz?.questions?.length > 0) {
      const existingQuestions = chapter.quiz.questions.map((q) => ({
        uid_intern: q.uid_intern,
        question: q.translate?.question || q.question || "",
        proposals: q.translate?.proposals || q.proposals || [],
        answer: q.translate?.answer || q.answer || {},
        translates: q.translates || [],
      }));
      setQuestions(existingQuestions);
      setInitialQuestions(JSON.parse(JSON.stringify(existingQuestions)));
    } else {
      setInitialQuestions([]);
    }
  }, [chapter]);

  const handleAddQuestion = () => {
    const newQuestion = {
      uid_intern: questions.length + 1,
      question: "",
      proposals: [
        { uid_intern: 1, value: "" },
        { uid_intern: 2, value: "" },
        { uid_intern: 3, value: "" },
        { uid_intern: 4, value: "" },
      ],
      answer: {},
      translates: [],
    };
    setQuestions([...questions, newQuestion]);
    setExpandedQuestion(questions.length);
  };

  const handleUpdateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updatedQuestion };
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    const updatedQuestions = newQuestions.map((q, i) => ({
      ...q,
      uid_intern: i + 1,
    }));
    setQuestions(updatedQuestions);
  };

  /** Enregistre le quiz (liste de questions) dans Firestore */
  const persistQuizToFirestore = async (questionsList) => {
    if (!chapter || !uidChapter || !uidLesson) return false;
    if (chapter.uid_lesson !== uidLesson) {
      chapter.update({ uid_lesson: uidLesson });
    }
    let finalQuestions = questionsList;
    if (questionsList.length > 0 && questionsList.some((q) => !q.translates || q.translates.length === 0)) {
      finalQuestions = await Promise.all(
        questionsList.map(async (q) => {
          if (q.translates && q.translates.length > 0) return q;
          const payload = {
            question: q.question,
            proposals: q.proposals,
            answer: q.answer,
          };
          const qs = encodeURIComponent(JSON.stringify(payload));
          const res = await fetch(
            `/api/test?lang=${defaultLanguage}&translations=${qs}`
          );
          if (!res.ok) return q;
          const result = await res.json();
          const langs = Object.keys(result);
          const translates = langs.map((lang) => {
            const data = result[lang] || {};
            return new ClassLessonChapterQuestionTranslation({
              lang,
              question: typeof data.question === "string" ? data.question : q.question || "",
              proposals: Array.isArray(data.proposals) ? data.proposals : q.proposals || [],
              answer: data.answer || q.answer || {},
            });
          });
          return { ...q, translates };
        })
      );
    }
    const questionObjects = finalQuestions.map((q) => {
      const questionObj = new ClassLessonChapterQuestion({
        uid_intern: q.uid_intern,
        question: q.question,
        proposals: q.proposals,
        answer: q.answer,
        translates: q.translates,
      });
      return questionObj.toJSON();
    });
    const quiz = new ClassLessonChapterQuiz({
      uid_intern: 1,
      uid_chapter: uidChapter,
      questions: questionObjects,
    });
    return chapter.updateFirestore({ quiz });
  };

  const handleRemoveQuestionAndSave = async (index) => {
    const newQuestions = questions.filter((_, i) => i !== index).map((q, i) => ({
      ...q,
      uid_intern: i + 1,
    }));
    setProcessing(true);
    try {
      const updated = await persistQuizToFirestore(newQuestions);
      if (updated) {
        setQuestions(newQuestions);
        setInitialQuestions(JSON.parse(JSON.stringify(newQuestions)));
        setSnackbar({
          open: true,
          message: t("success-update-quiz", { ns: NS_ADMIN_CHAPTERS }),
          severity: "success",
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: t("error-add-quiz", { ns: NS_ADMIN_CHAPTERS }),
        severity: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  const validate = () => {
    if (questions.length === 0) return false;
    for (const q of questions) {
      if (!q.question?.trim()) return false;
      if (!q.proposals || q.proposals.length < 2) return false;
      if (!q.answer?.uid_intern) return false;
    }
    return true;
  };

  const handleSaveQuiz = async () => {
    if (!chapter || !uidChapter || !uidLesson) return;
    // S'assurer que le chapitre a uid_lesson pour le chemin Firestore
    if (!chapter.uid_lesson && uidLesson) {
      chapter.update({ uid_lesson: uidLesson });
    }
    if (!validate()) {
      setSnackbar({
        open: true,
        message: t("error-add-quiz", { ns: NS_ADMIN_CHAPTERS }),
        severity: "error",
      });
      return;
    }

    setProcessing(true);
    try {
      // Traduire si pas encore fait
      let finalQuestions = questions;
      if (questions.some((q) => !q.translates || q.translates.length === 0)) {
        finalQuestions = await Promise.all(
          questions.map(async (q) => {
            if (q.translates && q.translates.length > 0) return q;

            const payload = {
              question: q.question,
              proposals: q.proposals,
              answer: q.answer,
            };
            const qs = encodeURIComponent(JSON.stringify(payload));
            const res = await fetch(
              `/api/test?lang=${defaultLanguage}&translations=${qs}`
            );
            if (!res.ok) return q;
            const result = await res.json();
            const langs = Object.keys(result);

            const translates = langs.map((lang) => {
              const data = result[lang] || {};
              return new ClassLessonChapterQuestionTranslation({
                lang,
                question:
                  typeof data.question === "string"
                    ? data.question
                    : q.question || "",
                proposals: Array.isArray(data.proposals)
                  ? data.proposals
                  : q.proposals || [],
                answer: data.answer || q.answer || {},
              });
            });

            return { ...q, translates };
          })
        );
      }

      // Créer les objets ClassLessonChapterQuestion
      const questionObjects = finalQuestions.map((q) => {
        const questionObj = new ClassLessonChapterQuestion({
          uid_intern: q.uid_intern,
          question: q.question,
          proposals: q.proposals,
          answer: q.answer,
          translates: q.translates,
        });
        return questionObj.toJSON();
      });

      // Créer le quiz
      const quiz = new ClassLessonChapterQuiz({
        uid_intern: 1,
        uid_chapter: uidChapter,
        questions: questionObjects,
      });

      // Mettre à jour le chapitre (passer l'instance pour que le converter Firestore fonctionne)
      const updated = await chapter.updateFirestore({ quiz });
      console.log("UPDATED", updated)

      if (updated) {
        setSnackbar({
          open: true,
          message: t("success-added-quiz", { ns: NS_ADMIN_CHAPTERS }),
          severity: "success",
        });
        setConfirmOpen(false);
        setInitialQuestions(JSON.parse(JSON.stringify(questions)));
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: t("error-add-quiz", { ns: NS_ADMIN_CHAPTERS }),
        severity: "error",
      });
      setConfirmOpen(false);
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };

  const lessonTitle = lesson?.title ?? lesson?.translate?.title ?? "";
  const chapterTitle = chapter?.translate?.title ?? chapter?.title ?? "";
  const loading = Boolean(uidChapter && isLoadingChapter);

  if (isLoadingLesson || !lesson) {
    return (
      <AdminPageWrapper
        titles={[{ name: t("lessons", { ns: NS_DASHBOARD_MENU }) }]}
        isAuthorized={isAuthorized}
        icon={<IconLessons width={22} height={22} />}
      >
        <Stack alignItems="center" py={4}>
          <CircularProgress color="warning" />
        </Stack>
      </AdminPageWrapper>
    );
  }

  if (loading) {
    return (
      <AdminPageWrapper
        titles={[
          {
            name: t("lessons", { ns: NS_DASHBOARD_MENU }),
            url: PAGE_ADMIN_LESSONS(uidUser),
          },
          { name: lessonTitle, url: PAGE_ADMIN_ONE_LESSON(uidUser, uidLesson) },
          {
            name: t("chapters", { ns: NS_DASHBOARD_MENU }),
            url: PAGE_ADMIN_CHAPTERS(uidUser, uidLesson),
          },
          { name: t("quiz-button", { ns: NS_ADMIN_CHAPTERS }) },
        ]}
        isAuthorized={isAuthorized}
        icon={<IconLessons width={22} height={22} />}
      >
        <Stack alignItems="center" py={4}>
          <CircularProgress color="warning" />
        </Stack>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper
      titles={[
        {
          name: t("lessons", { ns: NS_DASHBOARD_MENU }),
          url: PAGE_ADMIN_LESSONS(uidUser),
        },
        { name: lessonTitle, url: PAGE_ADMIN_ONE_LESSON(uidUser, uidLesson) },
        {
          name: t("chapters", { ns: NS_DASHBOARD_MENU }),
          url: PAGE_ADMIN_CHAPTERS(uidUser, uidLesson),
        },
        ...(chapterTitle
          ? [
              {
                name: chapterTitle,
                url: PAGE_ADMIN_ONE_CHAPTER(uidUser, uidLesson, uidChapter),
              },
            ]
          : []),
        { name: t("quiz-button", { ns: NS_ADMIN_CHAPTERS }) },
      ]}
      isAuthorized={isAuthorized}
      icon={<IconLessons width={22} height={22} />}
    >
      <Stack spacing={1} sx={{ width: "100%", maxWidth: 1024 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Link
            href={PAGE_ADMIN_ONE_CHAPTER(uidUser, uidLesson, uidChapter)}
            style={{ textDecoration: "none" }}
          >
            <ButtonCancel label={t("back", { ns: NS_BUTTONS })} isAdmin />
          </Link>
          <ButtonConfirm
            label={t("add-question", { ns: NS_ADMIN_CHAPTERS })}
            isAdmin
            icon={<Icon icon="mdi:plus" width={18} height={18} />}
            onClick={handleAddQuestion}
          />
          <ButtonConfirm
            label={
              chapter?.quiz
                ? t("update-quiz", { ns: NS_ADMIN_CHAPTERS })
                : t("add-quiz", { ns: NS_ADMIN_CHAPTERS })
            }
            isAdmin
            loading={processing}
            disabled={!validate() || processing || !hasQuizChanged}
            onClick={() => setConfirmOpen(true)}
          />
        </Stack>

        <Stack
          spacing={2}
          sx={{
            p: 2,
            background: "var(--card-color)",
            borderRadius: 2,
            border: "1px solid var(--card-border)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "var(--font-color)", fontWeight: 600 }}
          >
            {chapter?.quiz
              ? t("edit-quiz", { ns: NS_ADMIN_CHAPTERS })
              : t("create-quiz-title", { ns: NS_ADMIN_CHAPTERS })}
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--font-color)" }}>
            {t("create-quiz-placeholder", { ns: NS_ADMIN_CHAPTERS })}
          </Typography>

          {questions.length === 0 && (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                border: "2px dashed var(--card-border)",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{ color: "var(--grey)", mb: 2 }}
              >
                {t("no-quiz", { ns: NS_ADMIN_CHAPTERS })}
              </Typography>
              <ButtonConfirm
                label={t("add-question", { ns: NS_ADMIN_CHAPTERS })}
                isAdmin
                icon={<Icon icon="mdi:plus" width={18} height={18} />}
                onClick={handleAddQuestion}
              />
            </Box>
          )}
        </Stack>

        {questions.map((question, index) => {
          const isValid = question.question?.trim() && 
                         question.proposals?.length >= 2 && 
                         question.answer?.uid_intern;
          const isCollapsed = isValid && expandedQuestion !== index;
          
          return (
            <QuestionComponent
              key={`question-${index}`}
              question={question}
              index={index}
              onUpdateQuestion={handleUpdateQuestion}
              onRemoveQuestion={handleRemoveQuestion}
              onConfirmRemoveQuestion={handleRemoveQuestionAndSave}
              isCollapsed={isCollapsed}
              onExpand={() => setExpandedQuestion(index)}
              onCollapse={() => setExpandedQuestion(null)}
              t={t}
            />
          );
        })}
      </Stack>

      <DialogConfirmAction
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={
          chapter?.quiz
            ? t("confirm-update-quiz", { ns: NS_ADMIN_CHAPTERS })
            : t("confirm-add-quiz", { ns: NS_ADMIN_CHAPTERS })
        }
        labelConfirm={
          chapter?.quiz
            ? t("update-quiz", { ns: NS_ADMIN_CHAPTERS })
            : t("add-quiz", { ns: NS_ADMIN_CHAPTERS })
        }
        labelCancel={t("cancel", { ns: NS_BUTTONS })}
        severity="warning"
        actionCancel={() => setConfirmOpen(false)}
        actionConfirm={handleSaveQuiz}
        isAdmin
      />

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        slots={{ transition: SlideTransition }}
      >
        <Alert
          variant="filled"
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminPageWrapper>
  );
}
