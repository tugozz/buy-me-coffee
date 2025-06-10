import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();

  if (isProtectedRoute(req)) {
    const metadata = (sessionClaims as any)?.metadata || {};
    const isProfileCompleted = metadata.isProfileCompleted;
    const isCardCompleted = metadata.isCardCompleted;

    if (!isProfileCompleted) {
      const url = new URL("/profile", req.url);
      return NextResponse.redirect(url);
    }
    if (!isCardCompleted) {
      const url = new URL("/card-profile", req.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
