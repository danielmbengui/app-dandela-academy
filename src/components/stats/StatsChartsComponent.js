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
  evolutionComponent = <></>,
  evolutionAverageComponent = <></>,
  showEvolution = true,
  showEvolutionAverage = true,
  compareComponent = <></>,
  compareAverageComponent = <></>,
  showCompare = true,
}) {
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  const [view, setView] = useState(VIEW_LIST);
  const [viewMode, setViewMode] = useState(VIEW_MODE_SCORE);
  const { isMobile } = useUserDevice();
  return (
    <div style={{ padding: 0 }}>
      <Stack direction={'row'} spacing={1} alignItems={'center'}>
        <ToggleButtonGroup
          orientation={isMobile ? 'vertical' : 'horizontal'}
          exclusive
          value={view}
          onChange={(_, v) => v && setView(v)}
          size="small"
          sx={{
            gap: 1,
            backgroundColor: "var(--primary-shadow)",
            padding: 0.5,
            borderRadius: 10,

            "& .MuiToggleButton-root": {
              /* ÉTAT PAR DÉFAUT */
              borderRadius: 10,
              fontWeight: 600,
              textTransform: "none",
              border: "0.1px solid transparent",
              color: "var(--primary)",
              paddingX: 2,
              transition: "all 0.2s ease",

              "&:hover": {
                backgroundColor: "var(--primary)",
                color: "var(--card-color)",
              },

              "&.Mui-selected": {
                backgroundColor: "var(--primary)",
                color: "var(--card-color)",
                border: "0.1px solid var(--primary)",
                //fontWeight: 700,

                "&:hover": {
                  backgroundColor: "var(--primary)",
                  color: "var(--card-color)",
                },
              },
              "&.Mui-selected[value='correct']": {
                //backgroundColor: "var(--success)",
                //color: "var(--card-color)",
                //border: "0.1px solid var(--success)",
              },
              "&.Mui-selected[value='wrong']": {
                //backgroundColor: "var(--error)",
                //color: "var(--card-color)",
                //border: "0.1px solid var(--error)",
              },
            },
          }}
        >
          <ToggleButton value={VIEW_LIST}>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <IconList /> <span>{t(VIEW_LIST)}</span>
            </Stack>
          </ToggleButton>
          <ToggleButton value={VIEW_EVOLUTION}>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <IconLineChart /> <span>{t(VIEW_EVOLUTION)}</span>
            </Stack>
          </ToggleButton>
          <ToggleButton value={VIEW_COMPARE}>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <IconBarChart /> <span>{t(VIEW_COMPARE)}</span>
            </Stack>
          </ToggleButton>
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

      <Stack alignItems={'start'} sx={{ px: 1.5, py: 1, height: { xs: '80vh', sm: '100%' }, minHeight: '80vh', width: '100%' }}>
        {
          view === VIEW_LIST && showList && <>
            {
              viewMode === VIEW_MODE_SCORE && listComponent
            }
            {
              viewMode === VIEW_MODE_AVERAGE && listAverageComponent
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
            viewMode === VIEW_MODE_SCORE && compareComponent
          }
          {
            viewMode === VIEW_MODE_AVERAGE && compareAverageComponent
          }
        </>}
      </Stack>
    </div>
  );
}
function NoViewComponent() {
  const { t } = useTranslation([ClassUserStat.NS_COLLECTION]);
  return(<Stack sx={{p:1.5, my:1, border:'0.1px solid var(--card-border)'}} alignItems={'start'}>
    <Typography>{t('view.not-enabled')}</Typography>
  </Stack>)
}