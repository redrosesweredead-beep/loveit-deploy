"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Slide } from "@/lib/data";

export default function Slider({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  if (!n) return null;

  return (
    <section className="slider" aria-roledescription="carousel">
      {slides.map((s, idx) => {
        // Баннер-слайд: если у слайда нет подписи и кнопки, текст «вшит» в саму
        // картинку (готовый баннер). Тогда не рисуем затемнение и заголовок поверх —
        // показываем изображение чисто, по центру.
        const banner = !s.subtitle && !s.buttonText;
        return (
          <div key={idx} className={`slide ${idx === i ? "is-active" : ""} ${banner ? "slide--banner" : ""}`} aria-hidden={idx !== i}>
            {s.imageMobile ? (
              <>
                <Image src={s.image} alt={s.title} fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center" }} priority={idx === 0} className="slide__img slide__img--desktop" />
                <Image src={s.imageMobile} alt={s.title} fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center" }} priority={idx === 0} className="slide__img slide__img--mobile" />
              </>
            ) : (
              <Image src={s.image} alt={s.title} fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center" }} priority={idx === 0} />
            )}
            {!banner && (
              <>
                <div className="slide__overlay" />
                <div className="container slide__content">
                  {idx === 0 ? (
                    <h1 className="slide__title">{s.title}</h1>
                  ) : (
                    <h2 className="slide__title">{s.title}</h2>
                  )}
                  {s.subtitle && <p className="slide__subtitle">{s.subtitle}</p>}
                  {s.buttonText && s.buttonUrl && (
                    <Link href={s.buttonUrl} className="btn btn--primary">{s.buttonText}</Link>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}

      {n > 1 && (
        <div className="slider__dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`slider__dot ${idx === i ? "is-active" : ""}`}
              aria-label={`Слайд ${idx + 1}`}
              onClick={() => setI(idx)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
