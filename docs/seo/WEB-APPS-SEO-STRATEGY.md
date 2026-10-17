# SEO-стратегия для услуги «Web-App entwickeln lassen»

Страница: `/web-app-entwickeln-lassen` (DE), `/en/…`, `/ru/…`, `/ua/…`. Старый
адрес `/web-apps` перенаправляется (308).

> Честно о данных: объёмов запросов и сложности у нас нет (нет доступа к Search
> Console и платным сервисам). Ниже анализ по поисковому намерению и по тому,
> какие страницы Google показывает. Объёмы нужно проверить в Google Keyword
> Planner / Search Console после публикации. Гарантий позиций нет.

## 1. Что показывает выдача (проверено поиском)

| Запрос                                                       | Что ранжируется                                   | Намерение                          | Вывод                                                                                                       |
| ------------------------------------------------------------ | ------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Web App entwickeln lassen / individuelle Softwareentwicklung | страницы разработчиков и агентств                 | коммерческое (заказать разработку) | подходит **посадочная страница услуги**                                                                     |
| Terminbuchungssystem / Buchungssystem für Unternehmen        | готовые сервисы (SaaS), сравнения, блоги вендоров | информационное и сравнительное     | главной страницей услуги **не продвигать**; нужны статья и отдельная страница про индивидуальную разработку |

## 2. Распределение запросов по страницам

| Страница                                                                       | Основной запрос                          | Дополнительные                                                                                                               | Намерение                       |
| ------------------------------------------------------------------------------ | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `/web-app-entwickeln-lassen` (готова)                                          | Web App entwickeln lassen                | Webanwendung entwickeln lassen, individuelle Softwareentwicklung, Web-App Entwicklung, individuelle Software für Unternehmen | коммерческое                    |
| Блог: «Wie Buchungs- und Verwaltungssoftware kleinen Betrieben hilft» (готова) | Buchungssoftware kleine Betriebe         | Standardsoftware oder individuell, Terminbuchung Verwaltung                                                                  | информационное, ведёт на услугу |
| Будущая страница A                                                             | Buchungssystem entwickeln lassen         | individuelles Terminbuchungssystem, Online-Terminbuchung Website                                                             | коммерческое (узкое)            |
| Будущая страница B                                                             | CRM-Software entwickeln lassen           | individuelle CRM Software, Kundenverwaltung Software individuell                                                             | коммерческое (узкое)            |
| Будущая страница C                                                             | Zeiterfassung Software entwickeln lassen | Mitarbeiter Zeiterfassung individuell, Arbeitszeiterfassung Web-App                                                          | коммерческое (узкое)            |
| Будущая статья D                                                               | Geschäftsprozesse digitalisieren         | Prozessautomatisierung kleine Unternehmen                                                                                    | информационное, ведёт на услугу |

## 3. Что сделано на странице

- **Title / Description / H1** с основным запросом, без набивки (DE: «Web-App
  entwickeln lassen: individuelle Software | Labrity»).
- **H2/H3** по смысловым блокам: проблемы и решения, что разрабатываем (9
  направлений), для кого (6 типов бизнеса), почему индивидуально, процесс,
  вопросы, цена по запросу. Ключевые варианты: Web-App, Webanwendung,
  individuelle Software, Buchungssystem, CRM, Zeiterfassung, Geschäftsprozesse
  digitalisieren.
- **FAQ** (8 вопросов) построен по реальным формулировкам запросов («Was kostet
  es, eine Web-App entwickeln zu lassen?»).
- **Разметка Schema.org:** `Service` (со списком реальных направлений, без
  цены), `FAQPage` (вопросы видны на странице), `BreadcrumbList`. Отзывы,
  рейтинги и цены в разметку не добавлены, потому что их нет на странице.
- **Картинки:** переведённые alt-тексты, подпись «концептуальные изображения, не
  клиентские проекты».
- **Внутренние ссылки на страницу:** главная (секция), список услуг, блок услуг,
  цены, «Über uns», страницы webentwicklung и website-erstellen-lassen, футер,
  статья блога (3 ссылки в тексте). Со страницы: цены, услуги, контакты, статьи.
- **Технически:** canonical, hreflang (de, en, uk, ru, x-default), попадание в
  sitemap, отсутствие noindex, контент в серверном HTML.

## 4. Предлагаемая структура на будущее (не создавать пока)

Создавать отдельную страницу только если выполнено всё:

1. есть уникальный полезный контент (не копия основной страницы);
2. желательно один реальный пример или подробный сценарий, а не общие слова;
3. есть минимум 3 естественные ссылки на неё;
4. по данным Search Console или Keyword Planner есть спрос.

Порядок: сначала A (Buchungssystem), затем B (CRM), затем C (Zeiterfassung).
Каждая страница ссылается на `/web-app-entwickeln-lassen` как на «родителя» и на
цены/контакт. Не делайте десятки страниц «Webentwicklung + город»: Google
считает их дорвеями.

## 5. Что нужно после публикации

1. Подтвердить домен в Search Console, отправить sitemap, запросить
   индексирование страницы (см. `GOOGLE-SEARCH-CONSOLE.md`).
2. Через 4–6 недель посмотреть показы и запросы, переписать title и description
   у страниц с показами без кликов.
3. Внешние ссылки: упоминания в профессиональных сообществах, профили, партнёры
   (см. `GOOGLE-BUSINESS-PROFILE-AND-BACKLINKS.md`). Для этого запроса вес
   домена важнее текста.
4. Реальные доказательства: хотя бы 1–2 кейса или демо с согласия клиента,
   отзывы с разрешением. Без них страница убедительна хуже конкурентов.
5. Категория в Google Business Profile: «Webdesigner» или «Softwareentwickler»
   вместо «Computersupport».
6. Регулярный контент: 1–2 полезные статьи в месяц, привязанные к услуге.

Сроки результата зависят от возраста домена и конкуренции. Домену около 8
месяцев, поэтому быстрого роста ждать не стоит.
