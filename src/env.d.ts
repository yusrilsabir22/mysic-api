declare global {
  namespace NodeJS {
    interface ProcessEnv {
      S3_ENDPOINT_URL: string;
      S3_API_KEY: string;
      S3_API_SECRET: string;
      S3_BUCKET: string;
      S3_REGION: string;
      POSTGRES_USER: string;
      POSTGRES_DB: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_URL: string;
      POSTGRES_HOST: string;
      POSTGRES_PORT: string;
      AUDIO_JAX_WHISPER_URL: string;
    }
  }
}

export {}
