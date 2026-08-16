import { clientConfig } from '@studyhub/config/client';

export const apiConfig = Object.freeze({
  baseURL: clientConfig.api.baseURL,
  timeout: clientConfig.api.timeout,
} as const);
