import "server-only";
import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import Google from "next-auth/providers/google";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { getRedis } from "./redis";
import { listClientsForEmail } from "./clients";

const redis = getRedis();

const googleProvider = Google({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

const resendProvider = process.env.AUTH_RESEND_KEY
  ? Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.AUTH_EMAIL_FROM ?? "auth@roryoliver.com",
    })
  : null;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: redis ? UpstashRedisAdapter(redis) : undefined,
  providers: resendProvider
    ? [googleProvider, resendProvider]
    : [googleProvider],
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  callbacks: {
    async signIn({ user }) {
      const email = user.email;
      if (!email) return false;
      const clients = await listClientsForEmail(email);
      return clients.length > 0;
    },
    async jwt({ token, user }) {
      const email = token.email ?? user?.email;
      if (email) {
        token.accessibleClients = await listClientsForEmail(email);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessibleClients =
          (token.accessibleClients as string[] | undefined) ?? [];
      }
      return session;
    },
  },
});
