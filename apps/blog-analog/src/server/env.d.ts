export {};

declare module 'h3' {
  interface H3EventContext {
    cloudflare: {
      env: Env;
      request: Request;
    };
  }
}
