import type { Metadata, Viewport } from "next";
import { Open_Sans, Cormorant_Garamond } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import BackToTop from "@/components/BackToTop";
import RefreshOnSave from "@/components/RefreshOnSave";
import Analytics from "@/components/Analytics";
import PromoBar from "@/components/PromoBar";
import { getSettings, getNavigation } from "@/lib/settings";
import { getCategories, getFormats, getPromo, getCities, getHeaderPages } from "@/lib/content";

const openSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-open-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-cormorant",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(s.url),
    title: {
      // Без маски бренда в title — заголовок страницы выводится как есть (SEO-требование).
      // Название компании остаётся в Open Graph и в описании.
      default: `${s.name} — организация свадеб, корпоративов и дней рождения в ${s.cityIn}`,
      template: `%s`,
    },
    description: s.description,
    keywords: [
      "организация мероприятий Москва",
      "event-агентство",
      "организация свадьбы под ключ",
      "организация корпоратива",
      "организация дня рождения",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: s.url,
      siteName: s.name,
      title: `${s.name} — события под ключ в ${s.cityIn}`,
      description: s.description,
    },
    // Тестовый режим: SITE_NOINDEX=1 в .env полностью закрывает сайт от индексации.
    // На боевом домене убрать флаг — вернётся index/follow.
    robots:
      process.env.SITE_NOINDEX === "1"
        ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
        : { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#3d3d3d",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [s, nav, categories, formats, promo, cities, headerPages] = await Promise.all([
    getSettings(),
    getNavigation(),
    getCategories(),
    getFormats(),
    getPromo(),
    getCities(),
    getHeaderPages(),
  ]);
  const cityNav = cities.map((c) => ({ name: c.name, slug: c.slug }));

  // «О нас» — выпадающее меню (сам пункт ведёт на /o-nas).
  // Привилегии (страница конструктора), Блог и Контакты убраны из плоского меню
  // в эту выпадашку.
  const isPriv = (x: { label: string }) => /привилег/i.test(x.label);
  const privItem =
    headerPages.map((p) => ({ label: p.label, url: p.url })).find(isPriv) ||
    nav.header.find(isPriv);
  const aboutItems = [
    { label: "Как мы работаем", url: "/kak-rabotaem" },
    { label: "Отзывы", url: "/otzyvy" },
    { label: "FAQ", url: "/faq" },
    { label: "Команда", url: "/komanda" },
    ...(privItem ? [{ label: privItem.label, url: privItem.url }] : []),
    { label: "Блог", url: "/blog" },
    { label: "Контакты", url: "/kontakty" },
  ];
  // Плоское меню: без «О нас», без Блога/Контактов и без Привилегий (они ушли в выпадашку).
  const headerNav = [
    ...nav.header.filter(
      (i) => i.url !== "/o-nas" && i.url !== "/blog" && i.url !== "/kontakty" && !isPriv(i),
    ),
    ...headerPages.filter((p) => !isPriv(p)).map((p) => ({ label: p.label, url: p.url })),
  ];

  // Мега-меню «Услуги»: категории с их форматами.
  const servicesMenu = categories.map((c) => ({
    title: c.menuTitle,
    url: `/uslugi/${c.slug}`,
    formats: formats
      .filter((f) => f.categorySlugs.includes(c.slug))
      .map((f) => ({ title: f.title, url: `/uslugi/${c.slug}/${f.slug}` })),
  }));

  return (
    <html lang="ru" className={`${openSans.variable} ${cormorant.variable}`}>
      <body>
        <PromoBar promo={promo} />
        <Header
          navItems={headerNav}
          services={servicesMenu}
          cities={cityNav}
          about={{ url: "/o-nas", items: aboutItems }}
          phone={s.phone}
          phoneHref={s.phoneHref}
          email={s.email}
          workingHours={s.workingHours}
          socials={s.socials}
        />
        <main>{children}</main>
        <Footer />
        <FloatingActions />
        <BackToTop />
        <RefreshOnSave />
        <Analytics />
      </body>
    </html>
  );
}
