import { NextResponse, type NextRequest } from "next/server";

// Gate rápido: sem cookie de sessão, nem entra no /dashboard.
// A verificação criptográfica completa acontece nas páginas (exigirSessao).
export function proxy(req: NextRequest) {
  const tem = req.cookies.get("liso_sess")?.value;
  if (!tem) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
