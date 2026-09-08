import dotenv from 'dotenv';
dotenv.config();

import argon2 from 'argon2';
import { prisma } from '../packages/database/src/client';

const ARGON2_OPTIONS = {
  type: argon2.argon2id as 2,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
} as const;

async function main() {
  const email = 'sanjaytech6375@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';

  console.log(`Setting up admin user for ${email}...`);

  // Ensure avatarUrl column exists if migration hasn't run yet
  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" VARCHAR(1000);',
    );
  } catch (e) {
    // Ignore if already exists or fails
  }

  // 1. Ensure ADMIN role exists
  let adminRole = await prisma.role.findUnique({
    where: { name: 'ADMIN' },
  });

  if (!adminRole) {
    console.log('Creating ADMIN role...');
    adminRole = await prisma.role.create({
      data: {
        name: 'ADMIN',
        description: 'StudyHub administrator with full privileges',
        type: 'SYSTEM',
      },
    });
  }

  // 2. Hash password
  const passwordHash = await argon2.hash(password, ARGON2_OPTIONS);

  // 3. Upsert user
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      roleId: adminRole.id,
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      firstName: 'Sanjay',
      lastName: 'Tech',
    },
    create: {
      email,
      passwordHash,
      firstName: 'Sanjay',
      lastName: 'Tech',
      roleId: adminRole.id,
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
  });

  console.log(`\n========================================`);
  console.log(`ADMIN USER READY:`);
  console.log(`Email:    ${user.email}`);
  console.log(`Password: ${password}`);
  console.log(`Role:     ADMIN (${adminRole.id})`);
  console.log(`Status:   ${user.status}`);
  console.log(`========================================\n`);
}

main()
  .catch((err) => {
    console.error('Error setting up admin user:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
