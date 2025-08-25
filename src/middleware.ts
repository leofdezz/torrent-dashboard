import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin';
        }
        
        // Protect main dashboard (require any authenticated user)
        if (req.nextUrl.pathname === '/') {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/', '/admin/:path*']
};
