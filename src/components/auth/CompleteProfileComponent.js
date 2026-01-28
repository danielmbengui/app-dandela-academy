"use client";

import { Box, CircularProgress, Container, Stack, Typography, IconButton } from "@mui/material";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ButtonCancel from "../dashboard/elements/ButtonCancel";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import { useAuth } from "@/contexts/AuthProvider";
import { ClassUser } from "@/classes/users/ClassUser";
import { Trans, useTranslation } from "react-i18next";
import { NS_COMPLETE_PROFILE, NS_FIRST_CONNEXION, NS_BUTTONS } from "@/contexts/i18n/settings";
import ButtonImportFiles from "../elements/ButtonImportFiles";
import FieldComponent from "../elements/FieldComponent";
import { IconCamera, IconProfile, IconPicture } from "@/assets/icons/IconsComponent";
import { ClassFile } from "@/classes/ClassFile";
import FieldPhoneComponent from "../elements/FieldPhoneComponent";
import { ClassCountry } from "@/classes/ClassCountry";
import CheckboxComponent from "../elements/CheckboxComponent";
import { Icon } from "@iconify/react";

const ProgressComponent = ({ length = 0, index = -1, disabledNext = true }) => {
  const slides = [...Array(length).keys()];
  const hasPrevious = index > 0;
  const hasNext = index < length - 1;
  return (<>
    <div className="progress">
      {slides.map((_, i) => (
        <span
          key={i}
          className={`dot ${i === index ? "active" : ""}`}
          style={{
            //cursor: i>0 && i===index+1 && (!disabledNext&&hasNext) ? 'pointer' : 'default'
          }}
        />
      ))}
    </div>
    <style jsx>{`
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
    `}</style>
  </>)
}
function SlideInfos({ length = 0, index = -1, textNext = "", user = null, userEdit = null, setUserEdit = null, setIndex = null, progressComponent = <></> }) {
  const { t } = useTranslation([ClassUser.NS_COLLECTION]);
  const [errors, setErrors] = useState({});
  const onChangeValue = (e) => {
    const { name, value, type } = e.target;
    setErrors(prev => {
      const value = { ...prev };
      value[name] = null;
      delete value[name];
      return (value);
    });
    console.log("hange", name, type, value, userEdit?.phone_number);
    setUserEdit((prev) => {
      if (!prev || prev === null) {
        const _user = user.clone();
        _user.update({ [name]: type === 'date' ? new Date(value) : value });
        return _user.clone();
      };
      prev.update({ [name]: type === 'date' ? new Date(value) : value });
      //updated[name] = value;
      return prev.clone();
    });
  }
  const onClearValue = (name) => {
    //const { name, value } = e.target;
    setErrors(prev => {
      prev[name] = null;
      delete prev[name];
      return prev;
    });
    setUserEdit((prev) => {
      if (!prev || prev === null) {
        const _user = user.clone();
        _user.update({ [name]: '' });
        return _user.clone();
      };
      prev.update({ [name]: '' });
      //updated[name] = value;
      return prev.clone();
    });
  }
  const next = async () => {
    const _errors = {};
    setErrors(_errors);
    const codeCountry = ClassCountry.extractCodeCountryFromPhoneNumber(userEdit?.phone_number);
    if (!userEdit.validFirstName()) {
      _errors.first_name = <Trans t={t} i18nKey={'errors.first_name'} values={{
        min: ClassUser.MIN_LENGTH_FIRST_NAME,
        max: ClassUser.MAX_LENGTH_FIRST_NAME
      }} />;
    }
    if (!userEdit.validLastName()) {
      _errors.last_name = <Trans t={t} i18nKey={'errors.last_name'} values={{
        min: ClassUser.MIN_LENGTH_LAST_NAME,
        max: ClassUser.MAX_LENGTH_LAST_NAME
      }} />;
    }
    if (!userEdit.birthday || !(userEdit.birthday instanceof Date)) {
      _errors.birthday = t('errors.birthday');
    } else {
      if (!userEdit.validBirthday()) {
        _errors.birthday = <Trans t={t} i18nKey={'errors.birthday-not-valid'} values={{
          years: ClassUser.MIN_YEARS_OLD,
        }} />;
      }
    }
    if (userEdit.isErrorPhoneNumber(codeCountry)) {
      _errors.phone_number = t('errors.phone_number');
    }
    setErrors(_errors);
    if (Object.keys(_errors).length > 0) {
      return;
    }
    setUserEdit((prev) => {
      if (!prev || prev === null) {
        const _user = user.clone();
        _user.update({ 'email_academy': `${_user.display_name}@dandela-academy.com` });
        return _user.clone();
      };
      prev.update({ 'email_academy': `${prev.display_name}@dandela-academy.com` });
      //updated[name] = value;
      return prev.clone();
    });

    setIndex((prev) => prev + 1);
  };
  const disabledNext = useMemo(() => {
    if (!userEdit?.first_name) return true;
    if (!userEdit?.last_name) return true;
    if (!userEdit?.birthday) return true;
    if (Object.keys(errors).length > 0) return true;
    return false;
  }, [userEdit, errors]);
  return (<Stack spacing={2}>
    <Stack spacing={1}>
      <FieldComponent
        label={t('first_name')}
        placeholder={t('first_name_placeholder')}
        type="text"
        name={"first_name"}
        value={userEdit?.first_name || ''}
        onChange={onChangeValue}
        onClear={() => onClearValue('first_name')}
        error={errors['first_name']}
        fullWidth
        style={{ width: '100%' }}
        required
      />
      <FieldComponent
        label={t('last_name')}
        placeholder={t('last_name_placeholder')}
        type="text"
        name={"last_name"}
        value={userEdit?.last_name || ''}
        onChange={onChangeValue}
        onClear={() => onClearValue('last_name')}
        error={errors['last_name']}
        fullWidth
        style={{ width: '100%' }}
        required
      />
      <FieldComponent
        label={t('birthday')}
        placeholder={t('birthday_placeholder')}
        type="date"
        name={"birthday"}
        value={userEdit?.birthday || ''}
        onChange={onChangeValue}
        onClear={() => onClearValue('birthday')}
        error={errors['birthday']}
        fullWidth={true}
        style={{ width: '100%' }}
        required
      />
      <FieldPhoneComponent
        label={t('phone_number')}
        placeholder={t('phone_number_placeholder')}
        type="phone"
        name={"phone_number"}
        value={userEdit?.phone_number || ''}
        onChange={onChangeValue}
        onClear={() => onClearValue('phone_number')}
        error={errors['phone_number']}
        fullWidth={true}
        style={{ width: '100%' }}
      //required
      />
    </Stack>
    <Stack spacing={2} sx={{ width: '100%', pb: 3, }}>
      <ProgressComponent
        disabledNext={disabledNext}
        length={length} index={index} />
      <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} sx={{ background: '', width: '100%' }} spacing={1}>
        <ButtonConfirm
          //loading={processing} 
          disabled={disabledNext}
          onClick={next}
          size="large"
          label={textNext}
          sx={{ width: { xs: '100%', sm: '30%' } }} />
      </Stack>
    </Stack>
  </Stack>)
}
function ImageComponent({ src = null, uid = '' }) {
  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'var(--grey-hyper-light)',
      }}
    >
      <Image
        src={src}
        alt={`image-profile-${uid}`}
        quality={100}
        width={300}
        height={300}
        priority
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: 300,
          objectFit: 'contain',
        }}
      />
    </Box>
  );
}

