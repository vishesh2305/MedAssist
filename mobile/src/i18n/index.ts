import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import en from './en.json';
import es from './es.json';
import hi from './hi.json';

const i18n = new I18n({ en, es, hi });

i18n.defaultLocale = 'en';
i18n.locale = Localization.locale?.split('-')[0] || 'en';
i18n.enableFallback = true;

export function setLocale(locale: string): void {
  i18n.locale = locale;
}

export function t(scope: string, options?: Record<string, unknown>): string {
  return i18n.t(scope, options);
}

export default i18n;
