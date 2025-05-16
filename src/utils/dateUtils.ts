
import { type } from "os";

type LanguageCode = 'en' | 'es' | 'fr';

const translations = {
  justNow: {
    en: 'Just now',
    es: 'Ahora mismo',
    fr: 'À l\'instant',
  },
  minutesAgo: {
    en: (minutes: number) => `${minutes} minute${minutes === 1 ? '' : 's'} ago`,
    es: (minutes: number) => `hace ${minutes} minuto${minutes === 1 ? '' : 's'}`,
    fr: (minutes: number) => `Il y a ${minutes} minute${minutes === 1 ? '' : 's'}`,
  },
  hoursAgo: {
    en: (hours: number) => `${hours} hour${hours === 1 ? '' : 's'} ago`,
    es: (hours: number) => `hace ${hours} hora${hours === 1 ? '' : 's'}`,
    fr: (hours: number) => `Il y a ${hours} heure${hours === 1 ? '' : 's'}`,
  },
  daysAgo: {
    en: (days: number) => `${days} day${days === 1 ? '' : 's'} ago`,
    es: (days: number) => `hace ${days} día${days === 1 ? '' : 's'}`,
    fr: (days: number) => `Il y a ${days} jour${days === 1 ? '' : 's'}`,
  },
  weeksAgo: {
    en: (weeks: number) => `${weeks} week${weeks === 1 ? '' : 's'} ago`,
    es: (weeks: number) => `hace ${weeks} semana${weeks === 1 ? '' : 's'}`,
    fr: (weeks: number) => `Il y a ${weeks} semaine${weeks === 1 ? '' : 's'}`,
  },
  monthsAgo: {
    en: (months: number) => `${months} month${months === 1 ? '' : 's'} ago`,
    es: (months: number) => `hace ${months} mes${months === 1 ? '' : 'es'}`,
    fr: (months: number) => `Il y a ${months} mois`,
  },
};

export function formatRelativeTime(date: Date, language: LanguageCode = 'en'): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) {
    return translations.justNow[language];
  } else if (minutes < 60) {
    return translations.minutesAgo[language](minutes);
  } else if (hours < 24) {
    return translations.hoursAgo[language](hours);
  } else if (days < 7) {
    return translations.daysAgo[language](days);
  } else if (weeks < 4) {
    return translations.weeksAgo[language](weeks);
  } else {
    return translations.monthsAgo[language](months);
  }
}
