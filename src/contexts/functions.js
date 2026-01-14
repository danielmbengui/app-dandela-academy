import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { defaultLanguage } from "./i18n/settings";
//import allExamples from 'libphonenumber-js/examples.json'; // tous les types
import allExamples from 'libphonenumber-js/mobile/examples';
import { getExampleNumber } from 'libphonenumber-js'
import { ClassCountry } from '@/classes/ClassCountry';
import { validatePassword } from 'firebase/auth';
import { auth } from './firebase/config';

export const formatDateToRelative = (date=new Date()) => {
  if(!(date instanceof Date)) return null;
  const today = new Date();
  const timeToday = today.getTime();
  const timePast = date.getTime();
  if(timePast > timeToday) return 0;
  //const STEP_SECONDS = 60;
  const STEP_MINUTES = 60;
  const STEP_HOUR = STEP_MINUTES * 60;
  const STEP_DAY = STEP_HOUR * 24;
  const STEP_WEEK = STEP_DAY * 7;
  const STEP_MONTH = STEP_DAY * 30;
  const STEP_YEAR = STEP_DAY * 365;
  const seconds = (timeToday-timePast) / 1000;
  if (seconds < STEP_MINUTES) return `À l'instant`; // moins d'une minute
  if (seconds < STEP_HOUR) return `Moins d'une heure`; // moins d'une heure
  const _hour = parseInt(seconds / STEP_HOUR);
  if (seconds < STEP_DAY) return `Il ya ${_hour} heure(s)`; // moins de 24h
  const _day = parseInt(seconds / STEP_DAY);
  if (seconds <= STEP_DAY * 6) return `Il ya ${_day} jour(s)`; // jusqua 6j
  if (seconds < STEP_WEEK) return `Il ya moins d'une semaine`; // moins de 7j
  if (seconds <= STEP_DAY * 13) return `Il ya ${_day} jour(s)`; // jusqua 13j
  if (seconds < STEP_WEEK * 2) return `Moins de deux semaines`; // moins de deux semaines
  //if (seconds <= STEP_DAY * 20) return `Il ya ${_day} jour(s)`; // jusqau 21j
  if (seconds < STEP_WEEK * 3) return `Moins de trois semaines`; // moins de trois semaines
  if (seconds < STEP_MONTH) return `Moins d'un mois`; // moins d'un mois
  if (seconds < STEP_MONTH * 3) return `Moins de 3 mois`; // moins d'un mois
  if (seconds < STEP_MONTH * 6) return `Moins de 6 mois`; // moins d'un mois
  if (seconds <= STEP_MONTH * 8.99) return `Plus de 6 mois`; // moins d'un mois
  if (seconds < STEP_MONTH * 9) return `Moins de 9 mois`; // moins d'un mois
  if (seconds < STEP_YEAR) return `Moins d'un an`; // moins d'un mois
  if (seconds < STEP_YEAR * 2) return `Il ya plus d'un an`; // moins d'un mois
  const _year = parseInt(seconds / STEP_YEAR);
  return `Il ya plus de ${_year} ans`; // moins d'un mois

  /*
  
  if (seconds < STEP_HOUR) {
    const _minutes = parseInt(seconds / STEP_MINUTES);
    const _seconds = parseInt(seconds % STEP_MINUTES);
    return `${_minutes}min${_seconds > 0 ? ` ${_seconds}s` : ''}`;
  }
  if (seconds < STEP_DAY) {
    const _hours = parseInt(seconds / STEP_HOUR);
    const _minutes = parseInt((seconds % STEP_HOUR) / STEP_MINUTES);
    const _seconds = parseInt((seconds % STEP_HOUR) % STEP_MINUTES);
    return `${_hours}h ${_minutes ? `${_minutes}min` : ''} ${_seconds ? `${_seconds}s` : ''}`;
  }
  const _days = parseInt(seconds / STEP_DAY);
  const _hours = parseInt((seconds % STEP_DAY) / STEP_HOUR);
  const _minutes = parseInt(((seconds % STEP_DAY) % STEP_HOUR) / STEP_MINUTES);
  const _seconds = parseInt(((seconds % STEP_DAY) % STEP_HOUR) % STEP_MINUTES);
  return `${_days}j ${_hours}h ${_minutes}min ${_seconds}s`;
  */
}
export const formatPrice = (amount, currency = "CHF") => {
  const localeByCurrency = {
    CHF: "fr-CH",
    USD: "en-US",
    AOA: "pt-AO",
  };

  const locale = localeByCurrency[currency] || "fr-CH";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}
