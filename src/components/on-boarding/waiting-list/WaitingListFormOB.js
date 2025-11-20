import React, { useEffect, useMemo, useState } from "react";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { NS_BUTTONS, NS_COMMON, NS_ERRORS, NS_FORM, NS_HOW_KNOW, NS_LEVELS, NS_LOGIN, NS_ROLES, NS_WAITING_LIST } from "@/libs/i18n/settings";
import { CircularProgress, Stack} from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { getExampleFor, getFormattedDate, isValidDate, translateWithVars } from "@/libs/functions";
import { useRouter } from "next/navigation";
import FieldComponent from "@/components/elements/FieldComponent";
import ButtonNextComponent from "@/components/elements/ButtonNextComponent";
import CheckboxComponent from "@/components/elements/CheckboxComponent";
import SelectComponent from "@/components/elements/SelectComponent";
import ButtonBackComponent from "@/components/elements/ButtonBackComponent";
import { useLanguage } from "@/contexts/LangProvider";
import { ClassCountry } from "@/classes/ClassCountry";
import { ClassUserWaitingList } from "@/classes/users/ClassUser";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { API_EMAIL_ADMIN_NEW_WAITING_LIST, API_EMAIL_WAITING_LIST } from "@/libs/constants/constants_api";

function Stepper({ currentStep }) {
  const { t } = useTranslation([NS_WAITING_LIST]);
  const ARRAY_TITLES = [
    t(`step-identity-title`),
    t(`step-profile-title`),
    t(`step-details-title`),
    t(`step-validation-title`),
  ];
  const stepStatus = (step) =>
    step === currentStep ? 'active' : step < currentStep ? 'completed' : 'inactive';
  const stepIconClass = (state) =>
    state === 'active' || state === 'completed'
      ? 'bg-primaryColor text-white'
      : 'bg-gray-200 text-gray-500';
  return (<div>
    <div className="flex justify-start items-start">
      {ARRAY_TITLES.map((title, i) => {
        const st = stepStatus(i + 1);
        return (
          <div key={`${title}-${i}`} className="relative flex-1 flex flex-col items-center">
            {i !== 0 && (
              <span
                className={`absolute w-full h-0.5 right-1/2 top-[15px] -translate-y-1/2 ${st === 'active' || st === 'completed' ? 'bg-primaryColor' : 'bg-gray-200'
                  }`}
              />
            )}
            <div
              className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm font-semibold z-10 ${stepIconClass(
                st
              )}`}
            >
              {i + 1}
            </div>
            <div className="text-xs mt-2 font-medium">
              {title}
            </div>
          </div>
        );
      })}
    </div>
  </div>)
}
function Step1({ setCurrentStep, user = {}, errors, setErrors, setUser, onChange }) {
  const { t } = useTranslation([NS_WAITING_LIST, NS_BUTTONS, NS_ERRORS]);
  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
    if (!user.last_name || !user.first_name || !user.email || !user.birthday) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [user.last_name, user.first_name, user.email, user.birthday]);
  const validateStep = async () => {
    const error = {};
    if (!user.validLastName()) error.last_name = translateWithVars(t(`${NS_ERRORS}:last-name`), { min: ClassUserWaitingList.MIN_LENGTH_LAST_NAME, max: ClassUserWaitingList.MAX_LENGTH_LAST_NAME });
    if (!user.validFirstName()) error.first_name = translateWithVars(t(`${NS_ERRORS}:first-name`), { min: ClassUserWaitingList.MIN_LENGTH_FIRST_NAME, max: ClassUserWaitingList.MAX_LENGTH_FIRST_NAME });
    if (!user.validEmail()) error.email = t(`${NS_ERRORS}:email`);
    if (!user.birthday || !(new Date(user.birthday))) {
      error.birthday = t(`${NS_ERRORS}:select-birthday`);
    } else if (!user.validBirthday()) {
      error.birthday = translateWithVars(t(`${NS_ERRORS}:birthday`), { year: ClassUserWaitingList.MIN_YEARS_OLD });
    }
    setErrors(error);
    return Object.keys(error).length === 0;
  };
  const goToNextStep = async () => {
    if (await validateStep()) setCurrentStep(prev => prev + 1);
  };
  return (<div>
    <h2 className="text-xl font-semibold text-blue-900 mb-6">{t(`${NS_WAITING_LIST}:step-identity-subtitle`)}</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-15px">
      <FieldComponent
        label={`${t(`${NS_WAITING_LIST}:firstname`)} *`}
        name="first_name"
        value={user.first_name}
        onChange={onChange}
        placeholder={`Ex : John`}
        onClear={() => {
          user.update({ first_name: "" });
          //setUser(user.clone());
          setErrors(prev => ({ ...prev, first_name: '' }));
        }}
        error={errors.first_name}

      //inputClass={inputBase}
      />
      <FieldComponent
        label={`${t(`${NS_WAITING_LIST}:lastname`)} *`}
        name="last_name"
        placeholder={`Ex : MATONDO`}
        value={user.last_name}
        onChange={onChange}
        onClear={() => {
          user.update({ last_name: "" });
          //setUser(user.clone());
          setErrors(prev => ({ ...prev, last_name: '' }));
        }}
        error={errors.last_name}
      //inputClass={inputBase}
      />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-1 lg:gap-x-30px gap-y-25px mb-15px">
      <FieldComponent
        label={`${t(`${NS_WAITING_LIST}:email`)} *`}
        type="email"
        name="email"
        value={user.email}
        onChange={onChange}
        onClear={() => {
          user.update({ email: "" });
          //setUser(user.clone());
          setErrors(prev => ({ ...prev, email: '' }));
        }}
        error={errors.email}
      />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-1 lg:gap-x-30px gap-y-25px mb-15px">
      <FieldComponent
        label={`${t(`${NS_WAITING_LIST}:birthday`)} *`}
        type="date"
        name="birthday"
        value={user.birthday}
        onChange={onChange}
        //inputClass={inputBase}
        onClear={() => {
          //user.update({ email: "" });
          //setUser(user.clone());
        }}
        error={errors.birthday}
      />
    </div>
    <div className="mt-8 flex justify-end">
      <ButtonNextComponent
        label={t(`${NS_BUTTONS}:next`)}
        onClick={goToNextStep}
        disabled={isDisabled}
      />
    </div>
  </div>)
}
function Step2({ setCurrentStep, user, setUser, backStep, onChange, errors, setErrors }) {
  const { t } = useTranslation([NS_WAITING_LIST, NS_BUTTONS, NS_ERRORS, NS_HOW_KNOW, NS_ROLES, NS_FORM, NS_LEVELS]);
  const listAllKnows = ClassUserWaitingList.ALL_HOW_KNOWS;
  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
    if (!user.type || !user.level || !user.goals || !user.how_know || user.how_know === ClassUserWaitingList.HOW_KNOW.OTHER && !user.how_know_text) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [user.type, user.level, user.goals, user.how_know, user.how_know_text]);
  const validateStep = () => {
    const error = {};
    if (!user.validRole()) error.role = t(`${NS_ERRORS}:type`);
    if (!user.validGoals()) error.goals = translateWithVars(t(`${NS_ERRORS}:goals`), { min: ClassUserWaitingList.MIN_LENGTH_GOALS, max: ClassUserWaitingList.MAX_LENGTH_GOALS });
    if (user.isErrorHowKnow()) {
      error.how_know = t(`${NS_ERRORS}:select-option`)
    } else if (!user.validHowKnow()) error.how_know_text = translateWithVars(t(`${NS_ERRORS}:how-know`), { min: ClassUserWaitingList.MIN_LENGTH_HOW_KNOW_TEXT, max: ClassUserWaitingList.MAX_LENGTH_HOW_KNOW_TEXT });
    //console.log("ERRRORS", error)
    setErrors(error);
    return Object.keys(error).length === 0;
  };
  const goToNextStep = () => {
    //e.preventDefault();
    if (validateStep()) setCurrentStep(prev => prev + 1);
  };
  return (<div>
    <h2 className="text-xl font-semibold text-blue-900 mb-6">{t(`${NS_WAITING_LIST}:step-profile-subtitle`)}</h2>
    {/* type & level */}
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-15px">
      <SelectComponent
        label={t(`${NS_FORM}:type`)}
        name='role'
        value={user.role}
        values={ClassUserWaitingList.ALL_ROLES.map(item => ({ id: item, value: t(`${NS_ROLES}:${item}`) }))}
        onChange={(e) => {
          const { value } = e.target;
          user.update({ role: value });
          //setUser(user.clone());
          setErrors(prev => ({ ...prev, role: '' }));
          console.log("VALUE select type", value);
        }}
        error={errors.role}
      />
      <SelectComponent
        label={t(`${NS_FORM}:level`)}
        name='level'
        value={user.level}
        values={ClassUserWaitingList.ALL_LEVELS.map(item => ({ id: item, value: t(`${NS_LEVELS}:${item}`) }))}
        onChange={(e) => {
          const { value } = e.target;
          //user.level = value;
          user.update({ level: value });
          //setUser(user.clone());
          setErrors(prev => ({ ...prev, level: '' }));
          console.log("VALUE select level", value);
        }}
        error={errors.level}
      />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-1 lg:gap-x-30px gap-y-25px mb-15px">
      <FieldComponent
        type={'multiline'}
        label={`${t(`${NS_WAITING_LIST}:goals`)}*`}
        onClear={() => {
          //user.goals = '';
          //setUser(user.clone());
          user.update({ goals: '' });
          setErrors(prev => ({ ...prev, goals: '' }))
        }}
        name="goals"
        //type="text"
        value={user.goals}
        onChange={onChange}
        //placeholder="Ex: Excel, React, IA débutant..."
        //inputClass={inputBase}
        fullWidth={true}
        minRows={5}
        maxRows={10}
        error={errors.goals}
      />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-1 lg:gap-x-30px gap-y-25px mb-15px">

      <Stack spacing={0.5}>
        <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
          {t(`${NS_WAITING_LIST}:how-know`)}{` *`}
        </label>
        {
          listAllKnows.map((item, i) => {
            return (<div key={`${item}-${i}`}>
              <CheckboxComponent
                //type={'checkbox'}
                name={item}
                checked={user.how_know.startsWith(item)}
                onChange={() => {
                  if (item !== ClassUserWaitingList.HOW_KNOW.OTHER) {
                    user.update({ how_know_text: '' });
                    //setUser(user.clone());
                    setErrors(prev => ({ ...prev, how_know_text: '' }))
                  }
                  onChange({
                    target: {
                      type: "text",
                      name: "how_know",
                      value: item // ici on repasse en string
                    }
                  });
                }}
                label={t(`${NS_HOW_KNOW}:${item}`)}
              />
            </div>)
          })
        }
        {
          user.how_know.startsWith(ClassUserWaitingList.HOW_KNOW.OTHER) && <FieldComponent
            //label={`${t(`${NS_SIGN_UP}:birthday`)} *`}
            //type="text"
            name="how_know_text"
            value={user.how_know_text}
            onChange={onChange}
            //inputClass={inputBase}
            onClear={() => {
              user.update({ how_know_text: '' });
              //setUser(user.clone());
              setErrors(prev => ({ ...prev, how_know_text: '' }));
            }}
            error={errors.how_know_text}
          />
        }
        {errors.how_know && <p className="text-red-500 text-sm mt-1">{errors.how_know}</p>}

      </Stack>
    </div>
    <div className="mt-8 flex justify-between">
      <ButtonBackComponent
        label={t(`${NS_BUTTONS}:previous`)}
        onClick={() => backStep()}
      />
      <ButtonNextComponent
        label={t(`${NS_BUTTONS}:next`)}
        onClick={goToNextStep}
        disabled={isDisabled}
      />
    </div>
  </div>)
}
function Step3({ setCurrentStep, user, setUser, backStep, onChange, errors, setErrors }) {
  const { t } = useTranslation([NS_WAITING_LIST, NS_BUTTONS, NS_ERRORS]);
  const [prefixe, setPrefixe] = useState(ClassCountry.DEFAULT_PREFIXE);
  const [phone, setPhone] = useState("");
  const [codeCountry, setCodeCountry] = useState(ClassCountry.DEFAULT_CODE);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [exampleFor, setExampleFor] = useState(getExampleFor(codeCountry.toUpperCase(), 'mobile'));
  useEffect(() => {
    setExampleFor(getExampleFor(codeCountry.toUpperCase(), 'mobile'));
  }, [codeCountry]);
  //formatNational
  const validateStep = () => {
    const error = {};
    const _phone = getExampleFor(codeCountry.toUpperCase(), 'mobile');
    //phone.formatInternational()
    console.log("PHHHHHONNE", exampleFor.formatInternational());
    if (user.isErrorPhoneNumber(codeCountry)) error.phone_number = `${t(`${NS_ERRORS}:phone`)} (ex: ${exampleFor.formatInternational()})`;
    console.log("ERRRORS", error)
    setErrors(error);
    return Object.keys(error).length === 0;
  };
  const goToNextStep = () => {
    if (validateStep()) setCurrentStep(prev => prev + 1);
  };
  return (<div>
    <h2 className="text-xl font-semibold text-blue-900 mb-6">{t(`${NS_WAITING_LIST}:step-details-subtitle`)}</h2>

    <div className="space-y-4">
      <FieldComponent
        label={`${t(`${NS_WAITING_LIST}:phone`)}`}
        name="phone_number"
        type="phone"
        value={user.phone_number}
        onChange={(e) => {
          const { value } = e.target;
          if (value) {
            setShowWhatsApp(true);
          } else {
            setShowWhatsApp(false);
            user.update({ okay_whatsapp: false });
            //setUser(user.clone());
          }
          onChange(e);
        }}
        onClear={() => {
          setPhone('');
          user.update({ phone_number: "", okay_whatsapp: false });
          //setUser(user.clone());
          setShowWhatsApp(false);
          setErrors(prev => ({ ...prev, phone_number: '' }))
        }}
        error={errors.phone_number}
        fullWidth={true}
        placeholder={exampleFor.formatNational()}
        //inputClass={inputBase}
        prefixe={prefixe}
        setPrefixe={setPrefixe}
        phone={phone}
        setPhone={setPhone}
        codeCountry={codeCountry}
        setCodeCountry={setCodeCountry}
      />
      <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} alignItems={'center'}>
        {
          showWhatsApp && <CheckboxComponent
            name="okay_whatsapp"
            checked={user.okay_whatsapp}
            onChange={onChange}
            label={t(`${NS_WAITING_LIST}:ok-whastapp`)}
          />
        }
        <CheckboxComponent
          name="okay_newsletter"
          checked={user.okay_newsletter}
          onChange={onChange}
          label={t(`${NS_WAITING_LIST}:newsletter`)}
        />
      </Stack>
    </div>

    <div className="mt-8 flex justify-between">
      <ButtonBackComponent
        label={t(`${NS_BUTTONS}:previous`)}
        onClick={() => backStep()}
      />
      <ButtonNextComponent
        label={t(`${NS_BUTTONS}:next`)}
        onClick={goToNextStep}
      />
    </div>
  </div>)
}
function Step4({ submitting, user, backStep, onChange, errors }) {
  const { lang } = useLanguage();
  const { t } = useTranslation([NS_LOGIN, NS_WAITING_LIST, NS_BUTTONS, NS_COMMON, NS_ERRORS, NS_LEVELS, NS_ROLES, NS_HOW_KNOW]);
  const { title, subtitle, login, accept, terms, privacy } = t(`${NS_LOGIN}:signup`, { returnObjects: true });
  const summary = useMemo(() => buildSummary({ user }), [user]);

  function buildSummary({ user = null }) {
    //const {t} = useTranslation();
    const rows = [];
    const push = (label, value) => value && rows.push({ label, value });

    push(t(`${NS_WAITING_LIST}:firstname`), user.first_name);
    push(t(`${NS_WAITING_LIST}:lastname`), user.last_name.toUpperCase());
    push(t(`${NS_WAITING_LIST}:email`), user.email);
    push(t(`${NS_WAITING_LIST}:type`), t(`${NS_ROLES}:${user.role}`));
    push(t(`${NS_WAITING_LIST}:phone`), user.phone_number);
    push(t(`${NS_WAITING_LIST}:birthday`), getFormattedDate(user.birthday, lang));
    //push('Adresse', f.addressLine1);
    //push('Adresse (suite)', f.addressLine2);
    //push('Ville', f.city);
    //push('Région/État', f.stateRegion);
    //push('Code postal', f.postalCode);
    //push('Pays', f.country);
    //push('Langue préférée',f.preferredLanguage === 'fr' ? 'Français (FR)' : f.preferredLanguage === 'en' ? 'Anglais (EN)' : 'Portugais (PT-AO)');
    push(
      t(`${NS_WAITING_LIST}:level`),
      t(`${NS_LEVELS}:${user.level}`),
    );
    push(t(`${NS_WAITING_LIST}:goals`), user.goals);
    push(t(`${NS_WAITING_LIST}:how-know`), user.isOtherHowKnow() ? user.how_know_text : t(`${NS_HOW_KNOW}:${user.how_know}`));
    push(t(`${NS_WAITING_LIST}:ok-whastapp`), !user.phone_number ? '' : user.okay_whatsapp ? t(`${NS_COMMON}:yes`) : t(`${NS_COMMON}:no`));
    push(t(`${NS_WAITING_LIST}:newsletter`), user.okay_newsletter ? t(`${NS_COMMON}:yes`) : t(`${NS_COMMON}:no`));

    return rows;
  }
  return (<div>
    {
      !submitting && <div>
        <h2 className="text-xl font-semibold text-blue-900 mb-6">{t(`${NS_WAITING_LIST}:step-validation-subtitle`)}</h2>
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="font-medium text-gray-800 mb-2">{t(`${NS_WAITING_LIST}:resume`)}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            {summary.map((row) => (
              <p key={row.label}>
                <strong>{row.label} : </strong>{row.value}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-start gap-3">
            <CheckboxComponent
              //name="okay_other_news"
              //checked={user.okay_other_news}
              //onChange={onChange}
              //label={`${t(`${NS_WAITING_LIST}:accept-conditions`)} *`}
              label={`${t(`${NS_WAITING_LIST}:accept-conditions`)}*`}
              name={'okay_other_news'}
              checked={user.okay_other_news}
              onChange={onChange}
            />
          </div>
          {errors.okay_other_news && <p className="text-red-500 text-sm mt-1">{errors.okay_other_news}</p>}
        </div>
      </div>
    }
    {

      submitting && <Stack alignItems={'center'} justifyContent={'center'} sx={{ background: '', height: '100%', minHeight: '250px' }}>
        <CircularProgress size={'30px'} />
        <span>{`${t(`${NS_COMMON}:loading`)}`}</span>
      </Stack>

    }

    <div className="mb-6 bg-gray-100 p-4 rounded-md" style={{ display: 'none' }}>
      <div className="text-sm text-gray-600">CAPTCHA placeholder (non configuré)</div>
    </div>
    {
      errors._form && <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
        <p className="text-sm text-red-700">{errors._form}</p>
      </div>
    }
    <div className="mt-8 flex justify-between">
      <ButtonBackComponent
        onClick={() => backStep()}
        disabled={submitting}
        label={t(`${NS_BUTTONS}:previous`)}
      />
      <ButtonNextComponent
        type="submit"
        disabled={!user.okay_other_news || submitting}
        label={submitting ? t(`${NS_BUTTONS}:sending`) : t(`${NS_BUTTONS}:confirm`)}
      //onClick={validateStep3}
      />
    </div>
  </div>);
}
function StepSuccess({ user }) {
  const { t } = useTranslation([NS_WAITING_LIST, NS_BUTTONS])
  function WhatsAppButton() {
    const encodedText = encodeURIComponent(`${t(`${NS_WAITING_LIST}:share-text`)}\n${process.env.NEXT_PUBLIC_WESITE_LINK}`);
    const href = `https://api.whatsapp.com/send?text=${encodedText}`;

    return (<>
      <a
        href={href}
        target="_blank"
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <FaWhatsapp className="mr-1" /> {translateWithVars(t(`${NS_BUTTONS}:share-to`), { text: "WhatsApp" })}
      </a>
    </>);
  }
  function TwitterButton() {
    //const encodedText = encodeURIComponent(`${t(`${NS_WAITING_LIST}:share-text`)}\n${process.env.NEXT_PUBLIC_WESITE_LINK}`);
    //const href = `https://api.whatsapp.com/send?text=${encodedText}`;
    const href = `https://twitter.com/intent/tweet?text=${t(`${NS_WAITING_LIST}:share-text`)}&url=${process.env.NEXT_PUBLIC_WESITE_LINK}`;

    return (<>
      <a
        href={href}
        target="_blank"
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <FaTwitter className="mr-1" /> {translateWithVars(t(`${NS_BUTTONS}:share-to`), { text: "Twitter" })}
      </a>
    </>);
  }
  function FacebookButton() {
    //const encodedText = encodeURIComponent(`${t(`${NS_WAITING_LIST}:share-text`)}\n${process.env.NEXT_PUBLIC_WESITE_LINK}`);
    //const href = `https://api.whatsapp.com/send?text=${encodedText}`;
    const href = `https://www.facebook.com/sharer/sharer.php?u=${process.env.NEXT_PUBLIC_WESITE_LINK}`;

    return (<>
      <a
        href={href}
        target="_blank"
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <FaFacebook className="mr-1" /> {translateWithVars(t(`${NS_BUTTONS}:share-to`), { text: "Facebook" })}
      </a>
    </>);
  }
  return (<div className="font-sans text-gray-800">
    <main className="px-4">
      <section className="max-w-2xl mx-auto">
        <div className="rounded-xl p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">{t(`${NS_WAITING_LIST}:subscribe-success-title`)}</h2>
          <p className="text-gray-600">
            <Trans
              className="text-gray-600"
              i18nKey={`${NS_WAITING_LIST}:subscribe-success-connected`}
              values={{ email: user?.email }}
              components={{ strong: <strong /> }}
            />
          </p>
          <p className="text-gray-600 mb-8">{translateWithVars(t(`${NS_WAITING_LIST}:subscribe-success-subtitle`), { email: user?.email })}</p>


          <div className="flex justify-center gap-4 flex-wrap">
            <WhatsAppButton />
            <FacebookButton />
            <TwitterButton />
            {
              /*
               
              
              */
            }
          </div>
        </div>
      </section>
    </main>
  </div>);
}

const WaitingListFormOB = () => {
  //const { login } = useAuth();
  const { lang } = useLanguage();
  const { t } = useTranslation([NS_LOGIN, NS_FORM, NS_BUTTONS, NS_COMMON, NS_ERRORS]);

  const { theme } = useThemeMode();
  const { primary } = theme.palette;
  const [user, setUser] = useState(new ClassUserWaitingList());
  //const { title, subtitle, signup } = t(`login`, { returnObjects: true });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const loginLabel = t(`${NS_BUTTONS}:connect`);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    user.update({
      preferred_language: lang
    });
    //setUser(user.clone());
  }, [lang])

  const validateStep = () => {
    const error = {};
    if (!user.okay_other_news) error.okay_other_news = t(`${NS_ERRORS}:accept-conditions`);
    setErrors(prev => ({ ...prev, ...error }));
    return Object.keys(error).length === 0;
  };

  const backStep = () => {
    setCurrentStep(prev => prev - 1);
  }

  const onChange = (e) => {
    //console.log("OBBBBJ", e)
    const { name, value, type, checked } = e.target;
    //const _user_json = ClassUser.makeUserInstance('', user.toJSON());
    user.update({
      [name]: type === 'checkbox' ? checked :
        type === 'date' ? (value && isValidDate(new Date(value)) ? new Date(value) : null) :
          value
    });
    //user.update(_user_json);
    console.log("VALUE", name, type, value, checked);
    console.log("USER", user);
    //setUser(_user_json);
    setErrors(prev => ({ ...prev, [name]: '', _form: '' }));
    //setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };
  async function onSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (!validateStep()) return;
      const exists = await user.alreadyExist();
      if (exists) throw new Error(translateWithVars(t(`${NS_ERRORS}:form`), { email: user.email }));
      //console.log("OOOOOKAY")
      const resultUser = await ClassUserWaitingList.create(user);
      console.log("RESSSSULT", resultUser);
      setSubmitted(true);
      const common = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        lang,
      };
      const result = await axios.post(API_EMAIL_WAITING_LIST, {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        lang: lang,
      });

      const admin = {
        ...common,
        birthday: getFormattedDate(user.birthday, lang),
        role: user.role,
        level: user.level,
        goals: user.goals,
        how_know: user.how_know,
        how_know_text: user.how_know_text,
        phone_number: user.phone_number,
        okay_whatsapp: user.okay_whatsapp,
        okay_newsletter: user.okay_newsletter,
      };
      const [resUser, resAdmin] = await Promise.all([
        axios.post(API_EMAIL_WAITING_LIST, common, { timeout: 10000 }),
        axios.post(API_EMAIL_ADMIN_NEW_WAITING_LIST, admin, { timeout: 10000 }),
      ]);
      const resultAdmin = await axios.post(API_EMAIL_ADMIN_NEW_WAITING_LIST, {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        birthday: getFormattedDate(user.birthday, lang),
        role: user.role,
        level: user.level,
        goals: user.goals,
        how_know: user.how_know,
        how_know_text: user.how_know_text,
        phone_number: user.phone_number,
        okay_whatsapp: user.okay_whatsapp,
        okay_newsletter: user.okay_newsletter,
        lang: lang
      });
      console.log("RESULLLT", resUser.data);
      console.log("REEEESULT", result.data);
    } catch (error) {
      setErrors(prev => ({ ...prev, _form: error.message }));
      console.log("ERRROR", error.message);
    } finally {
      setSubmitting(false);
    }
    console.log("WEEESH", "fenkjhfhfdjk,df");
  }
  return (
    <div className=" opacity-100 transition-opacity duration-150 ease-linear">
      {/* heading   */}
      {
        !submitted && <div className="text-center">
          <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
            {t(`${NS_WAITING_LIST}:title`)}
          </h3>
          <p className="text-contentColor dark:text-contentColor-dark mb-15px">
            {t(`${NS_WAITING_LIST}:subtitle`)}
          </p>
        </div>
      }

      {/* counter area */}
      <div className={`py-10 ${submitted ? 'hidden' : ''}`}>
        <Stepper currentStep={currentStep} />
      </div>

      <form data-aos="fade-up" onSubmit={onSubmit}>
        {
          submitted && <StepSuccess user={user} />
        }
        {
          !submitted && <>
            {
              currentStep === 1 && <Step1 setCurrentStep={setCurrentStep} user={user} errors={errors} setErrors={setErrors} setUser={setUser} onChange={onChange} />
            }
            {
              currentStep === 2 && <Step2 setCurrentStep={setCurrentStep} backStep={backStep} user={user} errors={errors} setErrors={setErrors} setUser={setUser} onChange={onChange} />
            }
            {
              currentStep === 3 && <Step3 setCurrentStep={setCurrentStep} backStep={backStep} user={user} errors={errors} setErrors={setErrors} setUser={setUser} onChange={onChange} />
            }
            {
              currentStep === 4 && <Step4 submitting={submitting} backStep={backStep} user={user} errors={errors} onChange={onChange} />
            }
          </>
        }
      </form>
    </div>
  );
};

export default WaitingListFormOB;
