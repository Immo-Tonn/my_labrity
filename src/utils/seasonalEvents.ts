export type SeasonalAccent =
  | 'global'
  | 'ukraine'
  | 'germany'
  | 'new-year'
  | 'christmas'
  | 'easter'
  | 'snow';

export type SeasonalEventKey =
  | 'newYear'
  | 'christmas'
  | 'orthodoxChristmas'
  | 'westernEaster'
  | 'orthodoxEaster'
  | 'ukraineConstitution'
  | 'ukraineIndependence'
  | 'ukraineVyshyvanka'
  | 'germanUnity';

export type SeasonalEvent = {
  id: string;
  key: SeasonalEventKey;
  accent: SeasonalAccent;
};

type SeasonalEventConfig = {
  id: string;
  key: SeasonalEventKey;
  from: string;
  to: string;
  languages: string[] | 'all';
  accent: SeasonalAccent;
};

const fixedSeasonalEvents: SeasonalEventConfig[] = [
  {
    id: 'new-year',
    key: 'newYear',
    from: '12-31',
    to: '01-01',
    languages: 'all',
    accent: 'new-year',
  },
  {
    id: 'christmas',
    key: 'christmas',
    from: '12-24',
    to: '12-26',
    languages: 'all',
    accent: 'christmas',
  },
  {
    id: 'orthodox-christmas',
    key: 'orthodoxChristmas',
    from: '01-06',
    to: '01-07',
    languages: ['ua', 'ru'],
    accent: 'christmas',
  },
  {
    id: 'ukraine-constitution-day',
    key: 'ukraineConstitution',
    from: '06-28',
    to: '06-28',
    languages: ['ua'],
    accent: 'ukraine',
  },
  {
    id: 'ukraine-independence-day',
    key: 'ukraineIndependence',
    from: '08-24',
    to: '08-24',
    languages: ['ua'],
    accent: 'ukraine',
  },
  {
    id: 'german-unity-day',
    key: 'germanUnity',
    from: '10-03',
    to: '10-03',
    languages: ['de'],
    accent: 'germany',
  },
];

function getMonthDay(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${month}-${day}`;
}

function isDateInRange(today: string, from: string, to: string) {
  if (from <= to) {
    return today >= from && today <= to;
  }

  return today >= from || today <= to;
}

function isLanguageAllowed(languages: string[] | 'all', lang: string) {
  return languages === 'all' || languages.includes(lang);
}

function isSameDay(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function getWesternEasterDate(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

function getOrthodoxEasterDate(year: number) {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;

  const julianEaster = new Date(year, month - 1, day);
  julianEaster.setDate(julianEaster.getDate() + 13);

  return julianEaster;
}

function getThirdThursdayOfMay(year: number) {
  const date = new Date(year, 4, 1);
  let thursdayCount = 0;

  while (date.getMonth() === 4) {
    if (date.getDay() === 4) {
      thursdayCount += 1;

      if (thursdayCount === 3) {
        return new Date(date);
      }
    }

    date.setDate(date.getDate() + 1);
  }

  return null;
}

function getDynamicSeasonalEvent(
  lang: string,
  date: Date,
): SeasonalEvent | null {
  const year = date.getFullYear();

  const westernEaster = getWesternEasterDate(year);
  const orthodoxEaster = getOrthodoxEasterDate(year);
  const vyshyvankaDay = getThirdThursdayOfMay(year);

  if ((lang === 'de' || lang === 'en') && isSameDay(date, westernEaster)) {
    return {
      id: 'western-easter',
      key: 'westernEaster',
      accent: 'easter',
    };
  }

  if ((lang === 'ua' || lang === 'ru') && isSameDay(date, orthodoxEaster)) {
    return {
      id: 'orthodox-easter',
      key: 'orthodoxEaster',
      accent: 'easter',
    };
  }

  if (lang === 'ua' && vyshyvankaDay && isSameDay(date, vyshyvankaDay)) {
    return {
      id: 'ukraine-vyshyvanka-day',
      key: 'ukraineVyshyvanka',
      accent: 'ukraine',
    };
  }

  return null;
}

export function shouldShowChristmasSnow(date = new Date()) {
  const today = getMonthDay(date);

  return isDateInRange(today, '12-24', '01-07');
}

export function getSeasonalEvent(
  lang: string,
  date = new Date(),
): SeasonalEvent | null {
  const dynamicEvent = getDynamicSeasonalEvent(lang, date);

  if (dynamicEvent) {
    return dynamicEvent;
  }

  const today = getMonthDay(date);

  const fixedEvent = fixedSeasonalEvents.find(item => {
    return (
      isLanguageAllowed(item.languages, lang) &&
      isDateInRange(today, item.from, item.to)
    );
  });

  if (!fixedEvent) return null;

  return {
    id: fixedEvent.id,
    key: fixedEvent.key,
    accent: fixedEvent.accent,
  };
}
