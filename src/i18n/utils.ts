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

export async function useTranslations(lang: keyof typeof languages) {
  const entry = await getEntry('i18n', lang);
  if (!entry) {
    throw new Error(`Translations not found for language: ${lang}`);
  }
  return function t(key: keyof typeof entry.data, nestedKey: string) {
    // Helper to get nested values
    const obj = entry.data[key];
    if (typeof obj === 'object' && obj !== null && nestedKey in obj) {
      return (obj as any)[nestedKey] as string;
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
