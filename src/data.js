/* =============================================================
   ИВАН STUDIO — ДАННЫЕ САЙТА
   Всё редактируемое содержимое собрано здесь.
   Чтобы добавить проект — добавьте объект в массив PROJECTS.
   ============================================================= */

/* ---------- 1. КОНТАКТЫ ---------- */
const CONTACTS = {
  telegramHandle: '@ivxtx',
  telegramUrl: 'https://t.me/ivxtx',
  email: 'ivanmakogon10@gmail.com',
  phone: '+7 989 722-40-22',
  phoneHref: 'tel:+79897224022'
};

/* ---------- 2. ПРОЕКТЫ ----------
   Поля:
   id        — уникальный ключ (используется в адресе: #project=karate)
   number    — порядковый номер в портфолио
   title     — название
   summary   — короткое описание (видно в сетке)
   categories— массив категорий
   year      — год ('' если не указывать)
   status    — 'released' | 'soon'
   cover     — ключ генеративной обложки ('arc' | 'menu' | 'flow' | 'ghost')
   letter    — буква для обложки 'ghost' (концепты)
   image     — путь к реальному изображению. Если задан — заменяет обложку.
   span      — раскладка в сетке: [колонки на десктопе, пропорция]
   case      — материалы кейса. Пустая строка / пустой массив = «в подготовке».
*/
const PROJECTS = [
  {
    id: 'karate',
    number: '01',
    title: 'Карате-клуб',
    summary: 'Сайт спортивного клуба.',
    categories: ['Web Design', 'Development'],
    year: '',
    status: 'released',
    cover: 'arc',
    image: null,
    span: { col: 'span 12', ratio: '16 / 7' },
    case: {
      role: ['Дизайн', 'Разработка'],
      task: '',
      solution: '',
      stack: [],
      process: [],
      gallery: []
    }
  },
  {
    id: 'restaurant',
    number: '02',
    title: 'Ресторан',
    summary: 'Концептуальный digital-сайт ресторана.',
    categories: ['Web Design', 'UX/UI'],
    year: '',
    status: 'released',
    cover: 'menu',
    image: null,
    span: { col: 'span 4', ratio: '4 / 3' },
    case: {
      role: ['Дизайн', 'UX/UI'],
      task: '',
      solution: '',
      stack: [],
      process: [],
      gallery: []
    }
  },
  {
    id: 'business-landing',
    number: '03',
    title: 'Business Landing',
    summary: 'Коммерческий landing page.',
    categories: ['Web Design', 'Development'],
    year: '',
    status: 'released',
    cover: 'flow',
    image: null,
    span: { col: 'span 4', ratio: '4 / 3' },
    case: {
      role: ['Дизайн', 'Разработка'],
      task: '',
      solution: '',
      stack: [],
      process: [],
      gallery: []
    }
  }
];

/* ---------- 3. КОНЦЕПТУАЛЬНЫЕ ПРОЕКТЫ ----------
   Места под будущие кейсы. Когда проект будет готов —
   перенесите объект в PROJECTS и поменяйте status на 'released'.
*/
const CONCEPTS = [
  { id: 'aura',  number: '04', title: 'AURA',  kind: 'Concept project', letter: 'A', status: 'soon' },
  { id: 'mono',  number: '05', title: 'MONO',  kind: 'Concept project', letter: 'M', status: 'soon' },
  { id: 'pulse', number: '06', title: 'PULSE', kind: 'Concept project', letter: 'P', status: 'soon' }
];

/* ---------- 4. ПОДХОД ---------- */
const APPROACH = [
  {
    number: '01',
    title: 'Исследование',
    text: 'Понимание задачи, аудитории и контекста.',
    detail: 'Смотрю, чем живёт ниша, что делают соседи по рынку и какой сценарий приводит человека на сайт.'
  },
  {
    number: '02',
    title: 'Структура',
    text: 'Информационная архитектура и логика взаимодействия.',
    detail: 'Порядок блоков, глубина разделов, точки принятия решения. Сетка появляется раньше картинки.'
  },
  {
    number: '03',
    title: 'Интерфейс',
    text: 'Визуальная система, типографика и UI.',
    detail: 'Шкала размеров, токены цвета, состояния элементов. Одна система вместо набора экранов.'
  },
  {
    number: '04',
    title: 'Движение',
    text: 'Micro-interactions и motion, которые помогают интерфейсу.',
    detail: 'Анимация отвечает на действие и подсказывает, что произошло. Всё лишнее выключается.'
  }
];

/* ---------- 4б. О СТУДИИ ----------
   portrait: путь к фотографии. null — показывается место под фото.
*/
const ABOUT = {
  label: 'Digital Design',
  text: 'Создаю цифровые продукты: сайты, интерфейсы и визуальные системы, которые работают на задачу и на людей.',
  portrait: null,
  roles: [
    'Дизайнер интерфейсов',
    'Дизайн цифровых продуктов',
    'Вёрстка и фронтенд',
    'Визуальные системы'
  ],
  kicker: 'Делать продукты, которыми хочется пользоваться.'
};

/* ---------- 5. УСЛУГИ ---------- */
const SERVICES = [
  {
    id: 'landing',
    title: 'Landing page',
    price: 25000,
    scope: 'Одна страница, один сценарий: первый экран, аргументы, форма.'
  },
  {
    id: 'corporate',
    title: 'Корпоративный сайт',
    price: 45000,
    scope: 'Многостраничная структура, разделы, каталог услуг, редактируемый контент.'
  },
  {
    id: 'shop',
    title: 'Интернет-магазин',
    price: 65000,
    scope: 'Каталог, карточка товара, корзина, оформление заказа.'
  },
  {
    id: 'turnkey',
    title: 'Сайт под ключ',
    price: 50000,
    scope: 'Дизайн, вёрстка, сборка, домен и публикация — одним процессом.'
  },
  {
    id: 'uxui',
    title: 'UX/UI дизайн',
    price: 20000,
    scope: 'Структура, прототип, интерфейс и макеты под передачу в разработку.'
  }
];

