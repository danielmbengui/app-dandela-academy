"use client"
import React, { useState } from "react";
import { ClassUser } from "@/classes/users/ClassUser";
import FieldDA from "@/components/shared/inputs/FieldDA";
import SelectDA from "@/components/shared/inputs/SelectDA";
import { ClassCountry } from "@/classes/ClassCountry";
import CheckboxComponentDA from "@/components/shared/inputs/CheckboxComponentDA";
import { CircularProgress, Stack, Typography } from "@mui/material";
import ButtonNextDA from "@/components/shared/inputs/ButtonNextDA";
import { getExampleFor, isValidEmail, isValidPhoneNumber, translateWithVars } from "@/libs/functions";
import { Trans, useTranslation } from "react-i18next";
import { NS_BUTTONS, NS_CONTACT, NS_WAITING_LIST } from "@/libs/i18n/settings";
import axios from "axios";
import { API_EMAIL_ADMIN_CONTACT, API_EMAIL_CONTACT } from "@/libs/constants/constants_api";

const CONTACT_TYPES = [
  "program", // apropos du programme
  "pedagogy", // a propos du suivi pedagogique
  "support", // support technique
  "billing",
  "b2b", // Partenariats, sponosring, etc.
  "trainer", // devenir formateur
  "press", // médias, revue de presse
  "events", // évenements
  "feedback", // retour tehnique
  "privacy",
  "careers", // carrière chez dandela
  "other", // autre
]

function StepSuccess() {
  const { t } = useTranslation([NS_CONTACT, NS_WAITING_LIST, NS_BUTTONS]);
  const success = t('success', { returnObjects: true });
  const { title } = success;
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
          <h2 className="text-2xl font-bold text-blue-900 mb-2">{title}</h2>
          <p className="text-gray-600">
            <Trans
              //className="text-gray-600"
              i18nKey={`${NS_CONTACT}:success:subtitle`}
              //values={{ email: user?.email }}
              components={{ strong: <strong /> }}
            />
          </p>
        </div>
      </section>
    </main>
  </div>);
}

