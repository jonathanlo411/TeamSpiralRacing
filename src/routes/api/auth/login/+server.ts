import { json } from '@sveltejs/kit';
import { loginUser } from '$lib/server/auth';

export async function POST({ request, cookies }) {
  const { email, password } = await request.json();
  
  const result = await loginUser(email, password);
  
  if (!result) {
    return json({ message: 'Invalid email or password' }, { status: 401 });
  }
  
  const { token } = result;
  cookies.set('session', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });

  return json({ success: true });
}
