# Инструкция для тимлида: DNS, Vercel и Google Search Console для labrity.com

Для кого: человек с доступом к Vercel, Strato (DNS) и Google Search Console для
`labrity.com`. У Кристины этого доступа нет, поэтому эти шаги делает тимлид. Код
менять не нужно: вся правка кода лежит в PR (см. раздел 6).

> Честно: ни один шаг ниже не гарантирует позиции в Google. Они убирают
> препятствия и дают Google возможность найти и оценить сайт. Рост занимает
> недели и месяцы.

## 1. Что выяснено (диагностика от 22.11.2026)

| Проверка                                                                              | Результат                                                                                  |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `https://www.labrity.com/`, `/en`, `robots.txt`, `sitemap.xml` с User-Agent Googlebot | 200 OK                                                                                     |
| `robots.txt`                                                                          | `Allow: /`, указан Sitemap                                                                 |
| `noindex` / `X-Robots-Tag` на боевом домене                                           | нет (запрет стоит только для `*.vercel.app`)                                               |
| Sitemap                                                                               | корректный, после этого PR в нём 136 адресов (4 языка)                                     |
| `labrity.com` → `www.labrity.com`                                                     | **307 (временный)**, нужен постоянный                                                      |
| Домен зарегистрирован                                                                 | 05.02.2026 (новому домену около 9,5 месяцев)                                               |
| DNS-серверы                                                                           | `rzone.de` (Strato)                                                                        |
| A-запись `labrity.com`                                                                | `216.198.79.1` (Vercel)                                                                    |
| `www`                                                                                 | CNAME на `…vercel-dns-017.com` (Vercel)                                                    |
| Search Console                                                                        | в аккаунте Кристины ресурса `labrity.com` **нет**                                          |
| SiteGuard 19.11.2026 около 10:30                                                      | HTTP **403** на главной, `robots.txt`, `sitemap.xml` (три прогона подряд), позже снова 200 |

Вывод: технически сайт открыт. Вероятные причины слабой видимости: новый домен,
мало внешних ссылок, неясно, подключён ли Search Console и отправлен ли sitemap,
а также неизвестная причина разового 403.

## 2. Vercel

### 2.1. Заменить временный редирект на постоянный (важно)

1. Vercel → проект Labrity → **Settings → Domains**.
2. Домен `labrity.com` → **Edit**.
3. Выбрать «Redirect to Another Domain» → `www.labrity.com`, код **308 Permanent
   Redirect** (сейчас стоит 307).
4. Проверить: `curl -sI https://labrity.com | head -3` должен показать `308` и
   `location: https://www.labrity.com/`.
5. Убедиться, что `www.labrity.com` назначен на Production и без редиректа.

### 2.2. Выяснить 403 от 19.11.2026

1. Vercel → проект → **Logs** (фильтр по времени 19.11.2026, около 10:29–10:32
   по Германии, статус 403) и **Firewall**.
2. Проверить: нет ли включённого **Attack Challenge Mode**, правил Firewall,
   rate limit или блокировки по IP/ASN/User-Agent, а также **Deployment
   Protection** на Production.
3. Если 403 дал Firewall, найти правило и исправить так, чтобы Googlebot и
   другие проверенные боты не блокировались.
4. Если причина была в частых проверках SiteGuard с одного IP, для Google это не
   проблема, но стоит добавить IP SiteGuard в allowlist или снизить частоту
   проверок.
5. Результат записать (что было причиной), чтобы Кристина знала.

### 2.3. Preview перед merge

В Vercel откроется Preview этого PR. Preview закрыт от индексации (`noindex`),
это нормально. Его нужно только посмотреть глазами (см. раздел 6).

## 3. DNS и Strato (проверка, ничего не ломать)

1. В панели Strato → домены → `labrity.com` → DNS: убедиться, что записи
   совпадают с тем, что показывает Vercel на странице **Domains** (A для apex и
   CNAME для `www`). Менять только то, что Vercel помечает как неверное.
2. Не должно быть конфликтующих A/AAAA/CNAME для `www`, лишних записей на старый
   хостинг и просроченных NS.
3. Домен оплачен до 05.02.2028 (по RDAP), с этим всё в порядке.
4. Для Search Console понадобится добавить **TXT-запись** (раздел 4).
5. Редирект apex → www должен делаться только в Vercel, а не на стороне Strato.

## 4. Google Search Console

Подробности есть в `docs/seo/GOOGLE-SEARCH-CONSOLE.md`.

### 4.1. Свойство

1. <https://search.google.com/search-console> под аккаунтом владельца.
2. Проверить список ресурсов. Если `labrity.com` (тип «Домен») уже есть, перейти
   к 4.2. Иначе: «Добавить ресурс» → **Домен** → `labrity.com`.
3. Google покажет TXT-запись `google-site-verification=…`. Добавить её в DNS
   Strato (TXT для основного домена) → «Подтвердить» (до 24–48 ч).
