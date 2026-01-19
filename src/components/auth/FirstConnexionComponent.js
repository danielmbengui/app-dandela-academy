"use client";

import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import ButtonCancel from "../dashboard/elements/ButtonCancel";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import { useAuth } from "@/contexts/AuthProvider";
import { ClassUser } from "@/classes/users/ClassUser";
import { useTranslation } from "react-i18next";
import { NS_FIRST_CONNEXION } from "@/contexts/i18n/settings";

const SLIDES = [
  {
    title: "slides.slide1.title",
    description: "slides.slide1.description",
    image: "https://firebasestorage.googleapis.com/v0/b/dandelapp-bbe09.appspot.com/o/steppers%2Ffirst-connexion%2Fstep-1.png?alt=media&token=89718609-d925-46bc-8faa-7c4a06e1f1ed",
    video: "https://firebasestorage.googleapis.com/v0/b/dandelapp-bbe09.appspot.com/o/steppers%2Ffirst-connexion%2Fstep-1.mp4?alt=media&token=63d27db6-4e66-4a12-ac2a-e91cd8859d48"
  },
  {
    title: "slides.slide2.title",
    description: "slides.slide2.description",
    image: "https://firebasestorage.googleapis.com/v0/b/dandelapp-bbe09.appspot.com/o/steppers%2Ffirst-connexion%2Fstep-2.png?alt=media&token=ec2964cb-1cc7-4258-8ddb-32fc401bbda7",
    video: "https://firebasestorage.googleapis.com/v0/b/dandelapp-bbe09.appspot.com/o/steppers%2Ffirst-connexion%2Fstep-2.mp4?alt=media&token=afefa60a-b9be-4ac8-8382-305b291da36b",
  },
  {
    title: "slides.slide3.title",
    description: "slides.slide3.description",
    image: "https://firebasestorage.googleapis.com/v0/b/dandelapp-bbe09.appspot.com/o/steppers%2Ffirst-connexion%2Fstep-3.png?alt=media&token=d4182386-2c21-4b42-8426-739e9b362157",
    video: "https://firebasestorage.googleapis.com/v0/b/dandelapp-bbe09.appspot.com/o/steppers%2Ffirst-connexion%2Fstep-3.mp4?alt=media&token=c3cbabac-5464-4bad-b59b-3f532e3878e1",
  },
  {
    title: "slides.slide4.title",
    description: "slides.slide4.description",
    image: "https://firebasestorage.googleapis.com/v0/b/dandelapp-bbe09.appspot.com/o/steppers%2Ffirst-connexion%2Fstep-4.png?alt=media&token=6505ec2a-4d49-4728-9e38-ea3520a80d3a",
    video: "https://firebasestorage.googleapis.com/v0/b/dandelapp-bbe09.appspot.com/o/steppers%2Ffirst-connexion%2Fstep-4.mp4?alt=media&token=a62d66c1-9344-4ef3-98ab-27fb9a7fff4f",
  },
  {
    title: "slides.slide5.title",
    description: "slides.slide5.description",
    image: "https://firebasestorage.googleapis.com/v0/b/dandelapp-bbe09.appspot.com/o/steppers%2Ffirst-connexion%2Fstep-5.png?alt=media&token=0fa3a6a3-a866-4f66-989e-eeae84fac072",
    video: "https://firebasestorage.googleapis.com/v0/b/dandelapp-bbe09.appspot.com/o/steppers%2Ffirst-connexion%2Fstep-5.mp4?alt=media&token=beadfcc8-042d-4d58-a7bc-07449c7a0ae8",
  },
];

