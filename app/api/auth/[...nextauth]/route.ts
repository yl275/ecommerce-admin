import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "../../../lib/db";
import { getServerSession } from "next-auth";

const adminEmails = ["googhyacinth@gmail.com"];

export const authOptions = {
  adapter: MongoDBAdapter(client),
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    session: ({ session, token, user }) => {
      if (adminEmails.includes(session.user.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!adminEmails.includes(session?.user?.email)) {
    throw "not admin";
  }
}
