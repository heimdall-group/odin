import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, unlink } from 'fs';

export default defineEventHandler(async (event): Promise<Server_Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }
    const token = event.context.params.token;
    const { data, success, error } = await getPermissionsObject(token);
    const { permissions, super_admin } = data;

    if ((permissions['upload-images'] === undefined || !permissions['upload-images'].write) && !super_admin) {
      throw 'Permission denied'
    }

    const { 
      AWS_KEY, 
      AWS_SECRET_KEY, 
      AWS_REGION, 
      S3_BUCKET_URL, 
      S3_BUCKET_NAME,
      S3_OBJECT_URL,
    } = useRuntimeConfig();

    if (AWS_KEY === undefined) {
      throw 'Missing Aws key';
    }
    if (AWS_SECRET_KEY === undefined) {
      throw 'Missing Aws secret key';
    }
    if (AWS_REGION === undefined) {
      throw 'Missing Aws region';
    }
    if (S3_BUCKET_URL === undefined) {
      throw 'Missing S3 Bucket url';
    }
    if (S3_BUCKET_NAME === undefined) {
      throw 'Missing S3 Bucket name';
    }

    const s3: S3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
      },
      endpoint: S3_BUCKET_URL,
    });


    const fileResult = await getFile(event)
    if (!fileResult.success) {
      throw 'Proccesing of file failed'
    }
    const {filepath, newFilename, mimetype} = fileResult.data[0];

    await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Body: readFileSync(filepath),
      Key: `API/upload/images/${newFilename}`,
      ContentType: mimetype
    }));
    unlink(filepath, (err): void => {
      if (err) {
        console.error(err);
      }
    });

    const url = `${S3_OBJECT_URL}/API/upload/images/${newFilename}`;

    return removeRequestKeys({
      data: {url},
      type: 'Standard',
      success: true,
    }, event);
  } catch (error: any) {
    console.log(error)
    throw createError({
      statusCode: 400,
      statusMessage: error,
    });
  }
});