export default function FirstConnexionComponent({ onFinish }) {
  const { t } = useTranslation([NS_FIRST_CONNEXION]);
  const [index, setIndex] = useState(0);
  const { user } = useAuth();

  const isFirst = index === 0;
  const isLast = index === SLIDES.length - 1;
  const [processing, setProcessing] = useState(false);
  const back = () => {
    if (!isFirst) setIndex((i) => i - 1);
    //else onFinish?.();
  };
  const next = async () => {
    if (!isLast) setIndex((i) => i + 1);
    else {
      await complete();
    }
  };

  const complete = async () => {
    if (user) {
      setProcessing(true);
      user.update({ status: ClassUser.STATUS.MUST_COMPLETE_PROFILE });
      await user.updateFirestore();
      setProcessing(false);
    }
  };

  return (
    <Stack justifyContent={'center'} alignItems={'center'} sx={{ background: '', px: 1, textAlign: 'center', width: '100%', height: { xs: '100%', sm: 'auto' } }}>
      <Stack spacing={2} maxWidth={'md'} justifyContent={'center'} alignItems={'end'} sx={{ background: 'var(--card-color)', py: { xs: 2, sm: 1.5 }, px: 2, borderRadius: '10px' }}>
        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          <Typography onClick={complete} fontWeight={500} sx={{ color: processing ? 'var(--grey-light)' : 'var(--primary)', fontSize: '16px', cursor: processing ? 'default' : 'pointer' }}>{t('btn-skip')}</Typography>
          {
            processing && <CircularProgress size={16} sx={{ color: 'var(--grexy-light)' }} />
          }
        </Stack>

        {
          SLIDES.map((slide, i) => {
            return (<Stack key={`${slide.title}`} alignItems={'center'} sx={{display:i===index?'flex':'none', background: '', width: '100%' }} spacing={1.5}>
              <h2>{t(slide.title)}</h2>
              <Box
                //ref={videoRef}
                component="video"
                src={slide.video || ""}
                poster={slide.image || ""}
                //controls
                autoPlay={true}
                muted={true}
                loop={true}
                playsInline
                onClick={(e) => { e.preventDefault() }}
                sx={{
                  cursor: 'default',
                  pointerEvents: 'auto',
                  width: "70%",

                  //bgcolor:'red',
                  //maxWidth: 960,
                  maxHeight: '400px',
                  borderRadius: '10px',
                  //borderRadius: 2,
                  //boxShadow: 3,
                  aspectRatio: "16 / 9",
                  //backgroundColor: "black",
                  display: "block",
                }}
              />
              <Box sx={{ maxWidth: { sm: '80%' }, }}>
                <p style={{ color: 'var(--grey-light)' }}>{t(slide.description)}</p>
              </Box>
            </Stack>)
          })
        }
        <Stack spacing={2} sx={{ width: '100%', pb: 3, }}>
          {/* Progress */}
          <div className="progress">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === index ? "active" : ""}`}
              />
            ))}
          </div>
          <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} sx={{ background: '', width: '100%' }} spacing={1}>
            <ButtonCancel disabled={isFirst || processing} onClick={back} size="large" label={t('btn-back')} sx={{ width: { xs: '100%', sm: '30%' } }} />
            <ButtonConfirm loading={processing} onClick={next} size="large" label={!isLast ? t('btn-next') : t('btn-start')} sx={{ width: { xs: '100%', sm: '30%' } }} />
          </Stack>
        </Stack>
      </Stack>

      <style jsx>{`
        .slide {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          animation: fade 0.3s ease;
        }

        @keyframes fade {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .image-wrapper {
          width: 160px;
          max-height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-wrapper img {
          max-width: 100%;
          max-height: 100%;
        }

        h2 {
          margin: 0;
          font-size: 1.35rem;
        }

        p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--grey-light);
          line-height: 1.35rem;
        }

        .progress {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 4px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--grey-dark);
        }

        .dot.active {
          background: linear-gradient(135deg, var(--primary-shadow-xl), var(--primary));
          width: 18px;
        }

        .actions {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 6px;
        }

        .btn {
          flex: 1;
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .ghost {
          background: transparent;
          border: 1px solid #1f2937;
          color: #e5e7eb;
        }

        .primary {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          border: none;
          color: white;
        }
      `}</style>
    </Stack>
  );
}
