"use client";

import { Box, CircularProgress, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ButtonCancel from "../dashboard/elements/ButtonCancel";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import { useAuth } from "@/contexts/AuthProvider";
import { ClassUser } from "@/classes/users/ClassUser";
import { Trans, useTranslation } from "react-i18next";
import { NS_COMPLETE_PROFILE, NS_FIRST_CONNEXION } from "@/contexts/i18n/settings";
import ButtonImportFiles from "../elements/ButtonImportFiles";
import FieldComponent from "../elements/FieldComponent";
import { IconCamera, IconProfile } from "@/assets/icons/IconsComponent";
import { ClassFile } from "@/classes/ClassFile";
import FieldPhoneComponent from "../elements/FieldPhoneComponent";
import { ClassCountry } from "@/classes/ClassCountry";
import CheckboxComponent from "../elements/CheckboxComponent";

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
    setErrors(prev => ({ ...prev, [name]: null }));
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
function SlidePhoto({ length = 0, index = -1, textBack = "", textNext = "", files, setFiles, user = null, userEdit = null, setUserEdit = null, setIndex = null, progressComponent = <></> }) {
  const next = async () => {
    setIndex((prev) => prev + 1);
  };
  const back = () => {
    setIndex((prev) => prev - 1);
  };
  return (<Stack spacing={2}>
    <Stack alignItems={'center'} spacing={1}>
      <Stack direction={'row'} alignItems={'center'} spacing={1}>
        {
          files.length === 0 && <Box sx={{ p: 1.5, borderRadius: '50%', border: '0.1px solid var(--card-border)' }}>
            <IconProfile height={45} width={45} color="var(--grey-light)" />
          </Box>
        }
        <Box>
          {
            files.length > 0 && <Box sx={{ background: '', width: { sm: '50%' } }}>
              {
                ClassUser.createAvatarPhoto({ photo_url: URL.createObjectURL(files[0]), first_name: userEdit?.first_name, last_name: userEdit?.last_name, size: 150, fontSize: '10px' })
              }
            </Box>
          }
        </Box>
      </Stack>

      <ButtonImportFiles
        files={files} setFiles={setFiles}
        supported_files={ClassFile.SUPPORTED_IMAGES_TYPES.map(type => type.value)}
        multiple={false} />
    </Stack>
    <Stack spacing={2} sx={{ width: '100%', pb: 3, }}>
      <ProgressComponent length={length} index={index} />
      <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} sx={{ background: '', width: '100%' }} spacing={1}>
        <ButtonCancel
          //disabled={isFirst || processing} 
          onClick={back} size="large" label={textBack} sx={{ width: { xs: '100%', sm: '30%' } }} />
        <ButtonConfirm
          //loading={processing} 
          //disabled={!userEdit?.first_name || !userEdit?.last_name || !userEdit?.birthday || Object.keys(errors).length > 0}
          onClick={next}
          size="large"
          label={textNext}
          sx={{ width: { xs: '100%', sm: '30%' } }} />
      </Stack>
    </Stack>
  </Stack>)
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
      if (file) {
        const filename = file.name;
        const extension = filename.split('.').pop().toLowerCase();
        const _path = `${ClassUser.COLLECTION}/${user.uid}/profile-photo`;
        const resultFile = await ClassFile.uploadFileToFirebase({
          //id_user: user?.uid,
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
          //source_uri: this._source_uri,
        }).toJSON();
        console.log("neeeeeew file", newFile);
        urlPhoto = newFile?.uri || "";
      }
      const status = userEdit.email_verified ? ClassUser.STATUS.ONLINE : ClassUser.STATUS.MUST_ACTIVATE;
      const activated = userEdit.email_verified ? true : false;
      
      setUserEdit((prev) => {
        if (!prev || prev === null) {
          user?.update({ photo_url: urlPhoto,activated:activated, status: status });
          return user?.clone()
        }
        prev.update({ photo_url: urlPhoto,activated:activated, status: status });
        return prev.clone();
      });
      const _user = await userEdit.updateFirestore();
      setUserEdit(_user);
    } catch (error) {
      console.log("ERrror file", error)
    } finally {
      setProcessing(false);
      //console.log("neeeeeew usssssser", userEdit);
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
      <Typography>{t('title-step-socials', { ns: NS_COMPLETE_PROFILE })}</Typography>
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
    <SlideInfos length={SLIDES_LENGTH} index={index} textNext={textNext} user={user} userEdit={userEdit} setIndex={setIndex} setUserEdit={setUserEdit} />,
    <SlidePhoto length={SLIDES_LENGTH} index={index} textBack={textBack} textNext={textNext} files={files} setFiles={setFiles} user={user} userEdit={userEdit} setIndex={setIndex} setUserEdit={setUserEdit} />,
    <SlideMarketing length={SLIDES_LENGTH} index={index} textBack={textBack} textNext={textJoin} files={files} setFiles={setFiles} user={user} userEdit={userEdit} setIndex={setIndex} setUserEdit={setUserEdit} />
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
        <Stack alignItems={'center'} sx={{ width: '100%' }}>
          <h2>{t(`title`)}</h2>
          <Box sx={{ maxWidth: { sm: '70%' }, }}>
            <Typography sx={{ color: 'var(--grey-light)' }}>{t(`subtitle`)}</Typography>
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
