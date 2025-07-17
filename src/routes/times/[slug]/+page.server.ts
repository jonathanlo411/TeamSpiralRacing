import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  const trackTimes = await prisma.trackTime.findMany({
    where: {
      track: slug
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    }
  });

  if (!trackTimes) {
    return {
      track: slug,
      trackTimesByConfig: {}
    };
  }

  const groupedByConfig: Record<string, any[]> = {};

  for (const entry of trackTimes) {
    const config = entry.configuration;
    if (!groupedByConfig[config]) {
      groupedByConfig[config] = [];
    }
    groupedByConfig[config].push(entry);
  }

  const trackTimesByConfig: Record<string, any[]> = {};

  for (const [config, entries] of Object.entries(groupedByConfig)) {
    trackTimesByConfig[config] = entries
      .sort((a, b) => a.time - b.time)
      .map((entry, index) => ({
        rank: index + 1,
        driver: `${entry.user.firstName} ${entry.user.lastName}`,
        date: entry.date.toISOString().slice(0, 10).replace(/-/g, '/'),
        car: entry.car,
        tag: entry.tag,
        configuration: entry.configuration,
        time: entry.time,
        proof: entry.proof
      }));
  }

  return {
    track: slug,
    trackTimesByConfig
  };
};
