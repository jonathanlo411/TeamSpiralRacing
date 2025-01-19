import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user || locals.user.role !== "DRIVER") {
    throw error(401, 'Unauthorized');
  }

  try {
    const data = await request.json();

    const trackTime = await prisma.trackTime.create({
      data: {
        track: data.track,
        configuration: data.configuration, // New field
        date: new Date(data.date),
        car: data.car,
        tag: data.tag, // New field
        time: data.time,
        proof: data.proof,
        userId: locals.user.id,
      },
    });

    return json(trackTime, { status: 201 });
  } catch (error) {
    console.log(error)
    return json({ error: 'Failed to save track time' }, { status: 500 });
  }
};