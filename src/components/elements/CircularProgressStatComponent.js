import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import { ClassUserStat } from '@/classes/users/ClassUserStat';
import { formatChrono } from '@/contexts/functions';

function CircularProgressWithLabel({stat=null,...props}) {
  const STATUS_CONFIG = ClassUserStat.STATUS_CONFIG || [];
  const colorStat = STATUS_CONFIG[stat?.status];
  const score = stat ? stat.score : 0;
  const questions_length = stat ? stat.answers?.length : 0;
  const average = stat ? (stat.score / stat.answers?.length) * 100 : 0;
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress size={"7.5rem"} enableTrackSlot variant="determinate" value={average} {...props} sx={{color:colorStat?.color_icon || 'red', fontSize:'30px'}} />
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
          width:'100%',
          height:'100%',
        }}
      >
        <Typography
          variant="caption"
          fontWeight={600}
          //component="div"
          sx={{ color: 'var(--font-color)',fontSize:'0.85rem' }}
        >
          {`${score}/${questions_length}`}
        </Typography>
        <Typography
          variant="caption"
          //component="div"
          sx={{ color: 'var(--font-color)',fontSize:'0.75rem' }}
        >
          {`${average}%`}
        </Typography>
                <Typography
          variant="caption"
          //component="div"
          sx={{fontSize:'0.75rem' }}
        >
          {`${formatChrono(stat?.duration || 0)}`}
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

export default function CircularProgressStatComponent({progress=0, stat=null}) {
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

  return <CircularProgressWithLabel value={progress} stat={stat} />;
}
