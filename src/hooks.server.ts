import { validateSessionToken } from '$lib/server/auth';

export const handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session');
  if (session) {
    const result = await validateSessionToken(session);
    if (result.user) {
      event.locals.user = result.user;
    }
  }
  return resolve(event);
};