import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { saveUser, searchUser } from "../../../lib/user";
import { capitaliseFirstLetter } from "../../../lib/prisma-util";
const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "custom-login",
      name: "Credentials",
      credentials: {
        displayName: {
          label: "DisplayName",
          type: "text",
          placeholder: "Display Name",
        },
        username: { label: "Username", type: "text", placeholder: "Username" },
        email: { label: "Email", type: "email", placeholder: "Email" },
        profileImage: {
          label: "Profile Image",
          type: "text",
          placeholder: "Profile Image",
        },
        walletAddress: { label: "Wallet Address", type: "text" },
      },
      async authorize(credentials, req) {
        console.log(credentials);
        if (!credentials) return null;

        const { displayName, username, email, profileImage, walletAddress } =
          credentials;
        const user = await retrieveUserByWallet(walletAddress);

        if (user) return user;

        const createdUser = await createUserUsingWallet(
          displayName,
          username,
          email,
          profileImage,
          walletAddress
        );
        if (createdUser) return createdUser;

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
    const user = await searchUser({
      walletAddress: walletAddress,
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
  displayname: string,
  username: string,
  email: string,
  profilePicture: string,
  walletAddress: string
) {
  try {
    const userInfo = {
      displayName: capitaliseFirstLetter(displayname),
      username: username,
      email: email,
      profilePic: profilePicture,
      walletAddress: walletAddress,
    };

    const user = await saveUser(userInfo);
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default NextAuth(authOptions);
