import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("Usuario no encontrado");

        const matchPassword = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!matchPassword) throw new Error("Contraseña incorrecta");

        // Retornamos el objeto User completo
        return {
          id: user.id,
          name: user.full_name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // 1. Al loguearse, metemos el ID y el ROL dentro del Token encriptado (JWT)
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;     
        token.role = user.role; 
      }
      return token;
    },
    // 2. Cada vez que el frontend o la API piden sesión, sacamos los datos del Token
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;     
        session.user.role = token.role; 
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};