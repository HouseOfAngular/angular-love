declare namespace NodeJS {
  interface ProcessEnv {
    AL_API_URL: string;
    AL_GRAPHQL_URI: string;
    AL_GRAPHQL_TOKEN: string;
    AL_IS_PROD: boolean;
  }
}
