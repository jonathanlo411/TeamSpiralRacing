import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  if (!locals.user) {
    throw redirect(303, '/login');
  }

  const response = await fetch('/api/cloudflare');
  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }

  const { files } = await response.json();
  return {
    files
  };
};
