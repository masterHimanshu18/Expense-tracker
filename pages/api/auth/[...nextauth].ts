import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

const clientPromise = new MongoClient(process.env.MONGO_URI || "").connect();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const client = await clientPromise;
          const db = client.db("habit_tracker_db");

          const user = await db.collection("users").findOne({ email: credentials?.email });

          if (user && bcrypt.compareSync(credentials?.password || "", user.password)) {
            return { id: user._id.toString(), name: user.name, email: user.email };
          }

          return null;
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
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
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }      
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
