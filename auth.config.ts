import { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        // params: {
        //   promt: "consent",
        //   access_type: "offline",
        //   response_type: "code",
        //   hd: "ucsc.edu"
        // }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
} satisfies NextAuthConfig;