import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userId: { label: "userId", type: "text", placeholder: "" },
        walletAddress: { label: "address", type: "text", placeholder: "" },
      },
      async authorize(credentials, req) {
        const walletAddress = credentials ? credentials.walletAddress : "";
        const user = { id: "5", walletAddress: walletAddress };
        return user ? user : null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: "testSecret",
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user.userId = token.id as string;
      session.user.walletAddress = token.walletAddress as string;
      return {
        ...session,
      };
    },
  },
};

export default NextAuth(authOptions);
