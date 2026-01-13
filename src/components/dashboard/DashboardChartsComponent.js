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

export default function DashboardChartsComponent() {
  const [view, setView] = useState("line");

  return (
    <div style={{ padding: 24 }}>
      <h1>📊 Résultats & progression</h1>
      <p>Visualise ton évolution et tes performances par cours.</p>

      {/* Sélecteur de vue */}
      <div style={{ margin: "16px 0", display: "flex", gap: 8 }}>
        <button onClick={() => setView("line")}>📈 Évolution</button>
        <button onClick={() => setView("bar")}>📊 Comparaison</button>
        <button onClick={() => setView("list")}>📋 Liste</button>
      </div>

      {view === "line" && <LineChartView />}
      {view === "bar" && <BarChartView />}
      {view === "list" && <ListView />}
    </div>
  );
}
function LineChartView() {
  const labels = Array.from(
    new Set(
      coursesResults.flatMap(course =>
        course.history.map(h => h.date)
      )
    )
  );

  const data = {
    labels,
    datasets: coursesResults.map(course => ({
      label: course.title,
      data: labels.map(label => {
        const point = course.history.find(h => h.date === label);
        return point ? point.score : null;
      }),
      tension: 0.4,
    })),
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Progression (%)",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}
function BarChartView() {
  const data = {
    labels: coursesResults.map(c => c.title),
    datasets: [
      {
        label: "Progression (%)",
        data: coursesResults.map(c => c.progress),
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 100,
      },
    },
  };

  return <Bar data={data} options={options} />;
}
function ListView() {
  return (
    <div style={{ marginTop: 16 }}>
      {coursesResults.map(course => (
        <div
          key={course.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <h3>{course.title}</h3>
          <p>Niveau atteint : {course.level}</p>
          <p>Progression : {course.progress}%</p>
          <progress value={course.progress} max={100} />
        </div>
      ))}
    </div>
  );
}
