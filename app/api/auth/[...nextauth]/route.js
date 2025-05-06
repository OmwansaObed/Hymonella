import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/mongoDB";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import connectToDB from "@/lib/connectDB";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 10000,
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectToDB();

          // First, find the user without selecting password
          const userExists = await User.findOne({ email: credentials.email });

          if (!userExists) {
            throw new Error("No user found with this email");
          }

          // Now specifically select the user WITH password
          const user = await User.findOne({ email: credentials.email }).select(
            "+password"
          );

          // Check if the user has a password (was registered with credentials)
          if (!user.password) {
            // Create a better error message that will be displayed to the user
            throw new Error(
              `This email is registered with a social login. Please sign in with Google.`
            );
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error("Incorrect password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin || false,
            image: user.image,
          };
        } catch (error) {
          console.error("Credentials auth error:", error);
          throw new Error(error.message || "Could not authenticate user");
        }
      },
    }),
  ],
  adapter: MongoDBAdapter(client),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login", // Custom sign-in page
    error: "/auth/login", // Error page for auth errors
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist user data and provider info in the token
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;

        // Add provider info to help with UI decisions
        if (account) {
          token.provider = account.provider;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;

        // Include provider info in the session
        if (token.provider) {
          session.user.provider = token.provider;
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
