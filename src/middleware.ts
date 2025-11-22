import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/auth/signin',
  },
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/policies/:path*',
    '/ghe/:path*',
    '/coi/:path*',
    '/whistleblowing/:path*',
    '/abac/:path*',
    '/fraud/:path*',
    '/analytics/:path*',
    '/settings/:path*',
  ],
}
