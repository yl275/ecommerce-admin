import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3'
import { isAdmin } from '../auth/[...nextauth]/route';

export async function POST(req) {
    await isAdmin();
    const formData  = await req.formData()
    const images = formData.getAll('image');
    const client = new S3Client({
        region: 'ap-southeast-2',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    });

    const links = [];

    for(const image of images) {
        const ext = image.name.split('.').pop();
        const newFileName = `${Date.now() + Math.random()}.${ext}`;
        const buffer = Buffer.from(await image.arrayBuffer());
        await client.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: newFileName,
            Body: buffer,
            ContentType: image.type,
            }));
        const link = `https://${process.env.S3_BUCKET_NAME}.s3.ap-southeast-2.amazonaws.com/${newFileName}`;
        links.push(link);
    };
    
    return Response.json(links, { status: 200 });
}

export const config = {
    api: {
        bodyParser: false,
    },
}