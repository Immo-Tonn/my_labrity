import { QuizAnswers } from './quiz.types';

const websiteTypeMap: Record<string, string> = {
  'Einfache Präsentationsseite': 'presentation',
  'Simple presentation website': 'presentation',
  'Простой презентационный сайт': 'presentation',
  'Простий презентаційний сайт': 'presentation',

  Unternehmenswebsite: 'business',
  'Business website': 'business',
  'Сайт для бизнеса': 'business',
  'Сайт для бізнесу': 'business',

  Onlineshop: 'shop',
  'Online store': 'shop',
  'Интернет-магазин': 'shop',
  'Інтернет-магазин': 'shop',

  'Individuelle Lösung': 'custom',
  'Custom solution': 'custom',
  'Индивидуальное решение': 'custom',
  'Індивідуальне рішення': 'custom',

  'Nicht sicher': 'unknown',
  'Not sure': 'unknown',
  'Не уверен': 'unknown',
  'Не впевнений': 'unknown',
};

const clientTypeMap: Record<string, string> = {
  Privatperson: 'private',
  'Private person': 'private',
  'Частное лицо': 'private',
  'Приватна особа': 'private',

  'Freelancer / Selbstständig': 'freelancer',
  'Freelancer / Self-employed': 'freelancer',
  'Фрилансер / Самозанятый': 'freelancer',
  'Фрилансер / Самозайнятий': 'freelancer',

  Kleinunternehmen: 'smallBusiness',
  'Small business': 'smallBusiness',
  'Малый бизнес': 'smallBusiness',
  'Малий бізнес': 'smallBusiness',

  Unternehmen: 'company',
  Company: 'company',
  Компания: 'company',
  Компанія: 'company',

  'Nicht sicher': 'unknown',
  'Not sure': 'unknown',
  'Не уверен': 'unknown',
  'Не впевнений': 'unknown',
};

const contentMap: Record<string, string> = {
  'Ja, alles vorhanden': 'ready',
  'Yes, everything is ready': 'ready',
  'Да, всё готово': 'ready',
  'Так, усе готово': 'ready',

  'Teilweise vorhanden': 'partial',
  'Partially ready': 'partial',
  'Частично готово': 'partial',
  'Частково готово': 'partial',

  'Benötige Unterstützung bei Inhalten': 'needHelp',
  'Need help with content': 'needHelp',
  'Нужна помощь с контентом': 'needHelp',
  'Потрібна допомога з контентом': 'needHelp',

  'Nicht sicher': 'unknown',
  'Not sure': 'unknown',
  'Не уверен': 'unknown',
  'Не впевнений': 'unknown',
};

const languagesMap: Record<string, string> = {
  'Nur eine Sprache': 'one',
  'One language': 'one',
  'Один язык': 'one',
  'Одна мова': 'one',

  'Zwei Sprachen': 'two',
  'Two languages': 'two',
  'Два языка': 'two',
  'Дві мови': 'two',

  'Drei oder mehr Sprachen': 'threePlus',
  'Three or more languages': 'threePlus',
  'Три и более языков': 'threePlus',
  'Три або більше мов': 'threePlus',

  'Nicht sicher': 'unknown',
  'Not sure': 'unknown',
  'Не уверен': 'unknown',
  'Не впевнений': 'unknown',
};

const designMap: Record<string, string> = {
  'Design bereits vorhanden': 'existing',
  'Design already exists': 'existing',
  'Дизайн уже есть': 'existing',
  'Дизайн уже є': 'existing',

  'Neues Design erforderlich': 'new',
  'Need a new design': 'new',
  'Нужен новый дизайн': 'new',
  'Потрібен новий дизайн': 'new',

  'Bestehende Website modernisieren': 'redesign',
  'Redesign existing website': 'redesign',
  'Обновление существующего сайта': 'redesign',
  'Оновлення існуючого сайту': 'redesign',

  'Nicht sicher': 'unknown',
  'Not sure': 'unknown',
  'Не уверен': 'unknown',
  'Не впевнений': 'unknown',
};

const featureMap: Record<string, string> = {
  Kontaktformular: 'contact',
  'Contact form': 'contact',
  'Контактная форма': 'contact',
  'Контактна форма': 'contact',

  'Online-Terminbuchung': 'booking',
  'Online appointment booking': 'booking',
  'Онлайн-запись': 'booking',
  'Онлайн-запис': 'booking',

  Preisrechner: 'calculator',
  'Price calculator': 'calculator',
  'Калькулятор стоимости': 'calculator',
  'Калькулятор вартості': 'calculator',

  'Kundendaten verwalten': 'crm',
  'Customer management': 'crm',
  'Управление клиентами': 'crm',
  'Управління клієнтами': 'crm',

  'Verbindung mit anderen Systemen': 'integrations',
  'Connection with other services': 'integrations',
  'Подключение сторонних сервисов': 'integrations',
  'Підключення інших сервісів': 'integrations',

  'Persönlicher Kundenbereich': 'account',
  'Client account area': 'account',
  'Личный кабинет клиента': 'account',
  'Особистий кабінет клієнта': 'account',

  'Nicht sicher': 'unknown',
  'Not sure': 'unknown',
  'Не уверен': 'unknown',
  'Не впевнений': 'unknown',
};

export const calculateEstimate = (answers: QuizAnswers): number => {
  let total = 0;

  const websiteType = websiteTypeMap[answers.websiteType?.[0] ?? ''];
  const clientType = clientTypeMap[answers.clientType?.[0] ?? ''];
  const content = contentMap[answers.content?.[0] ?? ''];
  const languages = languagesMap[answers.languages?.[0] ?? ''];
  const design = designMap[answers.design?.[0] ?? ''];
  const features = (answers.features || []).map(
    feature => featureMap[feature] ?? feature,
  );

  // WEBSITE TYPE
  switch (websiteType) {
    case 'presentation':
      total += 400;
      break;
    case 'business':
      total += 1000;
      break;
    case 'shop':
    case 'custom':
      total += 1100;
      break;
    case 'unknown':
      total += 400;
      break;
  }

  // CLIENT TYPE
  switch (clientType) {
    case 'freelancer':
      total += 0;
      break;
    case 'smallBusiness':
      total += 0;
      break;
    case 'company':
      total += 0;
      break;
  }

  // CONTENT
  switch (content) {
    case 'partial':
      total += 50;
      break;
    case 'needHelp':
      total += 150;
      break;
  }

  // LANGUAGES
  switch (languages) {
    case 'two':
      total += 150;
      break;
    case 'threePlus':
      total += 200;
      break;
  }

  // DESIGN
  switch (design) {
    case 'new':
      total += 300;
      break;
    case 'redesign':
      total += 250;
      break;
  }

  // FEATURES
  features.forEach(feature => {
    switch (feature) {
      case 'contact':
        total += 100;
        break;
      case 'booking':
        total += 300;
        break;
      case 'calculator':
        total += 300;
        break;
      // case 'crm':
      //   total += 2000;
      //   break;
      case 'integrations':
        total += 200;
        break;
      case 'account':
        total += 1000;
        break;
    }
  });

  if (total < 400) {
    total = 400;
  }

  return Math.round(total / 100) * 100;
};
