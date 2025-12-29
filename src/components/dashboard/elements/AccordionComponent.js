import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { AccordionActions, Stack } from '@mui/material';
import { useThemeMode } from '@/contexts/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { NS_DASHBOARD_COMPUTERS } from '@/contexts/i18n/settings';
import { ClassRoom } from '@/classes/ClassRoom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ButtonConfirm from './ButtonConfirm';

const TypographyComponent = ({ title = "", value = "" }) => {
  return (<Stack direction={'row'} spacing={1.5} alignItems={'center'} sx={{ background: '' }}>
    <Typography fontWeight={'600'}>{title}</Typography>
    <Typography sx={{ lineHeight: 1.15 }} noWrap>{value}</Typography>
  </Stack>)
}

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square={true} {...props} />
))(({ theme }) => ({
  //border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    // borderBottom: 0,
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
  backgroundColor: 'var(--grey-light)',
  backgroundColor: 'none',
  border: '0.1px solid var(--card-border)',
  flexDirection: 'row',
  color: "var(--font-color)",
  borderRadius: '5px',
  maxWidth: '100%',
  //  borderTopLeftRadius: '5px',
  py: 1,
  minHeight: 25,                 // hauteur fermée
  maxHeight: 60,                 // hauteur fermée
  '&.Mui-expanded': {
    minHeight: 30,               // hauteur ouverte
    //background:'yellow',
    //backgroundColor: 'var(--grey-hyper-light)',
    borderBottomLeftRadius: '0px',
    borderBottomRightRadius: '0px',
  },
  '& .MuiAccordionSummary-content': {
    //margin: 0,                   // enlève le gros padding vertical
  },


  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
  {
    //transform: 'rotate(90deg)',
    color: 'var(--primary)'
  },

  [`& .${accordionSummaryClasses.content}`]: {
    //marginLeft: theme.spacing(1),
    borderRadius: '0px',
  },

  ...theme.applyStyles('dark', {
    //backgroundColor: 'rgba(255, 255, 255, .05)',
  }),
}));

const AccordionDetails = styled((props) => (
  <MuiAccordionDetails
    sx={{
      //background: 'red',
      border: '0.1px solid var(--card-border)',
      borderTop: 'none',
      background: '',
p:0,
width:'100%',
      borderBottomLeftRadius: '5px',
      borderBottomRightRadius: '5px',
      '&.Mui-expanded': {
        minHeight: 30,               // hauteur ouverte
        //background:'yellow',
              width:'100%',
     // p: '10px',
        borderBottomLeftRadius: '5px',
        borderBottomRightRadius: '5px',
      },
    }}
    {...props}
  />
))(({ theme }) => ({

  //padding: theme.spacing(2),
  //borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function AccordionComponent({ children, title = "", expanded = false }) {
  const { t } = useTranslation([ClassRoom.NS_COLLECTION, NS_DASHBOARD_COMPUTERS])
  const { theme } = useThemeMode();
  const { blueDark } = theme.palette;
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleChange = (panel) => (_, newExpanded) => {
    setIsExpanded(newExpanded ? panel : false);
  };
  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded])

  return (<Accordion
    expanded={isExpanded}
    onChange={handleChange(!isExpanded)}
    sx={{ borderRadius: '5px', }}>
    <AccordionSummary sx={{
      //background:'red', 
      //color: ClassColor.WHITE,
      // borderRadiusTopLeft: '5px',

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
