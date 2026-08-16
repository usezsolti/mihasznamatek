import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { isAdminEmail } from '../utils/admin';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
    session: { strategy: 'jwt' },
    pages: {
        signIn: '/',
        error: '/',
    },
    providers: [
        CredentialsProvider({
            name: 'Email',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
                name: { label: 'Name', type: 'text' },
                register: { label: 'Register', type: 'text' },
            },
            async authorize(credentials) {
                const email = String(credentials?.email || '')
                    .trim()
                    .toLowerCase();
                const password = String(credentials?.password || '');
                if (!email || !password || password.length < 6) return null;

                const wantsRegister = String(credentials?.register || '') === '1';
                let user = await prisma.user.findUnique({ where: { email } });

                if (wantsRegister) {
                    if (user?.passwordHash) {
                        throw new Error('EMAIL_IN_USE');
                    }
                    const passwordHash = await bcrypt.hash(password, 10);
                    const role = isAdminEmail(email) ? 'admin' : 'student';
                    if (user) {
                        user = await prisma.user.update({
                            where: { id: user.id },
                            data: {
                                passwordHash,
                                name: String(credentials?.name || user.name || '').trim() || user.name,
                                role,
                            },
                        });
                    } else {
                        user = await prisma.user.create({
                            data: {
                                email,
                                passwordHash,
                                name: String(credentials?.name || '').trim() || email.split('@')[0],
                                role,
                                emailVerified: null,
                            },
                        });
                    }
                } else {
                    if (!user?.passwordHash) return null;
                    const ok = await bcrypt.compare(password, user.passwordHash);
                    if (!ok) return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
        ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
            ? [
                  GoogleProvider({
                      clientId: process.env.AUTH_GOOGLE_ID,
                      clientSecret: process.env.AUTH_GOOGLE_SECRET,
                      allowDangerousEmailAccountLinking: true,
                  }),
              ]
            : []),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google' && user.email) {
                const email = user.email.toLowerCase();
                if (isAdminEmail(email)) {
                    await prisma.user.updateMany({
                        where: { email },
                        data: { role: 'admin' },
                    });
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.uid = user.id;
                token.role = (user as { role?: string }).role || 'student';
            }
            if (token.email && !token.role) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: String(token.email).toLowerCase() },
                    select: { id: true, role: true },
                });
                if (dbUser) {
                    token.uid = dbUser.id;
                    token.role = dbUser.role;
                }
            }
            if (token.email && isAdminEmail(String(token.email))) {
                token.role = 'admin';
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as { id?: string }).id = String(token.uid || token.sub || '');
                (session.user as { role?: string }).role = String(token.role || 'student');
            }
            return session;
        },
    },
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
};

export function getSession(req?: NextApiRequest, res?: NextApiResponse) {
    if (req && res) return getServerSession(req, res, authOptions);
    return getServerSession(authOptions);
}
