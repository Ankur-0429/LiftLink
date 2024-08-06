import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { FirestoreAdapter } from "@auth/firebase-adapter"

export const {
    handlers: {GET, POST},
    auth,
} = NextAuth({...authConfig, adapter: FirestoreAdapter(), session: {strategy: 'jwt'}});