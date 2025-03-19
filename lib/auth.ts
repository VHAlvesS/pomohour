import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: {
    strategy: "jwt",
  },
  events: {
    async createUser({ user }) {
      try {
        await prisma.settings.create({
          data: {
            userId: user.id,
            alarmRepeat: 1,
            alarmSound: "Digital clock",
            longBreak: 15,
            longInterval: 2,
            shortBreak: 5,
            timer: 25,
            alarmVolume: 50,
          },
        });
      } catch (error) {
        console.error("Error while creating settings:", error);
      }
    },
  },
});
