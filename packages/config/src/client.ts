const getRequiredPublicEnv = (name: string, value: string | undefined): string => {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(
      `${name} is not configured. Add ${name} to the application's environment file.`,
    );
  }

  return normalizedValue;
};

const apiUrl = getRequiredPublicEnv('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL);
const appUrl = getRequiredPublicEnv('NEXT_PUBLIC_APP_URL', process.env.NEXT_PUBLIC_APP_URL);

export const clientConfig = Object.freeze({
  app: {
    url: appUrl,
    name: process.env.NEXT_PUBLIC_APP_NAME?.trim() || 'StudyHub',
  },

  api: {
    baseUrl: apiUrl.replace(/\/+$/, ''),
    timeout: 15_000,
  },
});

export type ClientConfig = typeof clientConfig;
