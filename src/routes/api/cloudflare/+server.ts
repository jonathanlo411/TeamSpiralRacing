import { 
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: env.CF_R2_URL,
  credentials: {
    accessKeyId: env.CF_ACCESS_KEY_ID,
    secretAccessKey: env.CF_ACCESS_KEY_SECRET,
  },
  forcePathStyle: true,
});

r2Client.middlewareStack.add((next) => async (args) => {
  if (args.request && typeof args.request === 'object' && 'headers' in args.request) {
    const request = args.request as { headers: Record<string, string> };
    delete request.headers['x-amz-checksum-crc32'];
  }
  return next(args);
}, {
  step: 'build',
  name: 'RemoveChecksumHeadersMiddleware',
});

export async function POST({ request, locals }) {
  if (!locals.user || locals.user.role === "USER") {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return json({ error: 'No file provided' }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const key = `uploads/${locals.user.id}/${Date.now()}-${file.name}`;

  try {
    const command = new PutObjectCommand({
      Bucket: env.CF_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type,
      Metadata: {
        userId: locals.user.id
      }
    });

    await r2Client.send(command);
    return json({ 
      success: true,
      url: `${env.CF_R2_PUB_URL}/${key}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function GET({ url }) {
  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    
    const command = new ListObjectsV2Command({
      Bucket: env.CF_BUCKET_NAME,
    });
    
    const response = await r2Client.send(command);
    
    const allFiles = response.Contents?.map((item) => ({
      key: item.Key,
      url: `${env.CF_R2_PUB_URL}/${item.Key}`,
      lastModified: item.LastModified, // Add this for sorting
    })) || [];

    // Sort by most recent first (LastModified descending)
    allFiles.sort((a, b) => {
      const dateA = new Date(a.lastModified || 0);
      const dateB = new Date(b.lastModified || 0);
      return dateB.getTime() - dateA.getTime();
    });

    // Calculate pagination
    const totalFiles = allFiles.length;
    const totalPages = Math.ceil(totalFiles / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFiles = allFiles.slice(startIndex, endIndex);

    // Remove lastModified from response (frontend doesn't need it)
    const files = paginatedFiles.map(({ lastModified, ...file }) => file);

    return json({ 
      files,
      totalFiles,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error('Failed to fetch objects from R2:', error);
    return json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function DELETE({ request, locals }) {
  if (!locals.user || locals.user.role === "USER") {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const key = url.searchParams.get('key');

  if (!key) {
    return json({ error: 'No image key provided' }, { status: 400 });
  }

  // Check if the user is authorized to delete this image
  const isImageOwnedByUser = key.startsWith(`uploads/${locals.user.id}/`);

  if (!isImageOwnedByUser && locals.user.role !== 'ADMIN') {
    return json({ error: 'Forbidden: You can only delete your own images' }, { status: 403 });
  }

  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: env.CF_BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(deleteCommand);

    return json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return json({ error: 'Failed to delete image' }, { status: 500 });
  }
}