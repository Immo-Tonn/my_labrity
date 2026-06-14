// estimate.ts

import { QuizAnswers } from './quiz.types';

export function calculateEstimate(answers: QuizAnswers): {
  min: number;
  max: number;
} {
  let min = 1500;
  let max = 3500;

  const websiteType = answers.websiteType?.[0];

  switch (websiteType) {
    case 'Unternehmenswebsite':
      min = 3000;
      max = 8000;
      break;

    case 'Onlineshop':
      min = 6000;
      max = 20000;
      break;

    case 'Individuelle Lösung':
      min = 10000;
      max = 50000;
      break;
  }

  const languages = answers.languages?.[0];

  if (languages === 'Zwei Sprachen') {
    min += 500;
    max += 2000;
  }

  if (languages === 'Drei oder mehr Sprachen') {
    min += 1500;
    max += 5000;
  }

  const design = answers.design?.[0];

  if (design === 'Neues Design erforderlich') {
    min += 1000;
    max += 4000;
  }

  if (design === 'Bestehende Website modernisieren') {
    min += 500;
    max += 2500;
  }

  const features = answers.features || [];

  min += features.length * 500;
  max += features.length * 2500;

  return { min, max };
}
