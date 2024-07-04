import GoogleProvider from "next-auth/providers/google";
import config from "@/config";
import { sendGoogleIDToken, SignInByCredentials } from "./request";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorizationUrl: "https://accounts.google.com/o/oauth2/auth?response_type=code&prompt=consent&access_type=offline",
      callbackUrl: "https://birdie-auth.vercel.app/api/auth/callback/google",
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
        let user = { email, password };
        try {
          const response = await SignInByCredentials(user);
          if (response) {
            user.userId = response._id;
            return user;
          } else {
            return null;
          }
        } catch (err) {
          console.log("Error in authorize:", err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/api/auth/signin',
    error: '/api/auth/signin',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === "google") {
        token.idToken = account.id_token;
        try {
          const data = await sendGoogleIDToken(token);
          if (data._id) {
            token.userId = data._id;
            // console.log(token);
            return token;
          }
        } catch (err) {
          console.log("Error in sendGoogleIDToken:", err);
        }
      }
      if (user) {
        token.userId = user.userId;
        // console.log(token);
        return token;
      }
      // console.log(token);
      return token;
    },
    async session({ session, token }) {
      // console.log(token);
      if (token?.userId) {
        session.user.userId = token.userId;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/chat";
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors.main,
  },
};
