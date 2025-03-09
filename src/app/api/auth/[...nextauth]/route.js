import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import redis from "@/lib/redis";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const cachedUser = await redis.get(`user : ${credentials.email}`)
          if (cachedUser) {
            console.log("Logged In from Cache")
            return JSON.parse(cachedUser)
          }

          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          })

          const user = await response.json()

          if (!user || user.error) {
            throw new Error(user.error || "Invalid credentials");
          }
          await redis.setex(`user : ${credentials.email}`, 3600, JSON.stringify(user))
          return user;
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("Something went wrong");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
