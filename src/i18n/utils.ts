import { getEntry } from 'astro:content';

export const languages = {
  es: 'Español',
  en: 'English',
  de: 'Deutsch',
};

export const defaultLang = 'es';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as keyof typeof languages;
  return defaultLang;
}

import es from '../content/i18n/es.json';
import en from '../content/i18n/en.json';
import de from '../content/i18n/de.json';

const translations = { es, en, de };

export async function useTranslations(lang: keyof typeof languages) {
  const data = translations[lang];
  if (!data) {
    throw new Error(`Translations not found for language: ${lang}`);
  }
  return function t(key: keyof typeof data, nestedKey?: string) {
    // Helper to get nested values
    const obj = (data as any)[key];
    if (typeof obj === 'object' && obj !== null && nestedKey) {
      if (nestedKey in obj) {
        return (obj as any)[nestedKey] as string;
      }
      return nestedKey; // fallback to the key itself rather than [object Object]
    }
    return String(obj);
  }
}

export function getRelativeLocaleUrl(lang: string, path: string = '') {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) {
    return cleanPath === '/' ? '/' : cleanPath;
  }
  return `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
}
