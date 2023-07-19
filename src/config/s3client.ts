import S3Client from "aws-sdk/clients/s3"
import {config} from "dotenv"
config()

const createS3Client = () => {
    const s3 = new S3Client({
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT_URL,
        credentials: {
            accessKeyId: process.env.S3_API_KEY!,
            secretAccessKey: process.env.S3_API_SECRET!
        },
        s3ForcePathStyle: true
    })
    return s3
}


export const upload = async (raw, remote_name, extra_args) => {
    const s3Client = createS3Client()
    const bucket = process.env.S3_BUCKET!
    const result = await s3Client.upload({
        Bucket: bucket,
        Body: raw,
        ...extra_args
    }).promise()

    return result.Location
}
