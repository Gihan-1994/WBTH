import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // 1. Check if user exists
        if (!user || !user.password_hash) {
          // Returning null or throwing an error will trigger the redirect to the error page.
          // We throw a specific error to be handled on the client.
          throw new Error("Invalid credentials");
        }

        // 2. Check if password matches
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // 3. Return user object if everything is valid
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    // You can uncomment and create these pages if you need them
    // error: '/auth/error', // The page to redirect to on errors
    // verifyRequest: '/auth/verify-request', // (used for email provider)
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