/* ---------- 6. КАЛЬКУЛЯТОР ----------
   base — стартовая сумма, множители перемножаются,
   надбавки складываются поверх.
*/
const CALC = {
  type: {
    label: 'Тип проекта',
    options: [
      { id: 'landing',   label: 'Landing page',        base: 25000 },
      { id: 'corporate', label: 'Корпоративный сайт',  base: 45000 },
      { id: 'shop',      label: 'Интернет-магазин',    base: 65000 },
      { id: 'turnkey',   label: 'Сайт под ключ',       base: 50000 },
      { id: 'uxui',      label: 'UX/UI дизайн',        base: 20000 }
    ]
  },
  scope: {
    label: 'Что требуется',
    def: 'both',
    options: [
      { id: 'design', label: 'Только дизайн',        mult: 0.75 },
      { id: 'dev',    label: 'Только разработка',    mult: 0.8 },
      { id: 'both',   label: 'Дизайн + разработка',  mult: 1 }
    ]
  },
  volume: {
    label: 'Примерный объём',
    options: [
      { id: 's',  label: 'До 3 экранов',   mult: 1 },
      { id: 'm',  label: '4–7 экранов',    mult: 1.35 },
      { id: 'l',  label: '8–15 экранов',   mult: 1.8 },
      { id: 'xl', label: 'Больше 15',      mult: 2.3 }
    ]
  },
  extras: {
    label: 'Дополнительные функции',
    options: [
      { id: 'motion', label: 'Анимация и motion',        add: 0.15 },
      { id: 'cms',    label: 'Админка / редактирование', add: 0.18 },
      { id: 'i18n',   label: 'Вторая языковая версия',   add: 0.2 },
      { id: 'integr', label: 'Интеграции: CRM, оплата',  add: 0.22 },
      { id: 'seo',    label: 'SEO-подготовка',           add: 0.1 }
    ]
  }
};

/* ---------- 7. БРИФ ---------- */
const BRIEF_STEPS = [
  {
    id: 'product',
    number: '01',
    question: 'Что нужно создать?',
    type: 'choice',
    options: ['Landing', 'Корпоративный сайт', 'Интернет-магазин', 'Digital product', 'Другое']
  },
  {
    id: 'work',
    number: '02',
    question: 'Что нужно сделать?',
    type: 'choice',
    options: ['Только дизайн', 'Только разработка', 'Дизайн + разработка']
  },
  {
    id: 'budget',
    number: '03',
    question: 'Какой ориентировочный бюджет?',
    type: 'choice',
    options: ['25–50 тыс. ₽', '50–100 тыс. ₽', '100–200 тыс. ₽', '200 тыс. ₽+']
  },
  {
    id: 'timing',
    number: '04',
    question: 'Когда планируете запуск?',
    type: 'choice',
    options: ['Как можно скорее', 'В течение месяца', '1–2 месяца', 'Пока изучаю варианты']
  },
  {
    id: 'contact',
    number: '05',
    question: 'Как с вами связаться?',
    type: 'contact',
    fields: [
      { id: 'name',     label: 'Имя',      type: 'text',  autocomplete: 'name',  required: true },
      { id: 'telegram', label: 'Telegram', type: 'text',  autocomplete: 'off',   placeholder: '@username' },
      { id: 'phone',    label: 'Телефон',  type: 'tel',   autocomplete: 'tel',   placeholder: '+7 900 000-00-00' },
      { id: 'email',    label: 'Email',    type: 'email', autocomplete: 'email', placeholder: 'you@mail.ru' }
    ],
    hint: 'Достаточно одного способа связи — выберите удобный.'
  },
  {
    id: 'about',
    number: '06',
    question: 'Расскажите немного о проекте',
    type: 'text',
    placeholder: 'Чем занимаетесь, что уже есть, на что стоит посмотреть.',
    hint: 'Необязательно, но помогает ответить по делу.'
  }
];

/* ---------- 8. ОТПРАВКА ЗАЯВКИ ----------
   Сейчас backend не подключён: заявка собирается на клиенте.
   Чтобы подключить приём — задайте BRIEF_ENDPOINT (webhook / серверная
   функция / CRM) либо TELEGRAM.botToken + TELEGRAM.chatId.
*/
const BRIEF_ENDPOINT = null;          // напр. 'https://example.com/api/brief'
const TELEGRAM_BOT = { token: null, chatId: null };

async function submitBrief(payload) {
  if (BRIEF_ENDPOINT) {
    const res = await fetch(BRIEF_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Сервер не принял заявку');
    return { ok: true };
  }
  if (TELEGRAM_BOT.token && TELEGRAM_BOT.chatId) {
    const text = Object.entries(payload)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
      .join('\n');
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT.token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_BOT.chatId, text })
    });
    if (!res.ok) throw new Error('Telegram не принял заявку');
    return { ok: true };
  }
  // Приём ещё не подключён — сохраняем заявку локально, чтобы ничего не потерять.
  try {
    const box = JSON.parse(localStorage.getItem('ivan-briefs') || '[]');
    box.push({ at: new Date().toISOString(), payload });
    localStorage.setItem('ivan-briefs', JSON.stringify(box));
  } catch (_) { /* приватный режим — пропускаем */ }
  console.info('[Иван Studio] Заявка (backend не подключён):', payload);
  return { ok: true, pending: true };
}
