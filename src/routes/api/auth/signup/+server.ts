import { json } from '@sveltejs/kit';
import { createUser } from '$lib/server/auth';

export async function POST({ request }) {
  const { email, password, firstName, lastName } = await request.json();
  
  try {
    await createUser(email, password, firstName, lastName);
    return json({ success: true });
  } catch (error) {
    return json({ message: 'Email already exists' }, { status: 400 });
  }
}