export function mixArray(a = []) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
export function formatChrono(seconds = 0) {
  //const STEP_SECONDS = 60;
  const STEP_MINUTES = 60;
  const STEP_HOUR = STEP_MINUTES * 60;
  const STEP_DAY = STEP_HOUR * 24;
  if (seconds < STEP_MINUTES) return `${seconds}s`;
  if (seconds < STEP_HOUR) {
    const _minutes = parseInt(seconds / STEP_MINUTES);
    const _seconds = parseInt(seconds % STEP_MINUTES);
    return `${_minutes}min${_seconds > 0 ? ` ${_seconds}s` : ''}`;
  }
  if (seconds < STEP_DAY) {
    const _hours = parseInt(seconds / STEP_HOUR);
    const _minutes = parseInt((seconds % STEP_HOUR) / STEP_MINUTES);
    const _seconds = parseInt((seconds % STEP_HOUR) % STEP_MINUTES);
    return `${_hours}h ${_minutes ? `${_minutes}min` : ''} ${_seconds ? `${_seconds}s` : ''}`;
  }
  const _days = parseInt(seconds / STEP_DAY);
  const _hours = parseInt((seconds % STEP_DAY) / STEP_HOUR);
  const _minutes = parseInt(((seconds % STEP_DAY) % STEP_HOUR) / STEP_MINUTES);
  const _seconds = parseInt(((seconds % STEP_DAY) % STEP_HOUR) % STEP_MINUTES);
  return `${_days}j ${_hours}h ${_minutes}min ${_seconds}s`;
}
export function formatDuration(duration = 0) {
  if (duration === 0) return `00 minutes`;
  const hour = parseInt(duration);
  const minutes = (duration - hour) * 60;
  if (hour < 1 && minutes > 0) {
    return minutes.toString().padStart(2, '0') + "min";
  }
  return `${hour}h${minutes > 0 ? minutes : ''}`;
}
export const cutString = (text = "", maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
export const cutStringBetween = (text = "", maxLength = 18) => {
  if (text?.length > maxLength) {
    return `${text.substring(0, parseInt(maxLength / 2))}...${text.substring(text.length - parseInt(maxLength / 2))}`;
  }
  return (text);
}
export function getJsonKeys(data = {}) {
  return Object.keys(data);
}
export function getJsonValues(data = {}) {
  return Object.values(data);
}
export function removeAccentsAndSpaces(str) {
  return str
    .normalize("NFD")                     // décompose les lettres accentuées
    .replace(/[\u0300-\u036f]/g, "")       // supprime les diacritiques
    .replace(/\s+/g, "")                   // supprime tous les espaces
    .replace(/['’]/g, "");                 // supprime apostrophes simples/typographiques
}
export function encodeFileUrl(url) {
  const parsed = new URL(url);
  parsed.pathname = parsed.pathname
    .split('/')
    .map(encodeURIComponent)
    .join('/');
  return parsed.toString();
}
export function capitalizeFirstLetter(str = "") {
  if (!str) return "";
  return (str[0].toUpperCase() + str.slice(1).toLowerCase());
}
export async function isValidPassword(password = "") {
  const status = await validatePassword(auth, password);
  return ({
    isValid: status.isValid,
    containsLowercaseLetter: status.containsLowercaseLetter,
    containsUppercaseLetter: status.containsUppercaseLetter,
    containsNumericCharacter: status.containsNumericCharacter,
    containsNonAlphanumericCharacter: status.containsNonAlphanumericCharacter,
    meetsMinPasswordLength: status.meetsMinPasswordLength,
    meetsMaxPasswordLength: status.meetsMaxPasswordLength,
  });
}
export function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}
export function isValidEmail(email) {
  // Expression régulière pour la validation de l'email
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}
export function isValidDandelaAcademyEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@dandela-academy\.com$/i;
  return regex.test(email);
}
export function isValidURL(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;

    if (!hostname.includes('.')) return false;

    const tld = hostname.split('.').pop();
    if (tld.length < 2) return false;

    return true;
  } catch (_) {
    return false;
  }
}
// Valide, normalise et formate
export function isValidPhoneNumber(phone_number, code = ClassCountry.DEFAULT_CODE) {
  const phone = parsePhoneNumberFromString(phone_number, code); // ex: 'CH', 'AO', 'FR'
  if (!phone) return false;
  return phone.isValid();
}
export function parseAndValidatePhone(raw, defaultCountry = 'AO') {
  const phone = parsePhoneNumberFromString(raw, defaultCountry); // ex: 'CH', 'AO', 'FR'
  if (!phone) return {
    is_valid: false,
    is_possible: false,
    phone_number: null,       // +41791234567
    international: null,        // +41 79 123 45 67
    national: null,                  // 079 123 45 67
    type: null,                             // 'MOBILE' | 'FIXED_LINE' | ...
    country: defaultCountry                             // code ISO (détecté)
  };
  return {
    is_valid: phone.isValid(),
    is_possible: phone.isPossible(),
    phone_number: phone.isValid() ? phone.number : null,       // +41791234567
    international: phone.formatInternational(),        // +41 79 123 45 67
    national: phone.formatNational(),                  // 079 123 45 67
    type: phone.getType(),                             // 'MOBILE' | 'FIXED_LINE' | ...
    country: phone.country                             // code ISO (détecté)
  };
}
export function getExampleFor(country = 'FR', type = 'mobile') {
  const entry = allExamples[country];
  if (!entry) return null;
  //const raw = entry[type] || entry.mobile || entry.fixed_line; // fallback
  //if (!raw) return null;
  //  console.log("Exemples possibles", entry)
  // On reparse pour bénéficier des méthodes (formatNational, etc.)
  return parsePhoneNumberFromString(entry, country);
}
export const getFirstLetters = (str = "", max = 5) => {
  return str
    .normalize("NFD")                  // sépare les accents
    .replace(/[\u0300-\u036f]/g, "")   // retire les accents
    .replace(/[-_']/g, " ")            // remplace tirets/apostrophes par espaces
    .replace(/\s+/g, " ")              // espaces multiples -> simple
    .trim()
    .replace(/[^A-Za-z]/g, "")         // garde seulement A-Z (optionnel)
    .slice(0, max);                       // x premières lettres
};
/**
 * Génère un mot de passe aléatoire qui respecte les règles Firebase
 * (min 6 caractères) + bonnes pratiques (majuscules, minuscules, chiffres, symboles).
 * @param {number} length - Longueur du mot de passe (>= 6)
 * @returns {string} Mot de passe généré
 */
export function generateRandomPassword(length = 12) {
  if (length < 6) length = 6;

  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}<>?/|~";
  const allChars = upper + lower + digits + symbols;

  // S'assurer qu'il y a au moins un de chaque type
  let password = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  // Compléter avec des caractères aléatoires
  for (let i = password.length; i < length; i++) {
    password.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // Mélanger le tableau pour éviter un ordre prévisible
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
}
export function generateRandomUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback : Génère un UUID v4 pseudo-aléatoire
  const fallbackUUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

  return fallbackUUID;
}
export function getLastDayInMonth(month, year) {
  // month = 1 pour janvier, 2 pour février...
  return new Date(year, month, 0).getDate();
}
export function getFormattedDateComplete(date = new Date(), lang = defaultLanguage) {
  if (date instanceof Date) {
    return date.toLocaleDateString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } else {
    return null;
  }
}
export function getFormattedDateCompleteNumeric(date = null, lang = defaultLanguage) {
  if (!date) {
    return null;
  }
  if (date instanceof Date) {
    return date.toLocaleDateString(lang, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } else {
    return date;
  }
}
export function getFormattedDate(date = new Date(), lang = defaultLanguage) {
  if (!date) {
    return null;
  }
  if (date instanceof Date) {
    return date.toLocaleDateString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } else {
    return date;
  }
}
export function getFormattedDateNumeric(date = new Date(), lang = defaultLanguage) {
  if (!date) {
    return null;
  }
  if (date instanceof Date) {
    return date.toLocaleDateString(lang, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  } else {
    return date;
  }
}
export function getFormattedMonth(date = new Date(), lang = defaultLanguage, type = 'long') {
  if (date instanceof Date) {
    return date.toLocaleDateString(lang, {
      //year: 'numeric',
      month: type,
      //day: 'numeric',
    });
  } else {
    return date;
  }
}
export function getFormattedHourComplete(date = new Date(), lang = defaultLanguage) {
  return date.toLocaleTimeString(lang, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    // hour12: false, // si tu veux forcer le format 24h
  });
  /*
  if (date instanceof Date) {
    return(`${date.getHours()}h ${date.getMinutes() > 0 ? `${date.getMinutes()}min` : ''} ${date.getSeconds() > 0 ? `${date.getSeconds()}sec` : ''}`);
  } else {
    return date;
  }
    */
}
export function getFormattedHour(date = new Date(), lang = defaultLanguage) {
  if (date instanceof Date) {
    return date.toLocaleTimeString(lang, {
      hour: '2-digit',
      minute: '2-digit',
      //second: '2-digit',
      // hour12: false, // si tu veux forcer le format 24h
    });
  } else {
    return date;
  }
  /*
  if (date instanceof Date) {
    return(`${date.getHours()}h ${date.getMinutes() > 0 ? `${date.getMinutes()}min` : ''}`);
  } else {
    return date;
  }
  */
}
export function addDaysToDate(date, nDays = 0) {
  const resultat = new Date(date);
  resultat.setDate(resultat.getDate() + nDays);
  return resultat;
}
export function getStartOfDay(date) {
  if (!(date instanceof Date)) {
    return null;
  }
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return new Date(year, month, day, 0, 0, 0);
}
export function translateWithVars(template = "", variables = {}) {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    return variables[key.trim()] ?? '';
  });
}
export function convertDoubleToHour(hour = 0) {
  if (hour > 0) {
    const entier = parseInt(hour);
    const reste = hour - entier;
    return `${entier}h${reste > 0 ? reste * 60 : ''}`;
  }
  return 0;
}

export function getCSSVar(name) {
  if (typeof window === "undefined") return undefined;
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}