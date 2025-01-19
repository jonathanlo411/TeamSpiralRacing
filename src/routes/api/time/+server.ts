import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    const data = await request.json();
    
    const trackTime = await prisma.trackTime.create({
      data: {
        track: data.track,
        date: new Date(data.date),
        car: data.car,
        time: data.time,
        proof: data.proof,
        userId: locals.user.id
      }
    });

    return json(trackTime, { status: 201 });
  } catch (error) {
    return json({ error: 'Failed to save track time' }, { status: 500 });
  }
};