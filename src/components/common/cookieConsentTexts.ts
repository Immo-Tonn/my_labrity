import type { Language } from '@/utils/localizedPath';

type Texts = {
  title: string;
  description: string;
  acceptAll: string;
  acceptNecessary: string;
  showPreferences: string;
  preferencesTitle: string;
  save: string;
  close: string;
  necessaryTitle: string;
  necessaryDescription: string;
  analyticsTitle: string;
  analyticsDescription: string;
  moreTitle: string;
  moreDescription: string;
  privacy: string;
  impressum: string;
};

// {privacy} / {impressum} are replaced with real, localized links.
export const COOKIE_TEXTS: Record<Language, Texts> = {
  de: {
    title: 'Cookies & Datenschutz',
    description:
      'Wir verwenden notwendige Cookies für den Betrieb der Website. Mit Ihrer Einwilligung nutzen wir außerdem Google Analytics, um die Nutzung der Website zu verstehen und sie zu verbessern. Sie können Ihre Auswahl jederzeit ändern. Mehr dazu in der {privacy} und im {impressum}.',
    acceptAll: 'Alle akzeptieren',
    acceptNecessary: 'Nur notwendige',
    showPreferences: 'Einstellungen',
    preferencesTitle: 'Cookie-Einstellungen',
    save: 'Auswahl speichern',
    close: 'Schließen',
    necessaryTitle: 'Notwendige Cookies',
    necessaryDescription:
      'Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden. Sie speichern z. B. Ihre Cookie-Auswahl.',
    analyticsTitle: 'Analyse (Google Analytics)',
    analyticsDescription:
      'Hilft uns zu verstehen, wie die Website genutzt wird (z. B. Seitenaufrufe). Wird nur mit Ihrer Einwilligung geladen. Anbieter: Google Ireland Limited.',
    moreTitle: 'Weitere Informationen',
    moreDescription:
      'Details zur Verarbeitung Ihrer Daten finden Sie in der {privacy}. Anbieterkennzeichnung: {impressum}.',
    privacy: 'Datenschutzerklärung',
    impressum: 'Impressum',
  },
  en: {
    title: 'Cookies & privacy',
    description:
      'We use necessary cookies to run the website. With your consent we also use Google Analytics to understand how the site is used and to improve it. You can change your choice at any time. See our {privacy} and {impressum}.',
    acceptAll: 'Accept all',
    acceptNecessary: 'Necessary only',
    showPreferences: 'Settings',
    preferencesTitle: 'Cookie settings',
    save: 'Save selection',
    close: 'Close',
    necessaryTitle: 'Necessary cookies',
    necessaryDescription:
      'These cookies are required for the website to work and cannot be disabled. They store, for example, your cookie choice.',
    analyticsTitle: 'Analytics (Google Analytics)',
    analyticsDescription:
      'Helps us understand how the website is used (e.g. page views). Loaded only with your consent. Provider: Google Ireland Limited.',
    moreTitle: 'More information',
    moreDescription:
      'For details on how your data is processed, see the {privacy}. Legal notice: {impressum}.',
    privacy: 'Privacy policy',
    impressum: 'Legal notice',
  },
  ru: {
    title: 'Cookies и конфиденциальность',
    description:
      'Мы используем необходимые cookies для работы сайта. С вашего согласия мы также используем Google Analytics, чтобы понимать, как используется сайт, и улучшать его. Выбор можно изменить в любое время. Подробнее: {privacy} и {impressum}.',
    acceptAll: 'Принять все',
    acceptNecessary: 'Только необходимые',
    showPreferences: 'Настройки',
    preferencesTitle: 'Настройки cookies',
    save: 'Сохранить выбор',
    close: 'Закрыть',
    necessaryTitle: 'Необходимые cookies',
    necessaryDescription:
      'Эти cookies нужны для работы сайта и не могут быть отключены. Они сохраняют, например, ваш выбор по cookies.',
    analyticsTitle: 'Аналитика (Google Analytics)',
    analyticsDescription:
      'Помогает понять, как используется сайт (например, просмотры страниц). Загружается только с вашего согласия. Поставщик: Google Ireland Limited.',
    moreTitle: 'Дополнительная информация',
    moreDescription:
      'Подробности об обработке данных — в {privacy}. Выходные данные: {impressum}.',
    privacy: 'политике конфиденциальности',
    impressum: 'Impressum',
  },
  ua: {
    title: 'Cookie та конфіденційність',
    description:
      'Ми використовуємо необхідні файли cookie для роботи сайту. За вашою згодою ми також використовуємо Google Analytics, щоб розуміти, як використовується сайт, і покращувати його. Вибір можна змінити в будь-який час. Докладніше: {privacy} та {impressum}.',
    acceptAll: 'Прийняти все',
    acceptNecessary: 'Лише необхідні',
    showPreferences: 'Налаштування',
    preferencesTitle: 'Налаштування cookie',
    save: 'Зберегти вибір',
    close: 'Закрити',
    necessaryTitle: 'Необхідні cookie',
    necessaryDescription:
      'Ці файли потрібні для роботи сайту й не можуть бути вимкнені. Вони зберігають, наприклад, ваш вибір щодо cookie.',
    analyticsTitle: 'Аналітика (Google Analytics)',
    analyticsDescription:
      'Допомагає зрозуміти, як використовується сайт (наприклад, перегляди сторінок). Завантажується лише за вашою згодою. Постачальник: Google Ireland Limited.',
    moreTitle: 'Додаткова інформація',
    moreDescription:
      'Подробиці про обробку даних — у {privacy}. Імпресум: {impressum}.',
    privacy: 'політиці конфіденційності',
    impressum: 'Impressum',
  },
};
