export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      S3_ENDPOINT_URL: string;
      S3_API_KEY: string;
      S3_API_SECRET: string;
      S3_BUCKET: string;
      S3_REGION: string;
    }
  }
}

export {}
