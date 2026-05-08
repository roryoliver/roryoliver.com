import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isApi = nextUrl.pathname.startsWith("/api/jira");
  const isClient = nextUrl.pathname.startsWith("/clients");

  if (!isApi && !isClient) return;
  if (req.auth) return;

  if (isApi) {
    return new Response(null, { status: 404 });
  }

  const signInUrl = new URL("/signin", nextUrl.origin);
  signInUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
  return Response.redirect(signInUrl);
});

export const config = {
  matcher: ["/clients/:path*", "/api/jira/:path*"],
};
