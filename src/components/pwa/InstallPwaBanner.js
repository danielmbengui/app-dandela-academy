"use client";

import { usePwa } from "@/contexts/PwaProvider";
import { Stack, Typography } from "@mui/material";
import ButtonCancel from "../dashboard/elements/ButtonCancel";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import { IconLogoImage } from "@/assets/icons/IconsComponent";

export default function InstallPwaBanner({skipAction=()=>{}}) {

  const { isBrowser, isPWA, isMacOS, isSafari, isIOS, canInstall, promptInstall, installPwa } = usePwa();

  if (!isBrowser) return null;

  return (<>
    <div className="pwa-banner" style={{ color: 'white' }}>
      {
        <Typography>{"Can install : "}{canInstall ? "yes" : "no"}</Typography>
      }
      {
        <Typography>{"Browser : "}{isBrowser ? "yes" : "no"}</Typography>
      }
      {
        <Typography>{"Pwa : "}{isPWA ? "yes" : "no"}</Typography>
      }
      {
        <Typography>{"Is safari : "}{isSafari ? "yes" : "no"}</Typography>
      }
      {
        <Typography>{"Is mac os : "}{isMacOS ? "yes" : "no"}</Typography>
      }

      {
        <Typography>{"Is IOS : "}{isIOS ? "yes" : "no"}</Typography>
      }
      {
        !isPWA && <>
          {
            isSafari && <>
              {
                !isIOS && <Stack alignItems={'center'} maxWidth={'sm'} sx={{ background: 'var(--card-color)', p: 2,borderRadius:'10px',color:'var(--font-color)' }}>
                  <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
                    <IconLogoImage /><h1 style={{ fontWeight: 500 }}>{`Dandela Academy App`}</h1>
                  </Stack>
                  <p>Installe l'application pour une meilleure expérience utilisateur.</p>
                  <Typography style={{ color: 'var(--grey-light)' }}>{`⚡ Plus rapide 🔔 Notifications 📱 Expérience mobile native`}</Typography>
                  <Stack sx={{width:'100%',py:3}} spacing={1}>
                    <Stack spacing={1}>
                    <Typography fontWeight={500}>{`Étapes d’installation :`}</Typography>
                    <ol>
                    <li>Appuyez sur l’icône <b>Partager</b> (⬆️)</li>
                    <li>Sélectionnez <b>"Ajouter à l’écran d’accueil"</b></li>
                    <li>Confirmez en appuyant sur <b>Ajouter</b></li>
                    </ol>
                    </Stack>
                    <p>👉 L’application apparaîtra comme une app native sur votre écran d’accueil.</p>
                  </Stack>
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <ButtonCancel onClick={skipAction} label="Plus tard" />
                  </Stack>
                </Stack>
              }
              {
                isMacOS && <Stack alignItems={'center'} maxWidth={'sm'} sx={{ background: 'var(--card-color)', borderRadius: '10px', p: 2, color: 'var(--font-color)' }}>
                  <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
                    <IconLogoImage /><h1 style={{ fontWeight: 500 }}>{`Dandela Academy App`}</h1>
                  </Stack>
                  <p>Installe l'application pour une meilleure expérience utilisateur.</p>
                  <Typography style={{ color: 'var(--grey-light)' }}>{`⚡ Plus rapide 🔔 Notifications 📱 Expérience mobile native`}</Typography>
                  <Stack sx={{width:'100%',py:3}} spacing={1}>
                    <Stack spacing={1}>
                    <Typography fontWeight={500}>{`Étapes d’installation :`}</Typography>
                    <ol>
                      <li>Dans la barre de menu, cliquez sur <b>Fichier</b> (📁)</li>
                      <li>Sélectionnez <b>"Ajouter au Dock"</b></li>
                      <li>Confirmez l’ajout</li>
                    </ol>
                    </Stack>
                    <p>👉 L’application s’ouvrira ensuite dans une fenêtre dédiée.</p>
                  </Stack>
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <ButtonCancel onClick={skipAction} label="Plus tard" />
                  </Stack>
                </Stack>
              }
            </>
          }
          {
            !isSafari && <Stack alignItems={'center'} maxWidth={'sm'} sx={{ background: 'var(--card-color)', color: 'var(--font-color)', borderRadius: '10px', p: 1.5 }}>
              <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
                <IconLogoImage /><h1 style={{ fontWeight: 500 }}>{`Dandela Academy App`}</h1>
              </Stack>
              <p>Installe l'application pour une meilleure expérience utilisateur.</p>
              <Typography style={{ color: 'var(--grey-light)' }}>{`⚡ Plus rapide 🔔 Notifications 📱 Expérience mobile native`}</Typography>
              <Stack direction={'row'} spacing={1} alignItems={'center'} sx={{ pt: 2.5 }}>
                <ButtonCancel label="Plus tard" onClick={skipAction} />
                <ButtonConfirm label="Installer" onClick={installPwa} />
              </Stack>
            </Stack>
          }
        </>
      }









      <button onClick={promptInstall}>
        Installer l’application
      </button>
      {canInstall && (
        <button onClick={promptInstall}>
          Installer l’application
        </button>
      )}

      {isIOS && !canInstall && (
        <p>
          Sur iPhone, touche <strong>Partager</strong> puis
          <strong> “Ajouter à l’écran d’accueil”</strong>
        </p>
      )}
    </div>
    <style jsx>{`
    ol {
    list-style: decimal !important;
  padding-left: 30px;
  font-size: 0.9rem;
  line-height: 1.15rem;
}

ol li {
  margin-bottom: 6px;
}

    `}
    </style>
  </>);
}
