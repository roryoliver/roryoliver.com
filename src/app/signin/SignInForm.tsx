"use client";

import styles from "./signin.module.css";

type Props = {
  hasResend: boolean;
  hasGoogle: boolean;
  error?: string;
  emailSignIn: (formData: FormData) => Promise<void>;
  googleSignIn: () => Promise<void>;
};

export default function SignInForm({
  hasResend,
  hasGoogle,
  error,
  emailSignIn,
  googleSignIn,
}: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <h1 className={styles.title}>Client portal</h1>
        <p className={styles.muted}>
          Sign in to view your dashboard. Access is restricted to allowlisted
          email addresses.
        </p>

        {error && (
          <div className={styles.error}>
            {error === "AccessDenied"
              ? "That email isn't on the access list. Contact Rory to request access."
              : "Sign in failed. Please try again."}
          </div>
        )}

        {hasGoogle && (
          <form action={googleSignIn}>
            <button type="submit" className={styles.googleButton}>
              Continue with Google
            </button>
          </form>
        )}

        {hasGoogle && hasResend && <div className={styles.divider}>or</div>}

        {hasResend && (
          <form action={emailSignIn} className={styles.emailForm}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={styles.input}
            />
            <button type="submit" className={styles.emailButton}>
              Send magic link
            </button>
          </form>
        )}

        {!hasGoogle && !hasResend && (
          <div className={styles.error}>
            No auth providers are configured. Set GOOGLE_CLIENT_ID/SECRET or
            AUTH_RESEND_KEY in your environment.
          </div>
        )}
      </div>
    </div>
  );
}
