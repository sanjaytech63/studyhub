import { clientConfig } from '@studyhub/config/client';

export const apiConfig = Object.freeze({
  baseURL: clientConfig.api.baseUrl,
  timeout: clientConfig.api.timeout,
} as const);
