import type { Metadata } from "next";
import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign in — Rory Oliver",
  robots: { index: false, follow: false },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;
  const session = await auth();

  if (session?.user) {
    if (callbackUrl) redirect(callbackUrl);
    const slug = session.user.accessibleClients?.[0];
    if (slug) redirect(`/clients/${slug}/sprints`);
    redirect("/");
  }

  const hasResend = Boolean(process.env.AUTH_RESEND_KEY);
  const hasGoogle = Boolean(process.env.GOOGLE_CLIENT_ID);

  async function emailSignIn(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim();
    if (!email) return;
    await signIn("resend", {
      email,
      redirectTo: callbackUrl ?? "/",
    });
  }

  async function googleSignIn() {
    "use server";
    await signIn("google", { redirectTo: callbackUrl ?? "/" });
  }

  return (
    <SignInForm
      hasResend={hasResend}
      hasGoogle={hasGoogle}
      error={error}
      emailSignIn={emailSignIn}
      googleSignIn={googleSignIn}
    />
  );
}
