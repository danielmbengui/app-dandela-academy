import * as React from 'react';
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

const TypographyComponent = ({ title = "", value = "" }) => {
  return (<Stack direction={'row'} spacing={1.5} alignItems={'center'} sx={{ background: '' }}>
    <Typography  fontWeight={'600'}>{title}</Typography>
    <Typography sx={{lineHeight:1.15}} noWrap>{value}</Typography>
  </Stack>)
}

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', color:'white' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: 'rotate(90deg)',
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, .05)',
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function AccordionComponent({school=null,room=null}) {
  const {t} = useTranslation([ClassRoom.NS_COLLECTION, NS_DASHBOARD_COMPUTERS])
  const {theme} = useThemeMode();
  const {blueDark} = theme.palette;
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Stack spacing={0.5}>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{borderRadius:'5px',}}>
        <AccordionSummary sx={{background:blueDark.main, color:ClassColor.WHITE, borderRadius:'5px',
           minHeight: 35,                 // hauteur fermée
      '&.Mui-expanded': {
        minHeight: 35,               // hauteur ouverte
      },
      '& .MuiAccordionSummary-content': {
        margin: 0,                   // enlève le gros padding vertical
      },
      '& .MuiAccordionSummary-content.Mui-expanded': {
        margin: 0,
      },
        }} aria-controls="panel1d-content" id="panel1d-header">
          <Typography component="span">{t('room_infos', {ns:NS_DASHBOARD_COMPUTERS})}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{border:'none'}}>
          <Stack sx={{width:'100%', lineHeight:1.1}} spacing={1}>
              <TypographyComponent title={t('name')} value={room?.name || ''} />
            <TypographyComponent title={t('uid_intern')} value={`#${room?.uid_intern || ''}`} />
            <TypographyComponent title={t('floor')} value={room?.floor || ''} />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
