import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "Name" },
        email: { label: "Email", type: "email", placeholder: "Email" },
        profileImage: {
          label: "Profile Image",
          type: "text",
          placeholder: "Profile Image",
        },
        walletAddress: { label: "Wallet Address", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        const { name, email, profileImage, walletAddress } = credentials;
        const user = await retrieveUserByWallet(walletAddress);
        if (user) return user;

        const createdUser = await createUserUsingWallet(
          name,
          email,
          profileImage,
          walletAddress
        );

        if (createdUser) return user;

        return null;
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

// Helper functions
async function retrieveUserByWallet(walletAddress: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        walletAddress: walletAddress,
      },
    });

    if (user) {
      return {
        id: user.userId,
        walletAddress: walletAddress,
      } as any;
    } else return null;
  } catch (error) {
    return null;
  }
}

async function createUserUsingWallet(
  name: string,
  email: string,
  profilePicture: string,
  walletAddress: string
) {
  try {
    const user = await prisma.user.create({
      data: {
        username: name,
        email: email,
        profilePic: profilePicture,
        walletAddress: walletAddress,
      },
    });

    if (user) {
      return {
        id: user.userId,
        walletAddress: walletAddress,
      } as any;
    } else return null;
  } catch (error) {
    return null;
  }
}

export default NextAuth(authOptions);
