import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch, url }) => {
  if (!locals.user) {
    throw redirect(303, '/login');
  }

  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 50; // Files per page

  const response = await fetch(`/api/cloudflare?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }
  
  const data = await response.json();
  
  return {
    files: data.files,
    totalFiles: data.totalFiles,
    totalPages: data.totalPages,
    currentPage: page
  };
};