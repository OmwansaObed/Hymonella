import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/mongoDB";
import User from "@/models/user.model";
import connectToDB from "@/lib/connectDB";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: { timeout: 10000 },
    }),
  ],

  adapter: MongoDBAdapter(client),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      await connectToDB();

      if (account?.provider === "google") {
        let dbUser = await User.findOne({ email: token.email });

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            isAdmin: false,
            favorites: [],
            comments: [],
            ratings: [],
          });
        }

        token.id = dbUser._id.toString();
        token.isAdmin = dbUser.isAdmin;
        token.favorites = dbUser.favorites || [];
        token.comments = dbUser.comments || [];
        token.ratings = dbUser.rings || [];
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
        session.user.favorites = token.favorites || [];
        session.user.comments = token.comments || [];
        session.user.ratings = token.ratings || [];
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
