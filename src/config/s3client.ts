import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import {config} from "dotenv"
import { PassThrough } from "stream";
config()

const createS3Client = () => {
    const s3 = new S3({
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT_URL,
        credentials: {
            accessKeyId: process.env.S3_API_KEY!,
            secretAccessKey: process.env.S3_API_SECRET!
        },
        forcePathStyle: true
    })
    
    return s3
}


export const upload = async (raw: PassThrough, remote_name: string, contentLength: number) => {
    const s3Client = createS3Client()
    const bucket = process.env.S3_BUCKET!
    // try {
    //     await s3Client.createBucket({Bucket: bucket})
    // } catch (_error) {}
    const exists = await getOne(remote_name)
    if(!exists) {
        const cmd = new PutObjectCommand({
            Bucket: bucket,
            Body: raw,
            Key: remote_name,
            ContentType: "audio/mp3",
            ContentLength: contentLength
        })
        await s3Client.putObject({
            Bucket: bucket,
            Body: raw,
            Key: remote_name,
            ContentType: "audio/mp3",
            ContentLength: contentLength
        })
    }
}

export const getAll = async () => {
    const s3Client = createS3Client()
    const bucket = process.env.S3_BUCKET!

    const result = await s3Client.listObjects({
        Bucket: bucket
    })
    return result.$metadata
}


export const getOne = async (id: string) => {
    const s3Client = createS3Client()
    const bucket = process.env.S3_BUCKET!

    try {
        const result = await s3Client.getObject({
            Bucket: bucket,
            Key: id,
            ResponseContentType: "audio/mp3"
        })
        return result
    } catch(error) {
        return null
    }
}