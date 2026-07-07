import { QuizAnswers, QuizQuestion } from './quiz.types';

const getSelectedIndex = (
  questions: QuizQuestion[],
  questionId: string,
  value?: string,
): number => {
  if (!value) return -1;

  const question = questions.find(q => q.id === questionId);

  return question ? question.options.indexOf(value) : -1;
};

export const calculateEstimate = (
  answers: QuizAnswers,
  questions: QuizQuestion[],
): number => {
  let total = 0;

  const websiteType = getSelectedIndex(
    questions,
    'websiteType',
    answers.websiteType?.[0],
  );
  const clientType = getSelectedIndex(
    questions,
    'clientType',
    answers.clientType?.[0],
  );
  const content = getSelectedIndex(questions, 'content', answers.content?.[0]);
  const languages = getSelectedIndex(
    questions,
    'languages',
    answers.languages?.[0],
  );
  const design = getSelectedIndex(questions, 'design', answers.design?.[0]);
  const features = answers.features || [];
  const featureIndexes = features.map(feature =>
    getSelectedIndex(questions, 'features', feature),
  );

  // WEBSITE TYPE (BASE)
  // 0: Simple presentation website | 1: Business website | 2: Online store
  // 3: Custom solution | 4: Not sure
  switch (websiteType) {
    case 0:
      total += 400;
      break;

    case 1:
      total += 1000;
      break;

    case 2:
    // total += 8900;
    // break;

    case 3:
      total += 1100;
      break;

    case 4:
      total += 400; // базовая стоимость
      break;
  }

  // CLIENT TYPE
  // 0: Private person | 1: Freelancer / Self-employed | 2: Small business
  // 3: Company | 4: Not sure
  switch (clientType) {
    case 1:
      total += 0;
      break;

    case 2:
      total += 0;
      break;

    case 3:
      total += 0;
      break;

    // default:
    //   total += 0;
    //   break;
  }

  // CONTENT
  // 0: Yes, everything is ready | 1: Partially ready
  // 2: Need help with content | 3: Not sure
  switch (content) {
    case 1:
      total += 50;
      break;

    case 2:
      total += 150;
      break;

    // default:
    //   total += 0;
    //   break;
  }

  // LANGUAGES
  // 0: One language | 1: Two languages | 2: Three or more languages | 3: Not sure
  switch (languages) {
    case 1:
      total += 150;
      break;

    case 2:
      total += 200;
      break;

    // default:
    //   total += 0;
    //   break;
  }

  // DESIGN
  // 0: Design already exists | 1: Need a new design
  // 2: Redesign existing website | 3: Not sure
  switch (design) {
    case 1:
      total += 300;
      break;

    case 2:
      total += 250;
      break;

    // default:
    //   total += 0;
    //   break;
  }

  // FEATURES
  // 0: Contact form | 1: Online appointment booking | 2: Price calculator
  // 3: Customer management | 4: Connection with other services
  // 5: Client account area | 6: Not sure
  featureIndexes.forEach(featureIndex => {
    switch (featureIndex) {
      case 0:
        total += 100;
        break;

      case 1:
        total += 300;
        break;

      case 2:
        total += 300;
        break;

      // case 3:
      //   total += 2000;
      //   break;

      case 4:
        total += 200;
        break;

      case 5:
        total += 1000;
        break;

      // default:
      //   total += 0;
      //   break;
    }
  });

  // MINIMUM SAFETY
  if (total < 400) {
    total = 400;
  }

  return Math.round(total / 100) * 100;
};
