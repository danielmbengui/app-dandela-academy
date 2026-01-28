"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { IconBarChart, IconLineChart, IconList } from "@/assets/icons/IconsComponent";
import { useTranslation } from "react-i18next";
import { ClassUserStat } from "@/classes/users/ClassUserStat";
import StatsListComponent from "./StatsListComponent";
import StatsLineChart from "./StatsLineChart";
import StatsBarChart from "./StatsBarChart";
import { useStat } from "@/contexts/StatProvider";
import { useLesson } from "@/contexts/LessonProvider";
import { useUserDevice } from "@/contexts/UserDeviceProvider";
import SelectComponentDark from "../elements/SelectComponentDark";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

/* ---------------- MOCK DATA ---------------- */

const coursesResults = [
  {
    id: "excel",
    title: "Excel – Fondamentaux",
    history: [
      { date: "01/01", score: 20 },
      { date: "10/01", score: 45 },
      { date: "20/01", score: 70 },
    ],
    progress: 70,
    level: "Intermédiaire",
  },
  {
    id: "it_intro",
    title: "Introduction à l’informatique",
    history: [
      { date: "05/01", score: 30 },
      { date: "18/01", score: 60 },
    ],
    progress: 60,
    level: "Débutant",
  },
];

/* ---------------- PAGE ---------------- */
const VIEW_LIST = "view.list";
const VIEW_EVOLUTION = "view.evolution";
const VIEW_COMPARE = "view.compare";
const VIEW_MODE_SCORE = "view.score";
const VIEW_MODE_AVERAGE = "view.average";
export default function StatsChartsComponent({
  listComponent = <></>,
  listAverageComponent = <></>,
  showList = true,
  showListAverage = true,
  evolutionComponent = <></>,
  evolutionAverageComponent = <></>,
  showEvolution = true,
  showEvolutionAverage = true,
  compareComponent = <></>,
  compareAverageComponent = <></>,
  showCompare = true,
  showCompareAverage = true,
}) {
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  const [view, setView] = useState(VIEW_LIST);
  const [viewMode, setViewMode] = useState(VIEW_MODE_SCORE);
  const { isMobile } = useUserDevice();
  return (
    <Stack spacing={3}>
      <Stack direction={'row'} spacing={2} alignItems={'center'} flexWrap="wrap">
        <ToggleButtonGroup
          orientation={isMobile ? 'vertical' : 'horizontal'}
          exclusive
          value={view}
          onChange={(_, v) => v && setView(v)}
          size="small"
          sx={{
            gap: 0.5,
            backgroundColor: "var(--primary-shadow-xs)",
            padding: 0.5,
            borderRadius: 2.5,
            border: '1px solid var(--card-border)',

            "& .MuiToggleButton-root": {
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              border: "1px solid transparent",
              color: "var(--primary)",
              paddingX: 2.5,
              paddingY: 1,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

              "&:hover": {
                backgroundColor: "var(--primary-shadow-sm)",
                color: "var(--primary)",
              },

              "&.Mui-selected": {
                backgroundColor: "var(--primary)",
                color: "var(--card-color)",
                border: "1px solid var(--primary)",
                boxShadow: '0 2px 8px var(--primary-shadow-sm)',

                "&:hover": {
                  backgroundColor: "var(--primary)",
                  color: "var(--card-color)",
                },
              },
            },
          }}
        >
          {
            (showList || showListAverage) && <ToggleButton value={VIEW_LIST}>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <IconList /> <span>{t(VIEW_LIST)}</span>
            </Stack>
          </ToggleButton>
          }
          {
            (showEvolution || showEvolutionAverage) && <ToggleButton value={VIEW_EVOLUTION}>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <IconLineChart /> <span>{t(VIEW_EVOLUTION)}</span>
            </Stack>
          </ToggleButton>
          }
          {
            (showCompare || showCompareAverage) && <ToggleButton value={VIEW_COMPARE}>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <IconBarChart /> <span>{t(VIEW_COMPARE)}</span>
            </Stack>
          </ToggleButton>
          }
        </ToggleButtonGroup>
        <SelectComponentDark
          value={viewMode}
          values={[{ id: VIEW_MODE_SCORE, value: t('score') }, { id: VIEW_MODE_AVERAGE, value: t('average') }]}
          onChange={(e) => {
            const { value } = e.target;
            setViewMode(value);
          }}
          hasNull={false}
        />
      </Stack>

      <Stack alignItems={'start'} sx={{ minHeight: '60vh', width: '100%' }}>
        {
          view === VIEW_LIST && <>
            {
              viewMode === VIEW_MODE_SCORE && <>
                {
                  showList && listComponent
                }
                {
                  !showList && <NoViewComponent />
                }
              </>
            }
            {
              viewMode === VIEW_MODE_AVERAGE && <>
                {
                  showListAverage && listAverageComponent
                }
                {
                  !showListAverage && <NoViewComponent />
                }
              </>
            }
          </>
        }
        {view === VIEW_EVOLUTION && <>
          {
            viewMode === VIEW_MODE_SCORE && <>
              {
                showEvolution && evolutionComponent
              }
              {
                !showEvolution && <NoViewComponent />
              }
            </>
          }
          {
            viewMode === VIEW_MODE_AVERAGE && <>
              {
                showEvolutionAverage && evolutionAverageComponent
              }
              {
                !showEvolutionAverage && <NoViewComponent />
              }
            </>
          }
        </>}
        {view === VIEW_COMPARE && showCompare && <>
          {
            viewMode === VIEW_MODE_SCORE && <>
              {
                compareComponent && compareComponent
              }
              {
                !compareComponent && <NoViewComponent />
              }
            </>
          }
          {
            viewMode === VIEW_MODE_AVERAGE && <>
              {
                showCompareAverage && compareAverageComponent
              }
              {
                !showCompareAverage && <NoViewComponent />
              }
            </>
          }
        </>}
      </Stack>
    </Stack>
  );
}
function NoViewComponent() {
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid var(--card-border)',
        bgcolor: 'var(--card-color)',
        width: '100%',
      }}
    >
      <Typography sx={{ color: 'var(--grey-light)' }}>{t('view.not-enabled')}</Typography>
    </Paper>
  );
}