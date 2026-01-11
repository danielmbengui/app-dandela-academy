import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import { ClassUserStat } from '@/classes/users/ClassUserStat';
import { formatChrono } from '@/contexts/functions';

function CircularProgressWithLabel({ stat = null, average = 0,
  score = 0,
  questions = 0,
  percent = 0,
  duration = 0,
  size = "medium",
  status = "average",
  ...props }) {
  const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
  const colorStat = STATUS_CONFIG[status] || {
    label: "max", // "Inscriptions ouvertes",
    color: "var(--gold-dark)",
    border: "var(--gold)",
    background: "var(--gold-shadow-xs)",
    background_icon: "var(--gold-shadow)",
    background_bubble: "var(--gold-shadow-xs)",
    color_icon: "var(--purple)",
    border_icon: "var(--gold-shadow)",
    background_bar: "var(--gold)",
    glow: "var(--gold-shadow)",
  };

  const sizeCircular = size === 'small' ? '5rem' : size === 'medium' ? '7.5rem' : size === 'large' ? '10rem' : '7.5rem';
  const sizeScore = size === 'small' ? '0.7rem' : size === 'medium' ? '0.85rem' : size === 'large' ? '1rem' : '0.85rem';
  const sizePercent = size === 'small' ? '0.6rem' : size === 'medium' ? '0.75rem' : size === 'large' ? '0.9rem' : '0.75rem';
  const sizeDuration = size === 'small' ? '0.6rem' : size === 'medium' ? '0.75rem' : size === 'large' ? '0.9rem' : '0.75rem';
  //const score = stat ? stat.score : 0;
  //const questions = stat ? stat.answers?.length : 0;
  //const average = stat ? (stat.score / stat.answers?.length) * 100 : 0;
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress size={sizeCircular} enableTrackSlot variant="determinate" value={percent} 
      sx={{ color: colorStat?.color_icon || 'red' }} />
      <Stack
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // background:'yellow',
          width: '100%',
          height: '100%',
        }}
      >
        <Typography
          variant="caption"
          fontWeight={600}
          //component="div"
          sx={{ color: 'var(--font-color)', fontSize: sizeScore }}
        >
          {`${score}/${questions}`}
        </Typography>
        <Typography
          variant="caption"
          //component="div"
          sx={{ color: 'var(--font-color)', fontSize: sizePercent }}
        >
          {`${percent.toFixed(2)}%`}
        </Typography>
        <Typography
          variant="caption"
          //component="div"
          sx={{ fontSize: sizeDuration }}
        >
          {`${formatChrono(duration || 0)}`}
        </Typography>
      </Stack>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

export default function CircularProgressStatComponent({ progress = 0, stat = null, average = 0,
  score = 0,
  questions = 0,
  percent = 0,
  duration = 0,
  size = "medium",
  status = "average",
}) {
  //const [progress, setProgress] = React.useState(10);

  useEffect(() => {
    console.log("Stat CircularProgressStatComponent", stat)
    /*
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
    */
  }, [stat]);

  return <CircularProgressWithLabel value={progress} stat={stat} average={average}
    score={score}
    questions={questions}
    percent={percent}
    duration={duration}
    size={size}
    status={status}
  />;
}
