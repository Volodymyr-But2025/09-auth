import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

const isRouteMatch = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isPrivateRoute = privateRoutes.some((route) =>
    isRouteMatch(pathname, route),
  );
  const isPublicRoute = publicRoutes.some((route) =>
    isRouteMatch(pathname, route),
  );

  if (!isPrivateRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
    return NextResponse.next();
  }

  if (refreshToken) {
    const sessionUrl = new URL("/api/auth/session", req.url);
    const sessionRes = await fetch(sessionUrl.toString(), {
      headers: { cookie: req.headers.get("cookie") ?? "" },
      cache: "no-store",
    });

    if (sessionRes.ok) {
      const body = await sessionRes.json();
      if (body?.success) {
        if (isPublicRoute) {
          return NextResponse.redirect(new URL("/profile", req.url));
        }

        const response = NextResponse.next();
        const setCookie = sessionRes.headers.get("set-cookie");
        if (setCookie) {
          response.headers.set("set-cookie", setCookie);
        }
        return response;
      }
    }
  }

  if (isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
