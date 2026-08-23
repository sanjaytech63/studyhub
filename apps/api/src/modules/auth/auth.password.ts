import argon2 from 'argon2';

const ARGON2_OPTIONS = {
  type: argon2.argon2id as 2,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
} as const;

export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password, ARGON2_OPTIONS);
};

export const verifyPassword = async (passwordHash: string, password: string): Promise<boolean> => {
  return argon2.verify(passwordHash, password);
};
