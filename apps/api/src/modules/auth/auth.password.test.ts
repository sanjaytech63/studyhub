// import { describe, expect, it } from 'vitest';

// import { hashPassword, verifyPassword } from './auth.password';

// describe('auth password', () => {
//   it('hashes and verifies a password', async () => {
//     const password = 'StrongPassword123!';

//     const hash = await hashPassword(password);

//     expect(hash).not.toBe(password);

//     await expect(verifyPassword(password, hash)).resolves.toBe(true);
//   });

//   it('rejects an incorrect password', async () => {
//     const hash = await hashPassword('StrongPassword123!');

//     await expect(verifyPassword('WrongPassword123!', hash)).resolves.toBe(false);
//   });
// });
