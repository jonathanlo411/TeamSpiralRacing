import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';


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
    // Publish Blog immediately
    const blog = await fetch('https://data-service.teamspiralracing.com/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.DATA_SERVICE_KEY}`
      },
      body: JSON.stringify({
        blog: post.id
      })
    })
    return json({ success: true, post });
  } catch (error) {
    console.error('Failed to create post:', error);
    return json({ error: 'Failed to create post' }, { status: 500 });
  }
};

export const GET: RequestHandler = async ({ url }) => {
  try {
    // Get limit from query params, default to 10, max 50
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? Math.min(parseInt(limitParam), 50) : 10;
    
    // Get offset for pagination
    const offsetParam = url.searchParams.get('offset');
    const offset = offsetParam ? parseInt(offsetParam) : 0;

    const posts = await prisma.blogPost.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Get total count for pagination info
    const totalCount = await prisma.blogPost.count();

    return json({
      posts,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
};