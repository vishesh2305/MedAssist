export const defaultLocale = 'en';
export const locales = ['en', 'es', 'fr', 'ar', 'hi'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Espa\u00f1ol',
  fr: 'Fran\u00e7ais',
  ar: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629',
  hi: '\u0939\u093f\u0928\u094d\u0926\u0940',
};

export const rtlLocales: Locale[] = ['ar'];

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
