import { prisma } from "$lib/server/prisma";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import bcrypt from "bcryptjs";


export async function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName
    }
  });
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return null;
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return null;
  }

  const token = generateSessionToken();
  const session = await createSession(token, user.id);

  return { user, token, session };
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(token: string, userId: string): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  
  return prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    }
  });
}

export async function validateSessionToken(token: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true }
  });

  if (!session || Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await prisma.session.update({
      where: { id: session.id },
      data: { expiresAt: session.expiresAt }
    });
  }

  return { session, user: session.user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { id: sessionId } });
}