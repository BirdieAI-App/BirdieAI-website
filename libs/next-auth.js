import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import connectMongo from "./mongo";
import { sendGoogleIDToken } from "./request";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/dist/server/api-utils";

export const authOptions = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const {email, password} = credentials;
        const user = { email: email, password: password};
        // console.log(user);
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          // console.log(user);
          return user;
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
        return null;
      }
    }),
    // Follow the "Login with Email" tutorial to set up your email server
    // Requires a MongoDB database. Set MONOGODB_URI env variable.
    ...(connectMongo
      ? [
          EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: config.mailgun.fromNoReply,
          }),
        ]
      : []),
  ],
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models
  ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),
  // pages: {
  //   signIn: '/api/auth/signin',  // Custom sign-in page
  // },
  callbacks: {
    async jwt({ token, account }) {
      // console.log(account);
      if (account?.provider === "google"){
          token.idToken = account.id_token;
          // console.log(account.id_token);
          const data = await sendGoogleIDToken(token);
          console.log(data);
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to a specific path after sign-in
      return baseUrl + "/dashboard";
    }
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    // logo: `https://${config.domainName}/logoAndName.png`,
  },
};
