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

const Accordion = styled((props) => (
  <MuiAccordion disabled={props.disabled} disableGutters elevation={0} square={true} {...props} />
))(({ theme }) => ({

  //border: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    // borderBottom: 0,
    //borderTop: 'none',
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => {
  const propsParam = { ...props };
  propsParam.isAdmin = null;
  delete propsParam.isAdmin;
  return (
    <MuiAccordionSummary
      //expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', color: 'white' }} />}
      expandIcon={<ExpandMoreIcon />}
      {...propsParam}
    />
  )
})(({ theme, isAdmin, props }) => {
  return ({

    backgroundColor: 'rgba(0, 0, 0, .03)',
    backgroundColor: 'var(--grey-light)',
    background: 'transparent',
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
      borderColor: 'var(--card-border)',
      borderBottomLeftRadius: '0px',
      borderBottomRightRadius: '0px',
      borderRadius: '5px',
    },
    '& .MuiAccordionSummary-content': {
      //margin: 0,                   // enlève le gros padding vertical
    },


    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      //transform: 'rotate(90deg)',
      color: isAdmin ? 'var(--admin)' : 'var(--primary)'
    },

    [`& .${accordionSummaryClasses.content}`]: {
      //marginLeft: theme.spacing(1),
      borderRadius: '0px',
    },

    ...theme.applyStyles('dark', {
      //backgroundColor: 'rgba(255, 255, 255, .05)',
    }),
  })
});

const AccordionDetails = styled((props) => (
  <MuiAccordionDetails
    sx={{
      //background: 'red',
      border: '0.1px solid var(--card-border)',
      borderTop: 'none',
      background: '',
      p: 0,
      width: '100%',
      borderBottomLeftRadius: '5px',
      borderBottomRightRadius: '5px',
      '&.Mui-expanded': {
        minHeight: 30,               // hauteur ouverte
        //background:'yellow',
        width: '100%',
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

export default function AccordionComponent({ children, title = "", expanded = false, onChange = null, disabled = false, isAdmin = false }) {
  const { theme } = useThemeMode();
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleChange = (panel) => (_, newExpanded) => {
    setIsExpanded(newExpanded ? panel : false);
    if (onChange) {
      onChange();
    }
  };
  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded])

  return (<Accordion
    expanded={isExpanded}
    disabled={disabled}

    onChange={handleChange(!isExpanded)}
    sx={{ borderRadius: '5px', }}>
    <AccordionSummary
      title={title}
      isAdmin={isAdmin}
      sx={{
        //background:'red', 
        //color: ClassColor.WHITE,
        // borderRadiusTopLeft: '5px',

      }}
      aria-controls="panel1d-content" id="panel1d-header">
      {title}
    </AccordionSummary>
    <AccordionDetails>
      {children}
    </AccordionDetails>

  </Accordion>);
}
