import { handlers } from "../auth"; // Referring to the auth.ts we just created

export const { GET, POST } = handlers;
export const runtime = "edge"; // optional

// import NextAuth from 'next-auth';
// import { authOptions } from '@/config/authOptions';

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
