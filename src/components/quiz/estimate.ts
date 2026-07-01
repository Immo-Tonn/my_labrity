import { QuizAnswers } from './quiz.types';

export const calculateEstimate = (answers: QuizAnswers): number => {
  let total = 0;

  const websiteType = answers.websiteType?.[0];
  const clientType = answers.clientType?.[0];
  const content = answers.content?.[0];
  const languages = answers.languages?.[0];
  const design = answers.design?.[0];
  const features = answers.features || [];

  // WEBSITE TYPE (BASE)
  switch (websiteType) {
    case 'Einfache Präsentationsseite':
      total += 999;
      break;

    case 'Unternehmenswebsite':
      total += 1900;
      break;

    case 'Onlineshop':
      total += 8900;
      break;

    case 'Individuelle Lösung':
      total += 8900;
      break;

    case 'Nicht sicher':
      total += 999; // базовая стоимость
      break;
  }

  // CLIENT TYPE
  switch (clientType) {
    case 'Freelancer / Selbstständig':
      total += 300;
      break;

    case 'Kleinunternehmen':
      total += 700;
      break;

    case 'Unternehmen':
      total += 1500;
      break;

    case 'Nicht sicher':
    default:
      total += 0;
      break;
  }

  // CONTENT
  switch (content) {
    case 'Teilweise vorhanden':
      total += 500;
      break;

    case 'Benötige Unterstützung bei Inhalten':
      total += 1200;
      break;

    case 'Nicht sicher':
    default:
      total += 0;
      break;
  }

  // LANGUAGES
  switch (languages) {
    case 'Zwei Sprachen':
      total += 900;
      break;

    case 'Drei oder mehr Sprachen':
      total += 1800;
      break;

    case 'Nicht sicher':
    default:
      total += 0;
      break;
  }

  // DESIGN
  switch (design) {
    case 'Neues Design erforderlich':
      total += 1500;
      break;

    case 'Bestehende Website modernisieren':
      total += 900;
      break;

    case 'Nicht sicher':
    default:
      total += 0;
      break;
  }

  // FEATURES
  features.forEach(feature => {
    switch (feature) {
      case 'Kontaktformular':
        total += 200;
        break;

      case 'Online-Terminbuchung':
        total += 800;
        break;

      case 'Preisrechner':
        total += 1500;
        break;

      case 'Kundendaten verwalten':
        total += 2000;
        break;

      case 'Verbindung mit anderen Systemen':
        total += 2500;
        break;

      case 'Persönlicher Kundenbereich':
        total += 3000;
        break;

      default:
        total += 0;
        break;
    }
  });

  // MINIMUM SAFETY
  if (total < 999) {
    total = 999;
  }

  return Math.round(total / 100) * 100;
};
