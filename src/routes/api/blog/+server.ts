import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user || locals.user.role === 'USER') {
    return json({ error: 'Not authorized' }, { status: 403 });
  }

  const data = await request.json();
  const { title, imageRef, content } = data;

  if (!title || !imageRef || !content) {
    return json({ 
      error: 'Missing required fields',
      missing: {
        title: !title,
        imageRef: !imageRef,
        content: !content
      }
    }, { status: 400 });
  }

  try {
    const post = await prisma.blogPost.create({
      data: {
        title,
        imageRef,
        content,
        authorId: locals.user.id
      }
    });

    return json({ success: true, post });
  } catch (error) {
    console.error('Failed to create post:', error);
    return json({ error: 'Failed to create post' }, { status: 500 });
  }
};