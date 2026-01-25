"use client";

import { usePwa } from "@/contexts/PwaProvider";
import { Backdrop, Stack, Typography } from "@mui/material";
import ButtonCancel from "../dashboard/elements/ButtonCancel";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import { IconLogoImage } from "@/assets/icons/IconsComponent";

export default function InstallPwaBanner({ showPwaComponent = false, skipAction = () => { } }) {

  const { isBrowser, isPWA, isMacOS, isSafari, isIOS, canInstall, promptInstall, installPwa } = usePwa();

  if (!isBrowser) return null;

  return (<>
    <Backdrop
      sx={{ 
        zIndex: 1_000_000_000, 
        background: 'rgba(0,0,0,0.75)', 
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'opacity 0.3s ease-in-out',
        borderTopLeftRadius: { xs: 0, sm: '15px' } 
      }}
      open={showPwaComponent}
      onClick={skipAction}
      >
      <Stack 
        spacing={2} 
        alignItems={'center'} 
        justifyContent={'center'} 
        onClick={(e) => e.stopPropagation()}
        sx={{ 
          p: { xs: 0, sm: 2 }, 
          background: '', 
          height: '100%', 
          width: '100%',
        }}>
        <div className="pwa-banner" style={{ color: 'white' }}>
          {
            !isPWA && <>
              {
                isSafari && <>
                  {
                    isIOS && <Stack 
                      alignItems={'center'} 
                      maxWidth={'sm'} 
                      sx={{ 
                        background: 'var(--card-color)', 
                        p: 2, 
                        borderRadius: '16px', 
                        color: 'var(--font-color)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.02)'
                        }
                      }}>
                      <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
                        <IconLogoImage /><h1 style={{ fontWeight: 500 }}>{`Dandela Academy App`}</h1>
                      </Stack>
                      <p>{`Installe l'application pour une meilleure expérience utilisateur.`}</p>
                      <Typography style={{ color: 'var(--grey-light)' }}>{`⚡ Plus rapide 🔔 Notifications 📱 Expérience mobile native`}</Typography>
                      <Stack sx={{ width: '100%', py: 3 }} spacing={1}>
                        <Stack spacing={1}>
                          <Typography fontWeight={500}>{`Étapes d’installation :`}</Typography>
                          <ol>
                            <li>{`Appuyez sur l’icône`} <b>Partager</b> (⬆️)</li>
                            <li>Sélectionnez <b>{`"Ajouter à l’écran d’accueil"`}</b></li>
                            <li>Confirmez en appuyant sur <b>Ajouter</b></li>
                          </ol>
                        </Stack>
                        <p>{`👉 L’application apparaîtra comme une app native sur votre écran d’accueil.`}</p>
                      </Stack>
                      <Stack direction={'row'} spacing={1} alignItems={'center'}>
                        <ButtonCancel onClick={skipAction} label="Plus tard" />
                      </Stack>
                    </Stack>
                  }
                  {
                    isMacOS && <Stack 
                      alignItems={'center'} 
                      maxWidth={'sm'} 
                      sx={{ 
                        background: 'var(--card-color)', 
                        borderRadius: '16px', 
                        p: 2, 
                        color: 'var(--font-color)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.02)'
                        }
                      }}>
                      <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
                        <IconLogoImage /><h1 style={{ fontWeight: 500 }}>{`Dandela Academy App`}</h1>
                      </Stack>
                      <p>{`Installe l'application pour une meilleure expérience utilisateur.`}</p>
                      <Typography style={{ color: 'var(--grey-light)' }}>{`⚡ Plus rapide 🔔 Notifications 📱 Expérience mobile native`}</Typography>
                      <Stack sx={{ width: '100%', py: 3 }} spacing={1}>
                        <Stack spacing={1}>
                          <Typography fontWeight={500}>{`Étapes d’installation :`}</Typography>
                          <ol>
                            <li>Dans la barre de menu, cliquez sur <b>Fichier</b> (📁)</li>
                            <li>Sélectionnez <b>{`"Ajouter au Dock"`}</b></li>
                            <li>{`Confirmez l’ajout`}</li>
                          </ol>
                        </Stack>
                        <p>{`👉 L’application s’ouvrira ensuite dans une fenêtre dédiée.`}</p>
                      </Stack>
                      <Stack direction={'row'} spacing={1} alignItems={'center'}>
                        <ButtonCancel onClick={skipAction} label="Plus tard" />
                      </Stack>
                    </Stack>
                  }
                </>
              }
              {
                !isSafari && <Stack 
                  alignItems={'center'} 
                  maxWidth={'sm'} 
                  sx={{ 
                    background: 'var(--card-color)', 
                    color: 'var(--font-color)', 
                    borderRadius: '16px', 
                    p: 1.5,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}>
                  <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
                    <IconLogoImage /><h1 style={{ fontWeight: 500 }}>{`Dandela Academy App`}</h1>
                  </Stack>
                  <p>{`Installe l'application pour une meilleure expérience utilisateur.`}</p>
                  <Typography style={{ color: 'var(--grey-light)' }}>{`⚡ Plus rapide 🔔 Notifications 📱 Expérience mobile native`}</Typography>
                  <Stack direction={'row'} spacing={1} alignItems={'center'} sx={{ pt: 2.5 }}>
                    <ButtonCancel label="Plus tard" onClick={skipAction} />
                    <ButtonConfirm label="Installer" onClick={installPwa} />
                  </Stack>
                </Stack>
              }
            </>
          }
        </div>
      </Stack>
    </Backdrop>
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
