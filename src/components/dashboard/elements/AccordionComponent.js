import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { useThemeMode } from '@/contexts/ThemeProvider';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ClassColor } from '@/classes/ClassColor';
import { useTranslation } from 'react-i18next';
import { NS_DASHBOARD_COMPUTERS } from '@/contexts/i18n/settings';
import { ClassRoom } from '@/classes/ClassRoom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TypographyComponent = ({ title = "", value = "" }) => {
  return (<Stack direction={'row'} spacing={1.5} alignItems={'center'} sx={{ background: '' }}>
    <Typography fontWeight={'600'}>{title}</Typography>
    <Typography sx={{ lineHeight: 1.15 }} noWrap>{value}</Typography>
  </Stack>)
}

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  //border: `1px solid red`,
  '&:not(:last-child)': {
    //borderBottom: 0,
  },
  '&::before': {
    // display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    //expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', color: 'white' }} />}
    expandIcon={<ExpandMoreIcon />}
    {...props}
  />
))(({ theme }) => ({

  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row',
  color: 'black',
  /*
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
  {
    transform: 'rotate(90deg)',
  },
  */
  [`& .${accordionSummaryClasses.content}`]: {
    //marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, .05)',
  }),
}));

const AccordionDetails = styled((props) => (
  <MuiAccordionDetails
    sx={{
      background: 'red',
      p: 0,
    }}
    {...props}
  />
))(({ theme }) => ({

  //padding: theme.spacing(2),
  //borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function AccordionComponent({ children, mode = "", title = "", expanded = false }) {
  const { t } = useTranslation([ClassRoom.NS_COLLECTION, NS_DASHBOARD_COMPUTERS])
  const { theme } = useThemeMode();
  const { blueDark } = theme.palette;
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleChange = (panel) => (_, newExpanded) => {
    setIsExpanded(newExpanded ? panel : false);
  };

  return (<Accordion 
    expanded={isExpanded} 
  onChange={handleChange(!isExpanded)} 
  sx={{ borderRadius: '5px',}}>
    <AccordionSummary sx={{
      //background:'red', 
      //color: ClassColor.WHITE,
      borderRadius: '5px',
      minHeight: 30,                 // hauteur fermée
      '&.Mui-expanded': {
        minHeight: 30,               // hauteur ouverte
      },
      '& .MuiAccordionSummary-content': {
        //margin: 0,                   // enlève le gros padding vertical
      },
      '& .MuiAccordionSummary-content.Mui-expanded': {
        //margin: 0,
      },
    }} aria-controls="panel1d-content" id="panel1d-header">
      <Typography component="span">
        {title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      {children}
    </AccordionDetails>
  </Accordion>);
}
