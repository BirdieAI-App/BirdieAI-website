import GoogleProvider from "next-auth/providers/google";
import config from "@/config";
import { sendGoogleIDToken, SignInByCredentials } from "./request";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
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
      allowDangerousEmailAccountLinking: true
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
        try {const response = await SignInByCredentials(user);
          if (response) {
            // If login is successful, return the user object
            return user;
          } else {
            // If login fails, return null
            return null;
        }} catch(err) {
          console.log(err);
        }        
      }
    })
  ],
  pages: {
    signIn: '/api/auth/signin',  // Custom sign-in page
    error: '/api/auth/signin'
  },
  callbacks: {
    async jwt({ token, account }) {
      // console.log(account);
      if (account?.provider === "google"){
          token.idToken = account.id_token;
          // console.log(account.id_token);
          const data = await sendGoogleIDToken(token);
          // console.log(data);
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to a specific path after sign-in
      return baseUrl + "/dashboard";
      // return url.startsWith(baseUrl) ? url : baseUrl;
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
