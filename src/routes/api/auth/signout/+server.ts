import { redirect, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, locals }) => {
  try {
      // Remove from database
      const sessionId = cookies.get('sessionId');
      if (sessionId) {
          await prisma.session.delete({
              where: { id: sessionId }
          });
      }

      // Clear all cookies
      const allCookies = cookies.getAll();
      allCookies.forEach(cookie => {
          cookies.delete(cookie.name, { 
              path: '/',
              domain: undefined,
              secure: true,
              httpOnly: true,
              sameSite: 'strict'
          });
      });

      // Reset locals
      locals.user = {
          id: '',
          email: '',
          firstName: null,
          lastName: null,
          role: 'USER'
      };

      const headers = new Headers();
      headers.set('Location', '/');
      headers.append('Set-Cookie', 'sessionId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict');
      headers.append('Set-Cookie', 'auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict');
      
      return new Response(null, {
          status: 303,
          headers
      });
  } catch (err) {
      console.error('Error in signout:', err);
      throw redirect(303, '/');
  }
};