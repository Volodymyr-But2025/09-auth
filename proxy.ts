import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parse } from "cookie";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

const isRouteMatch = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

const splitSetCookieHeader = (header: string) =>
  header
    .split(/,(?=\s*[^=;]+=)/)
    .map((cookie) => cookie.trim())
    .filter(Boolean);

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
      return NextResponse.redirect(new URL("/", req.url));
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
          return NextResponse.redirect(new URL("/", req.url));
        }

        const response = NextResponse.next();
        const setCookieHeader = sessionRes.headers.get("set-cookie");

        if (setCookieHeader) {
          const cookieStrings = splitSetCookieHeader(setCookieHeader);

          for (const cookieString of cookieStrings) {
            const parsed = parse(cookieString);
            const cookieName = Object.keys(parsed).find(
              (name) => name === "accessToken" || name === "refreshToken",
            );
            if (!cookieName) continue;

            const cookieValue = parsed[cookieName];
            if (!cookieValue) continue;

            response.cookies.set(cookieName, cookieValue, {
              path: parsed.Path ?? "/",
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
              httpOnly: /httponly/i.test(cookieString),
              secure: /secure/i.test(cookieString),
              sameSite: parsed.SameSite as
                | "strict"
                | "lax"
                | "none"
                | undefined,
            });
          }
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
