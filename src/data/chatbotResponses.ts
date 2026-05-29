export const chatbotResponses = [
  // GREETINGS — DE
  {
    keywords: ['hallo', 'hi', 'hey', 'guten tag', 'servus', 'moin', 'hello'],
    response: 'Hallo 👋 Schön, dass Sie da sind. Wie kann ich Ihnen helfen?',
  },
  {
    keywords: ['tschüss', 'bye', 'auf wiedersehen', 'bis bald', 'ciao'],
    response: 'Tschüss 👋 Bis bald und einen schönen Tag!',
  },

  // GREETINGS — RU
  {
    keywords: ['привет', 'здравствуй', 'здравствуйте', 'хай', 'добрый день'],
    response: 'Привет 👋 Рада видеть вас! Чем могу помочь?',
  },
  {
    keywords: ['пока', 'до свидания', 'увидимся', 'бай'],
    response: 'Пока 👋 Хорошего дня и до встречи!',
  },

  // THANKS
  {
    keywords: ['danke', 'vielen dank', 'dankeschön', 'thanks'],
    response: 'Sehr gerne 😊',
  },
  {
    keywords: ['спасибо', 'благодарю', 'спс'],
    response: 'Пожалуйста 😊',
  },

  // HELP
  {
    keywords: ['hilfe', 'help', 'helfen', 'kannst du helfen'],
    response:
      'Ich kann Fragen zu Websites, SEO, Landingpages, Portfolio und Kontakt beantworten.',
  },
  {
    keywords: ['помощь', 'help', 'помоги', 'можешь помочь'],
    response:
      'Я могу помочь с вопросами про сайты, SEO, лендинги, портфолио и контакт.',
  },

  // GENERAL WEBSITE — DE
  {
    keywords: [
      'website',
      'webseite',
      'homepage',
      'site',
      'internetseite',
      'webauftritt',
      'website erstellen',
      'webseite erstellen',
      'homepage erstellen',
      'website erstellen lassen',
      'webseite erstellen lassen',
      'homepage erstellen lassen',
      'ich brauche eine website',
      'neue website',
      'moderne website',
      'professionelle website',
      'firmenwebsite',
    ],
    response:
      'Wir entwickeln moderne Websites für Unternehmen, Selbstständige und Marken. Schreiben Sie uns gerne kurz, was Sie brauchen.',
  },

  // GENERAL WEBSITE — RU
  {
    keywords: [
      'сайт',
      'вебсайт',
      'лендинг',
      'страница',
      'сделать сайт',
      'заказать сайт',
      'нужен сайт',
      'создать сайт',
      'разработка сайта',
      'новый сайт',
      'современный сайт',
      'сайт для бизнеса',
      'сайт для компании',
    ],
    response:
      'Мы создаём современные сайты для компаний, самозанятых и брендов. Напишите нам коротко, какой сайт вам нужен.',
  },

  // PRICE — DE
  {
    keywords: [
      'preis',
      'kosten',
      'kostet',
      'was kostet',
      'wie viel kostet',
      'wieviel kostet',
      'günstig',
      'billig',
      'angebot',
      'budget',
      'preise',
      'pricing',
      'price',
      'kosten website',
      'preis website',
      'website kosten',
    ],
    response:
      'Die Kosten hängen vom Umfang des Projekts ab. Gerne erstellen wir ein individuelles Angebot nach einem kurzen Gespräch.',
  },

  // PRICE — RU
  {
    keywords: [
      'цена',
      'стоимость',
      'дешево',
      'недорого',
      'предложение',
      'сколько стоит',
      'сколько стоит сайт',
      'прайс',
      'бюджет',
      'цены',
      'стоимость сайта',
    ],
    response:
      'Стоимость зависит от объёма проекта. Мы можем подготовить индивидуальное предложение после короткого обсуждения.',
  },

  // TIME — DE
  {
    keywords: [
      'dauer',
      'wie lange',
      'wie lange dauert',
      'wielange',
      'zeit',
      'timeline',
      'entwicklung',
      'fertig',
      'wann fertig',
      'wann ist die website fertig',
      'wie schnell',
      'schnell',
      'projektzeit',
    ],
    response:
      'Die Dauer hängt vom Umfang der Website ab. Kleine Websites können schneller umgesetzt werden, größere Projekte brauchen mehr Planung und Entwicklung.',
  },

  // TIME — RU
  {
    keywords: [
      'срок',
      'сроки',
      'сколько времени',
      'как долго',
      'разработка',
      'когда готово',
      'быстро',
      'за сколько дней',
      'сколько занимает',
    ],
    response:
      'Срок зависит от объёма сайта. Небольшие сайты можно сделать быстрее, а большие проекты требуют больше планирования и разработки.',
  },

  // CONTACT — DE
  {
    keywords: [
      'kontakt',
      'email',
      'e-mail',
      'anfragen',
      'anfrage',
      'termin',
      'kontaktieren',
      'schreiben',
      'telefon',
      'meeting',
      'beratung',
    ],
    response:
      'Sie können uns über das Kontaktformular auf der Website kontaktieren. Wir melden uns anschließend bei Ihnen.',
  },

  // CONTACT — RU
  {
    keywords: [
      'контакт',
      'почта',
      'email',
      'связаться',
      'заявка',
      'термин',
      'написать',
      'созвон',
      'консультация',
      'встреча',
    ],
    response:
      'Вы можете связаться с нами через контактную форму на сайте. Мы ответим вам после получения заявки.',
  },

  // SEO — DE
  {
    keywords: [
      'seo',
      'google',
      'sichtbarkeit',
      'suchmaschine',
      'suchmaschinen',
      'gefunden werden',
      'ranking',
      'indexierung',
      'optimierung',
      'ai seo',
      'ki seo',
      'chatgpt',
      'perplexity',
    ],
    response:
      'Ja, wir achten auf saubere Struktur, Performance, mobile Optimierung und SEO-Grundlagen, damit Ihre Website besser gefunden werden kann.',
  },

  // SEO — RU
  {
    keywords: [
      'сео',
      'seo',
      'гугл',
      'google',
      'поисковик',
      'продвижение',
      'индексация',
      'оптимизация',
      'найти в гугле',
      'ai seo',
      'ии seo',
      'chatgpt',
    ],
    response:
      'Да, мы учитываем структуру сайта, скорость, мобильную адаптацию и базовую SEO-оптимизацию.',
  },

  // CLIENT TYPES — DE
  {
    keywords: [
      'unternehmen',
      'selbstständig',
      'selbstständige',
      'firma',
      'geschäft',
      'dienstleister',
      'kleines unternehmen',
      'startup',
      'marke',
      'brand',
      'business',
    ],
    response:
      'Ja, wir entwickeln Websites für Selbstständige, kleine Unternehmen, Dienstleister und moderne Marken.',
  },

  // CLIENT TYPES — RU
  {
    keywords: [
      'компания',
      'бизнес',
      'самозанятый',
      'фирма',
      'магазин',
      'услуги',
      'малый бизнес',
      'стартап',
      'бренд',
    ],
    response:
      'Да, мы создаём сайты для самозанятых, небольших компаний, сервисов и современных брендов.',
  },

  // LANDING PAGE — DE
  {
    keywords: [
      'landingpage',
      'landing page',
      'verkaufen',
      'kunden',
      'anfragen',
      'conversion',
      'verkaufsseite',
      'kunden gewinnen',
      'lead',
      'leads',
    ],
    response:
      'Wir entwickeln moderne Landingpages mit klarer Struktur, hochwertigem Design und Fokus auf neue Kundenanfragen.',
  },

  // LANDING PAGE — RU
  {
    keywords: [
      'лендинг',
      'landing',
      'продажи',
      'клиенты',
      'заявки',
      'конверсия',
      'продающая страница',
      'получать клиентов',
    ],
    response:
      'Мы создаём современные лендинги с понятной структурой, красивым дизайном и фокусом на заявки от клиентов.',
  },

  // TECHNOLOGY — DE
  {
    keywords: [
      'next',
      'nextjs',
      'next.js',
      'react',
      'technologie',
      'frontend',
      'tailwind',
      'vercel',
      'modern stack',
    ],
    response:
      'Wir arbeiten mit modernen Technologien wie Next.js und React, damit Websites schnell, flexibel und professionell aufgebaut sind.',
  },

  // TECHNOLOGY — RU
  {
    keywords: [
      'next',
      'nextjs',
      'next.js',
      'react',
      'реакт',
      'технологии',
      'фронтенд',
      'tailwind',
      'vercel',
    ],
    response:
      'Мы работаем с современными технологиями, такими как Next.js и React, чтобы сайт был быстрым и профессиональным.',
  },

  // PORTFOLIO — DE
  {
    keywords: [
      'portfolio',
      'arbeiten',
      'projekte',
      'beispiele',
      'referenzen',
      'case',
      'cases',
      'was habt ihr gemacht',
    ],
    response:
      'Sie können unser Portfolio auf der Portfolio-Seite ansehen 👋 Dort finden Sie ausgewählte Projekte.',
  },

  // PORTFOLIO — RU
  {
    keywords: [
      'портфолио',
      'работы',
      'проекты',
      'примеры',
      'кейсы',
      'что вы делали',
    ],
    response:
      'Вы можете посмотреть наши работы на странице Portfolio 👋 Там собраны выбранные проекты.',
  },

  // MOBILE / RESPONSIVE — DE
  {
    keywords: [
      'mobile',
      'smartphone',
      'handy',
      'responsive',
      'tablet',
      'mobil optimiert',
    ],
    response:
      'Ja, Websites werden responsive entwickelt und funktionieren auf Smartphone, Tablet und Desktop.',
  },

  // MOBILE / RESPONSIVE — RU
  {
    keywords: [
      'мобильный',
      'телефон',
      'смартфон',
      'адаптив',
      'адаптация',
      'планшет',
    ],
    response: 'Да, сайты адаптируются под телефон, планшет и компьютер.',
  },

  // SUPPORT — DE
  {
    keywords: [
      'support',
      'pflege',
      'wartung',
      'änderungen',
      'updates',
      'betreuung',
    ],
    response:
      'Support und weitere Betreuung können individuell besprochen werden — je nach Projekt und Bedarf.',
  },

  // SUPPORT — RU
  {
    keywords: [
      'поддержка',
      'обслуживание',
      'изменения',
      'обновления',
      'сопровождение',
    ],
    response:
      'Поддержку и дальнейшее сопровождение можно обсудить индивидуально — в зависимости от проекта.',
  },

  // DESIGN — DE
  {
    keywords: [
      'design',
      'ui',
      'ux',
      'modern',
      'premium',
      'minimal',
      'schön',
      'ästhetisch',
      'layout',
    ],
    response:
      'Wir legen Wert auf modernes, klares und hochwertiges Design, das Vertrauen schafft und professionell wirkt.',
  },

  // DESIGN — RU
  {
    keywords: [
      'дизайн',
      'ui',
      'ux',
      'современный',
      'премиум',
      'минимализм',
      'красиво',
      'эстетика',
      'макет',
    ],
    response:
      'Мы делаем акцент на современном, чистом и качественном дизайне, который вызывает доверие.',
  },

  // REDESIGN — DE
  {
    keywords: [
      'redesign',
      'alte website',
      'website erneuern',
      'website verbessern',
      'neugestaltung',
    ],
    response:
      'Ja, wir können bestehende Websites modernisieren, strukturieren und visuell stärker machen.',
  },

  // REDESIGN — RU
  {
    keywords: [
      'редизайн',
      'старый сайт',
      'обновить сайт',
      'улучшить сайт',
      'переделать сайт',
    ],
    response:
      'Да, мы можем обновить существующий сайт, улучшить структуру и сделать его визуально сильнее.',
  },

  // LEGAL — DE
  {
    keywords: ['impressum', 'datenschutz', 'dsgvo', 'privacy', 'cookies'],
    response:
      'Informationen zu Impressum und Datenschutz finden Sie im Footer der Website.',
  },

  // LEGAL — RU
  {
    keywords: [
      'импрессум',
      'датеншутц',
      'политика',
      'конфиденциальность',
      'cookies',
      'куки',
    ],
    response:
      'Информацию о конфиденциальности и Impressum можно найти внизу сайта.',
  },

  // FUN — DE
  {
    keywords: ['du bist dumm', 'dummer bot', 'blöder bot'],
    response:
      'Vielleicht 😄 Aber ich kann trotzdem beim Website-Projekt helfen.',
  },
  {
    keywords: ['test', 'testing', 'probe'],
    response:
      'Test erfolgreich bestanden ✅ Ich funktioniere. Fast wie ein echter Kollege, nur ohne Kaffee.',
  },
  {
    keywords: ['ich liebe dich', 'liebe dich'],
    response: 'Das ist sehr nett 😄 Aber mein Herz gehört modernen Websites.',
  },
  {
    keywords: ['wetter', 'wie ist das wetter'],
    response:
      'Ich bin besser bei Websites als beim Wetter 😄 Aber ich hoffe, es ist sonnig genug für gute Ideen.',
  },
  {
    keywords: ['wer bist du', 'bist du echt', 'was bist du'],
    response:
      'Ich bin der virtuelle Assistent von Labrity 👋 Ich helfe bei Fragen rund um Websites und digitale Projekte.',
  },
  {
    keywords: ['kaffee', 'coffee', 'espresso'],
    response:
      'Kaffee klingt gut ☕ Aber zuerst: Brauchen Sie vielleicht eine neue Website?',
  },

  // FUN — RU
  {
    keywords: ['ты глупый', 'глупый бот', 'тупой бот', 'ты тупой'],
    response: 'Возможно 😄 Но с вопросами про сайты я всё равно могу помочь.',
  },
  {
    keywords: ['тест', 'проверка'],
    response:
      'Тест успешно пройден ✅ Я работаю. Почти как настоящий коллега, только без кофе.',
  },
  {
    keywords: ['я люблю тебя', 'люблю тебя'],
    response: 'Это очень мило 😄 Но моё сердце принадлежит современным сайтам.',
  },
  {
    keywords: ['погода', 'какая погода'],
    response:
      'С погодой я не лучший помощник 😄 Зато могу подсказать про сайты, дизайн и заявки клиентов.',
  },
  {
    keywords: ['кто ты', 'ты настоящий', 'что ты такое'],
    response:
      'Я виртуальный ассистент Labrity 👋 Помогаю с вопросами про сайты и digital-проекты.',
  },
  {
    keywords: ['кофе', 'кафе'],
    response:
      'Кофе — отличная идея ☕ Но сначала давайте подумаем о красивом сайте.',
  },
];
