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
  <MuiAccordion disabled={props.disabled} disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  '&::before': { display: 'none' },
  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
  '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
}));

const AccordionSummary = styled((props) => {
  const { isAdmin, ...rest } = props;
  return (
    <MuiAccordionSummary
      expandIcon={<ExpandMoreIcon sx={{ transition: 'transform 0.25s ease' }} />}
      {...rest}
    />
  );
})(({ theme, isAdmin }) => ({
  background: 'transparent',
  border: '1px solid var(--card-border)',
  borderRadius: '10px',
  color: 'var(--font-color)',
  flexDirection: 'row',
  maxWidth: '100%',
  py: 1,
  minHeight: 44,
  maxHeight: 56,
  fontWeight: 500,
  transition: 'background 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    background: 'rgba(0,0,0,0.02)',
    borderColor: 'var(--primary)',
  },
  '&.Mui-expanded': {
    minHeight: 44,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: 'var(--card-border)',
  },
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
    color: isAdmin ? 'var(--admin)' : 'var(--primary)',
    transform: 'rotate(180deg)',
  },
  [`& .${accordionSummaryClasses.content}`]: {
    borderRadius: 0,
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)({
  border: '1px solid var(--card-border)',
  borderTop: 'none',
  borderRadius: '0 0 10px 10px',
  p: 0,
  width: '100%',
  transition: 'background 0.2s ease',
});

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

  return (
    <Accordion
      expanded={isExpanded}
      disabled={disabled}
      onChange={handleChange(!isExpanded)}
      sx={{ borderRadius: '10px' }}
    >
      <AccordionSummary title={title} isAdmin={isAdmin} aria-controls="panel1d-content" id="panel1d-header">
        {title}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
