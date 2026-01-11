import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel({
    score = 0,
  questions = 0,
  percent = 0,
  duration = 0,
  size = "medium",
  status = "average",
  ...props
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={percent}
          sx={{
            height: 10,
            borderRadius: 999,
            //bgcolor: colorBest?.background_bubble,
            //border: `0.1px solid ${colorBest?.border}`,
            "& .MuiLinearProgress-bar": {
              // borderRadius: 999,
              //bgcolor: colorBest?.background_bar,
            },
          }} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`${score}/${questions}`}
        </Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function LinearProgressCountScore({
    score = 0,
  questions = 0,
  percent = 0,
  duration = 0,
  size = "medium",
  status = "average",
}) {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      //setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress}
      score={score}
    questions={questions}
    percent={percent}
    duration={duration}
    size={size}
    status={status}
      />
    </Box>
  );
}
