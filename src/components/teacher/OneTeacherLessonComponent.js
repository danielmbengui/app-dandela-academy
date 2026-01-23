import React, { useMemo, useState } from "react";
import { IconUserCertified, IconVisible } from "@/assets/icons/IconsComponent";
import { ClassLesson, ClassLessonTeacher } from "@/classes/ClassLesson";
import { NS_DASHBOARD_MENU, NS_DAYS, NS_LANGS, NS_LESSONS_ONE } from "@/contexts/i18n/settings";
import { Box, Stack, Tooltip, tooltipClasses, Typography, Zoom } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LangProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { useLessonTeacher } from "@/contexts/LessonTeacherProvider";
import { ClassUser } from "@/classes/users/ClassUser";
import Link from "next/link";
import { ClassCountry } from "@/classes/ClassCountry";
import { parseAndValidatePhone } from "@/contexts/functions";

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    arrow
    slots={{
      transition: Zoom,
    }}
    slotProps={{
      popper: {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -5],
            },
          },
        ],
      },
    }}
    classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "var(--primary)",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "var(--primary)",
    color: 'white'
  },
}));
export default function OneTeacherLessonComponent({ teacher = null }) {
  const { user } = useAuth();
  const { t } = useTranslation([ClassUser.NS_COLLECTION, NS_LESSONS_ONE, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
  const { lang } = useLanguage();
  //const [lesson, setLesson] = useState(null);
  const { lesson } = useLessonTeacher();

    const parsedPhoneNumber = useMemo(() => {
      if(!teacher) return "";
      const codeCountry = ClassCountry.extractCodeCountryFromPhoneNumber(teacher?.phone_number);
      const parsedPhoneNumber = parseAndValidatePhone(teacher?.phone_number || "", codeCountry || "")?.national;
      //console.log("Parsed phone", parsedPhoneNumber)
      return parsedPhoneNumber;
    }, [teacher]);

  return (<Stack>
    <div className="teacher-card">
      <div className="teacher-main">
        {teacher?.showAvatar?.({})}
        <div className="teacher-text">
          <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
            <p className="teacher-name">
              {teacher?.first_name} {teacher?.last_name}
            </p>
            {
              teacher?.certified && <BootstrapTooltip title={t('certified')}>
                <Box>
                  <IconUserCertified height={14} width={14} color="var(--primary)" />
                </Box>
              </BootstrapTooltip>
            }
          </Stack>
          <p className="teacher-role">{teacher?.role_title}</p>
        </div>
      </div>
      <p className="teacher-bio">{teacher?.bio}</p>
      <Stack>
      <Stack direction={'row'} spacing={1} alignItems={'center'}>
        <Typography sx={{fontSize:"0.8rem", color:'var(--primary-dark)', fontWeight:600}}>{`${t('email')} :`}</Typography><Link style={{fontSize:"0.8rem"}} className="link" href={`mailto:${teacher?.email || ""}`}>{teacher?.email || ""}</Link>
      </Stack>
      <Stack direction={'row'} spacing={1} alignItems={'center'}>
        <Typography sx={{fontSize:"0.8rem", color:'var(--primary-dark)', fontWeight:600}}>{`${t('phone_number')} :`}</Typography><Link style={{fontSize:"0.8rem"}} className="link" href={`tel:${teacher?.phone_number || ""}`}>{parsedPhoneNumber}</Link>
      </Stack>
      </Stack>

    </div>
    <style jsx>{`
        .teacher-card {
          border-radius: 10px;
          border: 1px solid #111827;
          border: 0.1px solid var(--primary-shadow-xl);
          padding: 10px 10px 12px;
          padding: 15px;
          background: radial-gradient(circle at top left, #111827, #020617);
          background: var(--primary-shadow);
          font-size: 0.85rem;
        }
        .teacher-main {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .teacher-text {
          font-size: 0.83rem;
        }
        .teacher-name {
          margin: 0;
          font-weight: 500;
          line-height: 1rem;
          color: var(--primary-dark);
        }
        .teacher-role {
          margin: 0;
          color: var(--primary-dark);
          font-size: 0.78rem;
        }
        .teacher-bio {
          margin: 4px 0 4px;
          font-size: 0.8rem;
          color: var(--primary-dark);
        }
        `}</style>
  </Stack>);
}