import { clientConfig } from '@studyhub/config';

export const apiConfig = Object.freeze({
  baseURL: clientConfig.api.baseURL,
  timeout: clientConfig.api.timeout,
} as const);
