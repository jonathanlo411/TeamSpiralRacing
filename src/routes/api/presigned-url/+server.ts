import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { validateSessionToken } from '$lib/server/auth';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: env.CF_R2_URL,
  credentials: {
    accessKeyId: env.CF_ACCESS_KEY_ID,
    secretAccessKey: env.CF_ACCESS_KEY_SECRET,
  },
});

export async function POST({ request, locals }: { request: Request; locals: App.Locals }) {
  if (!locals.user || locals.user.role === "USER" ) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { user } = await validateSessionToken(token);
  if (!user) {
    return json({ error: 'Invalid or expired session' }, { status: 403 });
  }

  const { fileName, contentType } = await request.json();

  const command = new PutObjectCommand({
    Bucket: '<bucket-name>',
    Key: `${user.id}/${fileName}`,
    ContentType: contentType,
  });

  try {
    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    return json({ url: presignedUrl });
  } catch (error) {
    return json({ error: 'Failed to generate presigned URL' }, { status: 500 });
  }
}
