// Глобальные настройки сайта.
// Реальные данные взяты с текущего taplink loveitevent.ru (бренд LoveIt Event, Любовь Корнилова).
// TODO-метки — там, где данные нужно подтвердить у заказчика.

export const site = {
  name: "LoveIt Event",
  shortName: "LoveIt",
  legalName: "LoveIt Event",
  domain: "loveitevent.ru",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://loveitevent.ru",
  tagline: "Организуем события, которые хочется переживать заново",
  description:
    "Event-агентство LoveIt — организация свадеб, корпоративов и дней рождения под ключ в Тольятти, Самаре и Сызрани. Авторские форматы, площадки, шоу-программы. Берём подготовку на себя целиком.",
  city: "Тольятти",
  cityIn: "Тольятти", // предложный падеж («в Тольятти»)
  owner: "Любовь Корнилова",

  // Реальные контакты (с текущего сайта)
  phone: "+7 (909) 365-61-91",
  phoneHref: "tel:+79093656191",
  email: "Kornilovalyubov@yandex.ru",
  address: "Самарская область, г. Тольятти", // работаем: Тольятти, Самара, Сызрань, Москва и область
  workingHours: "Ежедневно 10:00–21:00", // TODO: подтвердить

  socials: {
    telegram: "https://t.me/lyubovkorrnilova",
    whatsapp: "https://wa.me/79093656191",
    instagram: "https://www.instagram.com/love.it.event",
    vk: "", // TODO: если есть
  },

  // Аналитика (уже был подключён счётчик на taplink)
  analytics: {
    yandexMetrikaId: process.env.NEXT_PUBLIC_YM_ID || "44929738",
    gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  },

  metrics: [
    { value: "8 лет", label: "на рынке событий" }, // TODO: подтвердить цифры
    { value: "500+", label: "проведённых мероприятий" },
    { value: "4.9", label: "средняя оценка гостей" },
    { value: "120+", label: "площадок-партнёров" },
  ],
};

export type Metric = (typeof site.metrics)[number];
