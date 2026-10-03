import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Сайт переведён на прямое подключение к серверу (без Cloudflare-прокси).
// Вход в CMS защищён стандартным логином Payload, поэтому доступ к /admin и /api
// больше не режем по признаку Cloudflare (cf-ray) — раньше это прятало админку,
// но после перехода на прямой режим мешало входу. Пропускаем всё как есть.
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
