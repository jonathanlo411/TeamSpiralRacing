import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const posts = await prisma.blogPost.findMany({
    where: { authorId: locals.user.id },
    orderBy: { createdAt: 'desc' }
  });
  return { posts };
};

export const actions: Actions = {
  createPost: async ({ request, locals }) => {
    if (!['ADMIN', 'DRIVER'].includes(locals.user.role)) {
      return fail(403, { error: 'Unauthorized' });
    }

    const data = await request.formData();
    const title = data.get('title')?.toString();
    const content = data.get('content')?.toString();

    if (!title || !content) {
      return fail(400, { error: 'Missing required fields' });
    }

    await prisma.blogPost.create({
      data: {
        title,
        content,
        authorId: locals.user.id,
        status: 'draft'
      }
    });
  },

  deletePost: async ({ request, locals }) => {
    const data = await request.formData();
    const id = data.get('id')?.toString();

    const post = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!post || post.authorId !== locals.user.id) {
      return fail(403, { error: 'Unauthorized' });
    }

    await prisma.blogPost.delete({
      where: { id }
    });
  }
};