import React, { useState } from "react";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { NS_BUTTONS, NS_COMMON, NS_ERRORS, NS_FORM, NS_LOGIN } from "@/libs/i18n/settings";
import { Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { IconEmail } from "@/assets/icons/IconsComponent";
import { useAuth } from "@/contexts/AuthProvider";
import { isValidEmail } from "@/libs/functions";
import { useRouter } from "next/navigation";
import { PAGE_DASHBOARD_HOME, PAGE_LOGIN } from "@/libs/constants/constants_pages";
import FieldDA from "@/components/shared/inputs/FieldDA";
import { ClassUser, ClassUserAdmin, ClassUserSuperAdmin, ClassUserWaitingList } from "@/classes/users/ClassUser";

const AdminLoginForm = () => {
  const { login, user, logout } = useAuth();
  const { t } = useTranslation([NS_LOGIN, NS_FORM, NS_BUTTONS, NS_COMMON, NS_ERRORS]);
  const { theme } = useThemeMode();
  const { primary } = theme.palette;
  const { title, subtitle, signup } = t(`login`, { returnObjects: true });
  const [submitting, setSubmitting] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const emailLabel = t(`${NS_FORM}:email`);
  const passwordLabel = t(`${NS_FORM}:password`);
  const forgotPasswordLabel = t(`${NS_FORM}:forgot-password`);
  const loginLabel = t(`${NS_BUTTONS}:connect`);
  const router = useRouter();

  const validateStep = async () => {
    const error = {};
    if (!isValidEmail(email)) error.email = t(`${NS_ERRORS}:email`);
    setErrors(prev => ({ ...prev, ...error }));
    return Object.keys(error).length === 0;
  };
  const onChangeEmail = (e) => {
    const { value } = e.target;
    setEmail(value);
    setErrors(prev => ({ ...prev, email: '', _form: '' }));
  };
  const onClearEmail = (e) => {
    setEmail('');
    setErrors(prev => ({ ...prev, email: '', _form: '' }));
  };
  const onChangePassword = (e) => {
    const { name, value, type, checked } = e.target;
    setPassword(value);
    setErrors(prev => ({ ...prev, password: '', _form: '' }));
  };
  const onClearPassword = (e) => {
    setPassword('');
    setErrors(prev => ({ ...prev, password: '', _form: '' }));
  };
  async function onSubmit(e) {
    e.preventDefault();
    const error = {};
    try {
      setSubmitting(true);
      if (!validateStep()) return;
      setErrors({});
      // if (!await user.alreadyExist()) throw new Error('no exist');
      const userLogin = await ClassUser.getByEmail(email);
      console.log("result", userLogin);
      if(!userLogin) {
        throw new Error(t(`${NS_ERRORS}:invalid-credential`));
      }
      if(userLogin && (!(userLogin instanceof ClassUserSuperAdmin) && !(userLogin instanceof ClassUserAdmin))) {
        console.log("ERRRRRROR role")
        //await logout({redirect:false, redirectLink:PAGE_LOGIN});
        throw new Error(t(`${NS_ERRORS}:only-admins`));
      }
      
      const { success, error, user:userResult } = await login(email, password);
      //console.log("RESULT", success);
      if (!success) {
        //setErrors(prev => ({ ...prev, default_password: error.message }));
        throw new Error(error.message);
      } else {
        router.push(PAGE_DASHBOARD_HOME);
      }
      
    } catch (error) {
      setErrors(prev => ({ ...prev, _form: error.message }));
      console.log("ERRROR", error.message);
    } finally{
      setSubmitting(false);
    }
  }
  return (
    <div className=" opacity-100 transition-opacity duration-150 ease-linear">
      {/* heading   */}
      <div className="text-center">
        <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
          {title}
        </h3>
        <p className="text-contentColor dark:text-contentColor-dark mb-15px">
          {subtitle}
        </p>
      </div>

      <form className="pt-25px" data-aos="fade-up" onSubmit={onSubmit}>
        <div className="mb-25px">
          <FieldDA
            type={'email'}
            label={`${emailLabel}*`}
            name={'email-login'}
            icon={<IconEmail />}
            value={email}
            disabled={submitting}
            error={errors.email}
            onChange={onChangeEmail}
            onClear={onClearEmail}
          />
        </div>

        <div className="mb-25px">
          <FieldDA
            type={'password'}
            label={`${passwordLabel}*`}
            name={'password-login'}
            value={password}
            disabled={submitting}
            error={errors.password}
            onChange={onChangePassword}
            onClear={onClearPassword}
          />
        </div>
        <div className="text-contentColor dark:text-contentColor-dark flex items-center justify-between">
          <div className="flex items-center hidden">
            <input
              type="checkbox"
              id="remember"
              className="w-18px h-18px mr-2 block box-content"
            />
            <label htmlFor="remember"> Remember me</label>
          </div>
          <div className="hidden">
            <a
              href="#"
              className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
            >
              {forgotPasswordLabel}
            </a>
          </div>
        </div>
        <Stack alignItems={'center'}>
          {
            submitting && <>
              <CircularProgress size={'50px'} />
              <Typography>{t(`${NS_COMMON}:loading`)}</Typography>
            </>
          }
        </Stack>
        {
          errors._form && <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
            <p className="text-sm text-red-700">{errors._form}</p>
          </div>
        }
        <div className="my-25px text-center">
          <Button
            type="submit"
            disabled={!email || !password || submitting}
            //elevation={0}
            className="w-full hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
            variant={'contained'}
            sx={{
              py: '10px',
              px: '25px',
              bgcolor: primary.main,
              color: primary.contrastText,
              textTransform: 'none',
              fontSize: '15px',
              //border: `1px solid ${primary.main}`,
              mb: 2,
              border: '1px solid transparent',          // évite le “jump” au hover
              '&:hover': {
                //bgcolor: 'primary.dark',
                borderColor: primary.main,
              },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              },
            }}
          >
            {loginLabel}
          </Button>
          <button
            type="submit"
            variant={'contained'}
            className="hidden text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            {loginLabel}
          </button>
        </div>
        {/* other login */}
        <div>
          <p className="hidden text-contentColor dark:text-contentColor-dark text-center relative mb-15px before:w-2/5 before:h-1px before:bg-borderColor4 dark:before:bg-borderColor2-dark before:absolute before:left-0 before:top-4 after:w-2/5 after:h-1px after:bg-borderColor4 dark:after:bg-borderColor2-dark after:absolute after:right-0 after:top-4">
            or Log-in with
          </p>
        </div>
        <div className="hidden text-center flex gap-x-1 md:gap-x-15px lg:gap-x-25px gap-y-5 items-center justify-center flex-wrap">
          <button
            type="submit"
            className="text-size-15 text-whiteColor bg-primaryColor px-11 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            <i className="icofont-facebook"></i> Facebook
          </button>
          <button
            type="submit"
            className="text-size-15 text-whiteColor bg-primaryColor px-11 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            <i className="icofont-google-plus"></i> Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLoginForm;