function SlidePhoto({ length = 0, index = -1, textBack = "", textNext = "", files, setFiles, user = null, userEdit = null, setUserEdit = null, setIndex = null, progressComponent = <></> }) {
  const { t } = useTranslation([NS_COMPLETE_PROFILE, NS_BUTTONS]);
  const next = async () => {
    setIndex((prev) => prev + 1);
  };
  const back = () => {
    setIndex((prev) => prev - 1);
  };

  // Priorité à userEdit, puis user, en vérifiant que ce n'est pas une chaîne vide
  const photoUrl = useMemo(() => {
    // Si userEdit existe et a une photo_url (même vide), on l'utilise en priorité
    if (userEdit && userEdit.photo_url !== undefined) {
      const editPhoto = userEdit.photo_url;
      return editPhoto && editPhoto.trim() !== '' ? editPhoto : null;
    }
    // Sinon, on utilise celle de user
    const userPhoto = user?.photo_url;
    return userPhoto && userPhoto.trim() !== '' ? userPhoto : null;
  }, [userEdit?.photo_url, user?.photo_url]);
  
  const hasFile = files.length > 0;
  const hasPhoto = !hasFile && photoUrl;

  // Vérifier si on peut réinitialiser la photo (si la photo a été modifiée ou supprimée)
  const canResetPhoto = useMemo(() => {
    // Pas de bouton si user n'a pas de photo_url originale
    if (!user?.photo_url || user.photo_url.trim() === '') return false;
    
    const originalPhoto = user.photo_url.trim();
    
    // Cas 1: Un fichier a été importé (nouvelle photo)
    if (hasFile) return true;
    
    // Cas 2: La photo a été supprimée (userEdit.photo_url est vide mais user.photo_url existe)
    if (userEdit && userEdit.photo_url !== undefined) {
      const currentPhoto = (userEdit.photo_url || '').trim();
      if (currentPhoto === '' && originalPhoto !== '') return true;
    }
    
    // Cas 3: La photo a été modifiée (userEdit.photo_url est différent de user.photo_url)
    if (userEdit && userEdit.photo_url !== undefined) {
      const currentPhoto = (userEdit.photo_url || '').trim();
      if (currentPhoto !== '' && currentPhoto !== originalPhoto) return true;
    }
    
    return false;
  }, [user?.photo_url, userEdit?.photo_url, hasFile]);

  const handleRemoveFile = () => {
    setFiles([]);
  };

  const handleSetFile = (newFiles) => {
    setFiles(newFiles && newFiles.length > 0 ? newFiles : []);
  };

  const handleResetPhoto = () => {
    if (setUserEdit && userEdit && user?.photo_url) {
      // Supprimer les fichiers importés
      setFiles([]);
      // Restaurer la photo originale
      setUserEdit(prev => {
        if (!prev) return userEdit;
        prev.update({ photo_url: user.photo_url });
        return prev.clone();
      });
    }
  };

  const cardSx = {
    bgcolor: 'var(--card-color)',
    border: '1px solid var(--card-border)',
    borderRadius: 2,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    p: 3,
    transition: 'box-shadow 0.2s ease',
    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  };

  return (
    <Stack spacing={2}>
      <Box sx={cardSx}>
        <Stack spacing={2} alignItems="center">
          {!hasFile && !hasPhoto && (
            <Stack spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
              <Box sx={{ p: 2, borderRadius: '50%', border: '0.1px solid var(--card-border)', bgcolor: 'var(--grey-hyper-light)' }}>
                <IconProfile height={60} width={60} color="var(--grey-light)" />
              </Box>
              {canResetPhoto && (
                <ButtonCancel
                  icon={<IconPicture width={12} height={12} />}
                  disabled={false}
                  label={t('reset-photo', { ns: NS_BUTTONS })}
                  size="small"
                  onClick={handleResetPhoto}
                />
              )}
              <ButtonImportFiles
                files={[]}
                setFiles={handleSetFile}
                supported_files={ClassFile.SUPPORTED_IMAGES_TYPES.map(type => type.value)}
                multiple={false}
              />
            </Stack>
          )}

          {!hasFile && hasPhoto && (
            <Stack spacing={1.5} alignItems="stretch" sx={{ width: '100%' }}>
              <Box sx={{ borderRadius: 1, overflow: 'hidden', border: '1px solid var(--card-border)' }}>
                <ImageComponent src={photoUrl} uid={userEdit?.uid || user?.uid || ''} />
              </Box>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={1} 
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent={{ xs: 'stretch', sm: 'flex-start' }}
                flexWrap="wrap"
              >
                <ButtonConfirm
                  icon={<Icon icon="mdi:delete-outline" width={12} height={12} />}
                  disabled={false}
                  label={t('remove-photo', { ns: NS_BUTTONS })}
                  size="small"
                  sx={{ bgcolor: 'var(--error)', '&:hover': { bgcolor: 'var(--error-dark)' } }}
                  onClick={() => {
                    if (setUserEdit && userEdit) {
                      setUserEdit(prev => {
                        if (!prev) return userEdit;
                        prev.update({ photo_url: '' });
                        return prev.clone();
                      });
                    }
                  }}
                />
                <ButtonImportFiles
                  files={[]}
                  setFiles={handleSetFile}
                  supported_files={ClassFile.SUPPORTED_IMAGES_TYPES.map(type => type.value)}
                  multiple={false}
                />
                {canResetPhoto && (
                  <ButtonCancel
                    icon={<IconPicture width={12} height={12} />}
                    disabled={false}
                    label={t('reset-photo', { ns: NS_BUTTONS })}
                    size="small"
                    onClick={handleResetPhoto}
                  />
                )}
              </Stack>
            </Stack>
          )}

          {hasFile && (
            <Stack spacing={1.5} alignItems="stretch" sx={{ width: '100%' }}>
              <Box sx={{ borderRadius: 1, overflow: 'hidden', border: '1px solid var(--card-border)' }}>
                <ImageComponent src={URL.createObjectURL(files[0])} uid={userEdit?.uid || user?.uid || ''} />
              </Box>
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                {canResetPhoto && (
                  <ButtonCancel
                    icon={<IconPicture width={12} height={12} />}
                    disabled={false}
                    label={t('reset-photo', { ns: NS_BUTTONS })}
                    size="small"
                    onClick={handleResetPhoto}
                  />
                )}
                <Stack 
                  onClick={handleRemoveFile} 
                  direction="row" 
                  spacing={1} 
                  justifyContent="center" 
                  alignItems="center" 
                  sx={{ color: 'var(--error)', cursor: 'pointer' }}
                >
                  <IconButton sx={{ background: 'rgba(0,0,0,0.75)', cursor: 'pointer' }}>
                    <Icon color="red" icon="mdi:delete-outline" width="16" height="16" />
                  </IconButton>
                  <Typography variant="body2" sx={{ color: 'var(--error)' }}>
                    {ClassFile.formatFileName(files[0]?.name)}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Box>
      <Stack spacing={2} sx={{ width: '100%', pb: 3 }}>
        <ProgressComponent length={length} index={index} />
        <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} sx={{ width: '100%' }} spacing={1}>
          <ButtonCancel
            onClick={back}
            size="large"
            label={textBack}
            sx={{ width: { xs: '100%', sm: '30%' } }}
          />
          <ButtonConfirm
            onClick={next}
            size="large"
            label={textNext}
            sx={{ width: { xs: '100%', sm: '30%' } }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
function SlideMarketing({ length = 0, index = -1, files, setFiles, textBack = "", textNext = "", user = null, userEdit = null, setUserEdit = null, setIndex = null, progressComponent = <></> }) {
  const { t } = useTranslation([ClassUser.NS_COLLECTION, NS_COMPLETE_PROFILE]);
  const [processing, setProcessing] = useState(false);
  const onChangeValue = (e) => {
    const { name, value, type, checked } = e.target;
    setUserEdit((prev) => {
      if (!prev || prev === null) {
        const _user = user.clone();
        _user.update({ [name]: checked });
        return _user.clone();
      };
      prev.update({ [name]: checked });
      //updated[name] = value;
      return prev.clone();
    });
  }
  const next = async () => {
    try {
      setProcessing(true);
      const file = files[0] || null;
      var urlPhoto = "";
      
      // Cas 1: Un nouveau fichier a été importé
      if (file) {
        const filename = file.name;
        const extension = filename.split('.').pop().toLowerCase();
        const _path = `${ClassUser.COLLECTION}/${user.uid}/profile-photo`;
        const resultFile = await ClassFile.uploadFileToFirebase({
          file: file,
          path: _path,
        });
        const newFile = new ClassFile({
          id: "",
          uri: resultFile?.uri || "",
          path: resultFile?.path,
          name: resultFile?.name,
          type: resultFile?.type,
          size: resultFile?.size,
          tag: `profile`,
        }).toJSON();
        urlPhoto = newFile?.uri || "";
      } 
      // Cas 2: La photo a été supprimée (userEdit.photo_url est vide mais user.photo_url existe)
      else if (userEdit && userEdit.photo_url !== undefined && userEdit.photo_url.trim() === '' && user?.photo_url && user.photo_url.trim() !== '') {
        urlPhoto = "";
      }
      // Cas 3: La photo actuelle a été modifiée (userEdit.photo_url est différent de user.photo_url)
      else if (userEdit && userEdit.photo_url !== undefined && userEdit.photo_url.trim() !== '') {
        const currentPhoto = userEdit.photo_url.trim();
        const originalPhoto = (user?.photo_url || '').trim();
        if (currentPhoto !== originalPhoto) {
          urlPhoto = currentPhoto;
        } else {
          // Pas de changement, garder la photo actuelle
          urlPhoto = userEdit.photo_url || user?.photo_url || "";
        }
      }
      // Cas 4: Pas de changement, garder la photo actuelle
      else {
        urlPhoto = userEdit?.photo_url || user?.photo_url || "";
      }
      
      const status = userEdit.email_verified ? ClassUser.STATUS.ONLINE : ClassUser.STATUS.MUST_ACTIVATE;
      const activated = userEdit.email_verified ? true : false;
      
      setUserEdit((prev) => {
        if (!prev || prev === null) {
          user?.update({ photo_url: urlPhoto, activated: activated, status: status });
          return user?.clone()
        }
        prev.update({ photo_url: urlPhoto, activated: activated, status: status });
        return prev.clone();
      });
      const _user = await userEdit.updateFirestore();
      setUserEdit(_user);
    } catch (error) {
      console.log("ERrror file", error)
    } finally {
      setProcessing(false);
    }
    /*
    const _errors = {};
    setErrors(_errors);
    const codeCountry = ClassCountry.extractCodeCountryFromPhoneNumber(userEdit?.phone_number);
    console.log("prefixes", ClassCountry.extractCodeCountryFromPhoneNumber("+33123456789"));
    console.log("USSSER EDIT", userEdit);
    if (!userEdit.validFirstName()) {
      _errors.first_name = <Trans t={t} i18nKey={'errors.first_name'} values={{
        min: ClassUser.MIN_LENGTH_FIRST_NAME,
        max: ClassUser.MAX_LENGTH_FIRST_NAME
      }} />;
    }
    if (!userEdit.validLastName()) {
      _errors.last_name = <Trans t={t} i18nKey={'errors.last_name'} values={{
        min: ClassUser.MIN_LENGTH_LAST_NAME,
        max: ClassUser.MAX_LENGTH_LAST_NAME
      }} />;
    }
    if (!userEdit.birthday || !(userEdit.birthday instanceof Date)) {
      _errors.birthday = t('errors.birthday');
    } else {
      if (!userEdit.validBirthday()) {
        _errors.birthday = <Trans t={t} i18nKey={'errors.birthday-not-valid'} values={{
          years: ClassUser.MIN_YEARS_OLD,
        }} />;
      }
    }
    if (userEdit.isErrorPhoneNumber(codeCountry)) {
      _errors.phone_number = t('errors.phone_number');
    }
    setErrors(_errors);
    if (Object.keys(_errors).length > 0) {
      return;
    }
    setIndex((prev) => prev + 1);
    */
  };
  const back = () => {
    setIndex((prev) => prev - 1);
  };
  return (<Stack spacing={2}>
    <Stack alignItems={'start'} spacing={1}>
      <Typography
        sx={{
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          fontWeight: 600,
          color: 'var(--font-color)',
          mb: 0.5,
          letterSpacing: '-0.01em',
        }}
      >
        {t('title-step-socials', { ns: NS_COMPLETE_PROFILE })}
      </Typography>
      <CheckboxComponent
        name={'newsletter'}
        type={'checkbox'}
        label={t('newsletter')}
        checked={userEdit?.newsletter}
        onChange={onChangeValue}
      />
      <CheckboxComponent
        name={'notif_by_email'}
        type={'checkbox'}
        label={t('notif_by_email')}
        checked={userEdit?.notif_by_email}
        onChange={onChangeValue}
      />
      <CheckboxComponent
        name={'okay_whatsapp'}
        disabled={!userEdit?.phone_number || userEdit?.phone_number === ''}
        type={'checkbox'}
        label={t('okay_whatsapp')}
        checked={(!userEdit?.phone_number || userEdit?.phone_number === '') ? false : userEdit?.okay_whatsapp}
        onChange={onChangeValue}
      />
      {(!userEdit?.phone_number || userEdit?.phone_number === '') && (
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: -0.5, ml: 1 }}>
          <Typography
            variant="body2"
            component="span"
            sx={{
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              color: 'var(--error)',
              fontWeight: 600,
            }}
          >
            *
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              color: 'var(--grey)',
              fontStyle: 'italic',
            }}
          >
            {t('phone-required-for-whatsapp', { ns: NS_COMPLETE_PROFILE })}
          </Typography>
        </Stack>
      )}
    </Stack>
    <Stack spacing={2} sx={{ width: '100%', pb: 3, }}>
      <ProgressComponent length={length} index={index} />
      <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} sx={{ background: '', width: '100%' }} spacing={1}>
        <ButtonCancel
          //disabled={isFirst || processing} 
          onClick={back} size="large" label={textBack} sx={{ width: { xs: '100%', sm: '50%' } }} />
        <ButtonConfirm
          loading={processing}
          //disabled={!userEdit?.first_name || !userEdit?.last_name || !userEdit?.birthday || Object.keys(errors).length > 0}
          onClick={next}
          size="large"
          label={textNext}
          sx={{ width: { xs: '100%', sm: '50%' } }} />
      </Stack>
    </Stack>
  </Stack>)
}
export default function CompleteProfileComponent() {
  const { t } = useTranslation([NS_COMPLETE_PROFILE]);
  const [index, setIndex] = useState(0);
  const { user } = useAuth();
  const [userEdit, setUserEdit] = useState(null);
  const [files, setFiles] = useState([]);
  const textBack = t('btn-back');
  const textNext = t('btn-next');
  const textJoin = t('btn-join-app');
  const SLIDES_LENGTH = 3;

  const SLIDES = [
    <SlideInfos key={`slide-1`} length={SLIDES_LENGTH} index={index} textNext={textNext} user={user} userEdit={userEdit} setIndex={setIndex} setUserEdit={setUserEdit} />,
    <SlidePhoto key={`slide-2`} length={SLIDES_LENGTH} index={index} textBack={textBack} textNext={textNext} files={files} setFiles={setFiles} user={user} userEdit={userEdit} setIndex={setIndex} setUserEdit={setUserEdit} />,
    <SlideMarketing key={`slide-3`} length={SLIDES_LENGTH} index={index} textBack={textBack} textNext={textJoin} files={files} setFiles={setFiles} user={user} userEdit={userEdit} setIndex={setIndex} setUserEdit={setUserEdit} />
  ]

  useEffect(() => {
    if (user) {
      const _user = user.clone();
      _user.update({ newsletter: true, notif_by_email: true });
      setUserEdit(_user);
    }
  }, [user]);

  return (
    <Stack justifyContent={'center'} alignItems={'center'} sx={{ background: '', px: 1, textAlign: 'center', width: '100%', height: { xs: '100%', sm: 'auto' } }}>
      <Stack spacing={2} maxWidth={'sm'} justifyContent={'center'} sx={{ background: 'var(--card-color)', py: { xs: 2, sm: 1.5 }, px: 2, borderRadius: '10px' }}>
        <Stack alignItems={'center'} sx={{ width: '100%', mb: 1 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              fontWeight: 700,
              color: 'var(--font-color)',
              textAlign: 'center',
              lineHeight: 1.3,
              mb: { xs: 1, sm: 1.5 },
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, var(--font-color) 0%, var(--primary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t(`title`)}
          </Typography>
          <Box sx={{ maxWidth: { xs: '100%', sm: '85%' }, px: { xs: 1, sm: 0 } }}>
            <Typography 
              sx={{ 
                color: 'var(--grey-light)', 
                fontSize: { xs: '0.9rem', sm: '1rem' },
                lineHeight: 1.7,
                textAlign: 'center',
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}
            >
              {t(`subtitle`)}
            </Typography>
          </Box>
        </Stack>
        <Container sx={{ background: '' }}>
          {
            SLIDES.map((s, i) => {
              return (<div key={`slide-${i}`}>
                {i === index && s}
              </div>)
            })
          }
        </Container>
      </Stack>
    </Stack>
  );
}
