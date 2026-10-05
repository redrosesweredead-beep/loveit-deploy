import Link from "next/link";
import { getSettings, getNavigation } from "@/lib/settings";
import { getCategories, getHeaderPages } from "@/lib/content";
import { IconTelegram, IconWhatsApp, IconInstagram } from "./Icons";
import LeadButton from "./LeadButton";
import { JsonLd, localBusinessJsonLd } from "@/lib/seo";

export default async function Footer() {
  const [s, , categories, headerPages] = await Promise.all([getSettings(), getNavigation(), getCategories(), getHeaderPages()]);
  const privUrl = headerPages.find((p) => /привилег/i.test(p.label))?.url || "/o-nas";
  const req = s.requisites;
  const hasReq = req.legalName || req.inn || req.ogrnip;
  const mapQuery = encodeURIComponent(s.address);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link href="/" className="logo" style={{ fontSize: "1.5rem" }}>
              <b style={{ color: "var(--gold)" }}>Love</b>
              <span style={{ color: "#fff" }}>It</span>
              <small style={{ color: "#8fb0ba" }}>Event</small>
            </Link>
            <p style={{ marginTop: 14, maxWidth: 360, color: "#a9c4cc" }}>
              {s.tagline}. Организуем свадьбы, корпоративы и дни рождения под ключ в {s.cityIn}.
            </p>
            {hasReq && (
              <div className="footer__req">
                {req.legalName && <span>{req.legalName}</span>}
                {req.inn && <span>ИНН {req.inn}</span>}
                {req.ogrnip && <span>ОГРНИП {req.ogrnip}</span>}
              </div>
            )}
          </div>

          <div>
            <h4>О компании</h4>
            <div className="footer__links">
              <Link href="/o-nas">О нас</Link>
              <Link href="/komanda">Команда</Link>
              <Link href="/kak-rabotaem">Как мы работаем</Link>
              <Link href={privUrl}>Привилегии</Link>
              <Link href="/portfolio">Портфолио</Link>
              <Link href="/ceny">Цены / Прайс-лист</Link>
              <Link href="/kalkulyator">Калькулятор</Link>
              <Link href="/kalendar">Свободные даты</Link>
              <Link href="/blog">Блог</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/kontakty">Контакты</Link>
              <Link href="/karta-sayta">Карта сайта</Link>
            </div>
          </div>

          <div>
            <h4>Услуги</h4>
            <div className="footer__links">
              {categories.map((c) => (
                <Link key={c.slug} href={`/uslugi/${c.slug}`}>{c.title}</Link>
              ))}
              <Link href="/uslugi">Все услуги</Link>
              <Link href="/ploshchadki">Площадки</Link>
            </div>
          </div>

          <div>
            <h4>Контакты</h4>
            <div className="footer__links">
              <a href={s.phoneHref}>{s.phone}</a>
              {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
              <a href={`https://yandex.ru/maps/?text=${mapQuery}`} target="_blank" rel="noopener">{s.address}</a>
              {s.workingHours && <span>{s.workingHours}</span>}
            </div>
            <div className="footer__socials">
              {s.socials.telegram && (
                <a href={s.socials.telegram} target="_blank" rel="noopener" aria-label="Telegram"><IconTelegram width={20} height={20} /></a>
              )}
              {s.socials.whatsapp && (
                <a href={s.socials.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp"><IconWhatsApp width={20} height={20} /></a>
              )}
              {s.socials.instagram && (
                <a href={s.socials.instagram} target="_blank" rel="noopener" aria-label="Instagram"><IconInstagram width={20} height={20} /></a>
              )}
              {s.extraSocials.map((soc) => (
                <a key={soc.url} href={soc.url} target="_blank" rel="noopener" aria-label={soc.label} title={soc.label} style={{ fontSize: 12, fontWeight: 700 }}>
                  {soc.label.slice(0, 2).toUpperCase()}
                </a>
              ))}
            </div>
            <LeadButton className="btn btn--ghost" source="footer">Оставить заявку</LeadButton>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {s.name}. Все права защищены.</span>
          <span className="footer__legal">
            <Link href="/politika-konfidencialnosti">Политика конфиденциальности</Link>
            <a href={`https://yandex.ru/maps/?text=${mapQuery}`} target="_blank" rel="noopener">Яндекс.Карты</a>
            <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener">Google Maps</a>
          </span>
        </div>
      </div>

      <JsonLd data={localBusinessJsonLd(s)} />
    </footer>
  );
}
