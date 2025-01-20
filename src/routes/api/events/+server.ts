import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user || locals.user.role === 'USER') {
    return json({ error: 'Not authorized' }, { status: 403 });
  }

  const data = await request.json();
  const { title, imageRef, datetime, location, description } = data;

  // Validate the data
  if (!title || !imageRef || !datetime || !location || !description) {
    return json({
      error: 'Missing required fields',
      missing: {
        title: !title,
        imageRef: !imageRef,
        datetime: !datetime,
        location: !location,
        description: !description
      }
    }, { status: 400 });
  }

  try {
    const event = await prisma.event.create({
      data: {
        title,
        imageRef,
        datetime: new Date(datetime),
        location,
        description,
        createdById: locals.user.id // Associate the event with the authenticated user
      }
    });

    return json({ success: true, event });
  } catch (error) {
    console.error('Failed to create event:', error);
    return json({ error: 'Failed to create event' }, { status: 500 });
  }
};
