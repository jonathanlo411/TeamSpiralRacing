import { invalidateSession } from "$lib/server/auth";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, locals }) => {
    try {
      const sessionToken = cookies.get('session');
      if (sessionToken) {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));
        await invalidateSession(sessionId);
      }
  
      const headers = new Headers();
      headers.append('Set-Cookie', 'session=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict');
      
      return new Response(null, {
        status: 303,
        headers
      });
    } catch (err) {
      console.error('Error in signout:', err);
      throw redirect(303, '/');
    }
  };