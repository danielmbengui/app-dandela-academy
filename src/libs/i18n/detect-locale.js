import { cookies, headers } from "next/headers";
import Negotiator from "negotiator";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import { languages, defaultLanguage } from "./settings";

export async function getPreferredLocale() {
  // 1) Cookie prioritaire (posé par ton switch de langue client)
  const jar = await cookies();
  const cookieLocale = jar.get("locale")?.value;
  if (cookieLocale && languages.includes(cookieLocale)) return cookieLocale;

  // 2) Accept-Language
  const hdrs = await headers();
  const accept = hdrs.get("accept-language") || "";
  const requested = new Negotiator({ headers: { "accept-language": accept } }).languages();

  // 3) Match avec intl-localematcher
  const matched = matchLocale(requested, languages, defaultLanguage);

  // 4) Réduire "pt-PT" → "pt"
  const base = matched?.toLowerCase().split("-")[0];
  return languages.includes(base) ? base : defaultLanguage;
}