const ContactFormOB = () => {
  const { t } = useTranslation([NS_CONTACT]);
  const minCharName = ClassUser.MIN_LENGTH_FIRST_NAME;
  const maxCharName = ClassUser.MAX_LENGTH_FIRST_NAME; + ClassUser.MAX_LENGTH_LAST_NAME;
  const minCharMessage = 10;
  const maxCharMessage = 1_000;
  const title = t('title');
  const subtitle = t('subtitle');
  const loading = t('loading');
  const formTranslate = t('form', { returnObjects: true });
  const typesTranslate = t('types', { returnObjects: true });
  const { type: type_t, name: name_t, email: email_t, phone: phone_t, ['ok-whatsapp']: okay_whatsapp_t, message: message_t, send: send_t, errors: errors_t } = formTranslate;
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    prefixe: ClassCountry.DEFAULT_PREFIXE,
    phone: "",
    code: ClassCountry.DEFAULT_CODE,
    phone_number: "",
    okay_whatsapp: false,
    type: "",
    message: "",
    disabled: true,
  });

  const [errors, setErrors] = useState({});
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    form[name] = type === 'checkbox' ? checked :
      value;
    setForm(prev => ({ ...prev, [name]: form[name], disabled: Object.values(form).filter(item => typeof item === 'string' && item === "").length > 1 }));
    setErrors(prev => ({ ...prev, [name]: '', _form: '' }));
  };
  const validateForm = (e) => {
    e.preventDefault();
    const { name: error_name, email: error_email, phone: error_phone, type: error_type, message: error_message, main: error_main } = errors_t;
    const error_name_t = translateWithVars(error_name, { min: minCharName, max: maxCharName });
    const error_phone_t = getExampleFor(form.code);
    const error_message_t = translateWithVars(error_message, { min: minCharMessage, max: maxCharMessage });
    const error = {};
    const { name, email, prefixe, phone, code, type, message } = form;
    const phone_number = `${prefixe}${phone}`;
    if (name.length < minCharName || name.length > maxCharName) error.name = error_name_t;
    if (!isValidEmail(email)) error.email = error_email;
    if (phone.length > 0 && !isValidPhoneNumber(phone_number, code)) error.phone = `${error_phone} (Ex: ${error_phone_t.formatInternational()})`;
    if (!CONTACT_TYPES.includes(type)) error.type = error_type;
    if (message.length < minCharMessage || message.length > maxCharMessage) error.message = error_message_t;
    const count = Object.keys(error).length;
    if (count > 0) error._form = error_main;
    setErrors(error);
    return count === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const error = {};
    try {
      setSubmitting(true);
      if (!validateForm()) return;
      // if (!await user.alreadyExist()) throw new Error('no exist');
      //console.log("OKKKAY");
      const phone_number = form.phone.length>0 ? `${form.prefixe}${form.phone}` : '';
      const dataSend = {
        name: form.name,
        email: form.email,
        //prefixe: ClassCountry.DEFAULT_PREFIXE,
        phone_number: phone_number,
        //code: ClassCountry.DEFAULT_CODE,
        okay_whatsapp: phone_number ? form.okay_whatsapp : false,
        type: form.type,
        message: form.message,
        //lang: lang
      }
      const [adminRes,userRes] = await Promise.allSettled([
        axios.post(API_EMAIL_ADMIN_CONTACT, dataSend, { timeout: 10000 }),
        axios.post(API_EMAIL_CONTACT, dataSend, { timeout: 10000 }),
      ]);
      if(adminRes.status === "fulfilled") {
        setSubmitted(true);
      }
      // adminRes.status === "rejected" -> log seulement
      //const resultAdmin = await axios.post(API_EMAIL_CONTACT, dataSend);
    } catch (error) {
      setErrors(prev => ({ ...prev, _form: error.message }));
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <section>
      <div className="container pb-100px">
        <form
          className="p-5 md:p-50px md:pt-20px md:pb-20px border border-borderColor2 dark:border-transparent dark:shadow-container"
          data-aos="fade-up"
          onSubmit={onSubmit}
        >
          {
            !submitted && <>
              {
                !submitting && <Stack>
                  {/* heading  */}
                  <div className="mb-5">
                    <h5
                      className="text-size-23 md:text-size-44 font-bold leading-10 md:leading-50px text-blackColor dark:text-blackColor-dark"
                      data-aos="fade-up"
                    >
                      {title}
                    </h5>
                    <p
                      data-aos="fade-up"
                      className="text-size-13 md:text-base leading-5 md:leading-30px text-contentColor dark:text-contentColor-dark"
                    >
                      {subtitle}
                    </p>
                  </div>
                  <div data-aos="fade-up" className="grid grid-cols-1 xl:grid-cols-2 mb-30px gap-25px">
                    <FieldDA
                      label={`${name_t}*`}
                      name={`name`}
                      value={form.name}
                      icon={<i className="text-primaryColor icofont-businessman"></i>}
                      placeholder={`Ex: John MATONDO`}
                      onChange={onChange}
                      onClear={() => {
                        setForm(prev => ({ ...prev, name: '' }));
                        setErrors(prev => ({ ...prev, name: '', _form: '' }));
                      }}
                      error={errors.name}
                      fullWidth={true}
                      disabled={submitting}
                    />
                    <FieldDA
                      label={`${email_t}*`}
                      name={'email'}
                      type={'email'}
                      icon={<i className="text-primaryColor icofont-envelope"></i>}
                      value={form.email}
                      //placeholder={`Ex: John MATONDO`}
                      onChange={onChange}
                      onClear={() => {
                        setForm(prev => ({ ...prev, email: '' }));
                        setErrors(prev => ({ ...prev, email: '', _form: '' }));
                      }}
                      error={errors.email}
                      fullWidth={true}
                      disabled={submitting}
                    //placeholder={`Ex: John MATONDO`}
                    />
                    <FieldDA
                      label={phone_t}
                      type={'phone'}
                      icon={<i className="text-primaryColor icofont-envelope"></i>}
                      fullWidth={true}
                      prefixe={form.prefixe}
                      phone={form.phone}
                      codeCountry={form.code}
                      setPrefixe={(_prefixe) => {
                        onChange({
                          target: {
                            type: "select",
                            name: 'prefixe',
                            value: _prefixe // ici on repasse en string
                          }
                        });
                      }}
                      setPhone={(_phone) => {
                        onChange({
                          target: {
                            type: "text",
                            name: 'phone',
                            value: _phone // ici on repasse en string
                          }
                        });
                      }}
                      setCodeCountry={(_code) => {
                        console.log('CODe countr', _code)
                        onChange({
                          target: {
                            type: "select",
                            name: 'code',
                            value: _code // ici on repasse en string
                          }
                        });
                      }}
                      onClear={() => {
                        setForm(prev => ({ ...prev, phone: '' }));
                        setErrors(prev => ({ ...prev, phone: '', _form: '' }));
                      }}
                      error={errors.phone}
                      disabled={submitting}
                    //placeholder={`Ex: John MATONDO`}
                    />
                    <Stack justifyContent={errors.phone ? 'center' : 'end'}>
                      <CheckboxComponentDA
                        label={okay_whatsapp_t}
                        name={'okay_whatsapp'}
                        checked={form.okay_whatsapp}
                        onChange={onChange}
                        disabled={submitting || !form.phone}
                      />
                    </Stack>
                    <SelectDA
                      label={`${type_t}*`}
                      name={'type'}
                      value={form.type}
                      values={CONTACT_TYPES.map(type => ({ id: type, value: typesTranslate[type] }))}
                      onChange={onChange}
                      disabled={submitting}
                      error={errors.type}
                    />
                  </div>
                  <div className="relative" data-aos="fade-up">
                    <FieldDA
                      label={`${message_t}*`}
                      name={`message`}
                      type={'multiline'}
                      icon={<i className="text-primaryColor icofont-pen-alt-2"></i>}
                      minRows={10}
                      maxRows={10}
                      //placeholder={`Ex: John MATONDO`}
                      value={form.message}
                      //placeholder={`Ex: John MATONDO`}
                      onChange={onChange}
                      onClear={() => {
                        setForm(prev => ({ ...prev, message: '' }));
                        setErrors(prev => ({ ...prev, message: '', _form: '' }));
                      }}
                      error={errors.message}
                      fullWidth={true}
                      disabled={submitting}
                    />
                  </div>
                  {
                    errors._form && <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
                      <p className="text-sm text-red-700">{errors._form}</p>
                    </div>
                  }
                  <div className="mt-30px" data-aos="fade-up">
                    <ButtonNextDA
                      label={send_t}
                      disabled={form.disabled || submitting}
                      loading={submitting}
                    //  onClick={validateForm}
                    type={"submit"}
                    //disabled={form.disabled}
                    />
                  </div>
                </Stack>
              }
              {
                submitting && <Stack alignItems={'center'}>
                  <CircularProgress />
                  <Typography>{loading}</Typography>
                </Stack>
              }
            </>
          }
          {
            submitted && <StepSuccess />
          }
        </form>
      </div>
    </section>
  );
};

export default ContactFormOB;