4. Добавить Кристину как владельца или полного пользователя: **Settings → Users
   and permissions** (адрес её Google-аккаунта уточнить у неё). Тогда она сможет
   проверять статус индексации по каждому адресу.

### 4.2. Sitemap

1. **Sitemaps** → ввести `sitemap.xml` → Submit. Статус должен стать Success.
2. Отправлять нужно **после merge и деплоя** этого PR, чтобы Google увидел 136
   адресов, а не старые 116. Повторно отправить через 2 недели.

### 4.3. Индексация ключевых страниц (после merge)

**Проверка URL → Запросить индексирование.** Лимит примерно 10 адресов в день,
при «Quota exceeded» остановиться до завтра. Порядок:

День 1:

```
https://www.labrity.com
https://www.labrity.com/en
https://www.labrity.com/ru
https://www.labrity.com/ua
https://www.labrity.com/services
https://www.labrity.com/website-erstellen-lassen
https://www.labrity.com/webdesign
https://www.labrity.com/webentwicklung
https://www.labrity.com/prices
https://www.labrity.com/portfolio
```

День 2 (новые отраслевые страницы под Münster):

```
https://www.labrity.com/website-fuer-arztpraxis
https://www.labrity.com/website-fuer-beauty-studio
https://www.labrity.com/website-fuer-pizzeria
https://www.labrity.com/website-fuer-billardclub
https://www.labrity.com/website-fuer-apartments
https://www.labrity.com/web-app-entwickeln-lassen
https://www.labrity.com/website-relaunch
https://www.labrity.com/landingpage-erstellen-lassen
https://www.labrity.com/blog
https://www.labrity.com/contact
```

Дальше можно по списку из `Labrity-Google-Reindex-Instruction.pdf`. Остальное
Google найдёт сам по sitemap.

### 4.4. Что проверить в отчётах

1. **Индексирование → Страницы:** сколько в индексе, причины «Не в индексе»
   (скриншот Кристине). «Обнаружено, не проиндексировано» и «Просканировано, не
   проиндексировано» у нового сайта нормальны, но если их много, нужен разбор.
2. **Проверка URL** для главной: «Страница есть в Google», канонический URL
   `https://www.labrity.com`, «Доступна для индексирования: да».
3. **Меры, принятые вручную** и **Проблемы безопасности:** должны быть пустыми.
4. **Статистика сканирования** (Настройки): нет ли резких ошибок 403/5xx.
5. **Удаления (Removals):** ничего не трогать, проверить, что нет старых
   временных запросов на удаление.

## 5. Дополнительно (желательно)

1. **Google Business Profile:** сайт в профиле `https://www.labrity.com`, адрес
   и телефон такие же, как на сайте (NAP). См.
   `docs/seo/GOOGLE-BUSINESS-PROFILE-AND-BACKLINKS.md`.
2. **Bing Webmaster Tools:** импорт из Search Console, тот же sitemap.
3. **Внешние ссылки** (главный рычаг для нового домена): профили Labrity в
   Instagram и Facebook со ссылкой на сайт, честные записи в локальных каталогах
   Мюнстера и отраслевых справочниках, упоминание в портфолио клиентов, где есть
   договорённость. Покупных ссылок не делать.
4. **Не делать:** не нажимать Removals, не отправлять sitemap ежедневно, не
   запрашивать индексацию одного адреса много раз подряд, не менять код сайта
   «на лету».

## 6. Что в этом PR (для просмотра перед merge)

Ветка `feat/portfolio-concepts-and-industry-pages`. Полное описание:
`docs/seo/PR-DESCRIPTION.md`.

### Что осталось проверить людям

1. Тексты на ru и ua носителем; de и en через DeepL (в этой сессии не
   прогонялись).
2. **Needs legal review:** страница `/website-fuer-arztpraxis` (формулировки для
   врачебных практик, Heilmittelwerbegesetz) и отрасли с едой и кальяном
   (возрастные ограничения).
3. Концепт-проекты ведут на демо-сайты на `*.vercel.app`. Они закрыты от
   индексации, это нормально.
4. После merge и деплоя выполнить:

```
curl -sI https://labrity.com | head -3
curl -s https://www.labrity.com/sitemap.xml | grep -c "<loc>"
BASE_URL=https://www.labrity.com npm run seo:smoke
```

Ожидание: `308`, `136`, «All checks passed».

## 7. Порядок действий (коротко)

1. Посмотреть Preview PR → merge в `main` → дождаться деплоя.
2. Vercel: apex → www с кодом **308** (п. 2.1).
3. Vercel Logs/Firewall: выяснить 403 от 19.11 (п. 2.2).
4. Strato: сверить DNS, добавить TXT для Search Console (п. 3 и 4.1).
5. Search Console: свойство «Домен», добавить Кристину, отправить sitemap,
   запросить индексацию по списку (п. 4.2–4.3).
6. Через 3–7 дней: отчёт «Страницы», скриншот причин «Не в индексе» Кристине.
7. Параллельно: Google Business Profile, Bing, внешние ссылки (п. 5).
