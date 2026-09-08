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

const ROLES = [
  {
    name: 'STUDENT',
    description: 'StudyHub student',
    type: 'SYSTEM' as const,
  },
  {
    name: 'INSTRUCTOR',
    description: 'StudyHub instructor',
    type: 'SYSTEM' as const,
  },
  {
    name: 'ADMIN',
    description: 'StudyHub administrator',
    type: 'SYSTEM' as const,
  },
] as const;

const PERMISSIONS = [
  { name: 'user:read', description: 'View users' },
  { name: 'user:create', description: 'Create users' },
  { name: 'user:update', description: 'Update users' },
  { name: 'user:delete', description: 'Delete users' },
  { name: 'course:read', description: 'View courses' },
  { name: 'course:create', description: 'Create courses' },
  { name: 'course:update', description: 'Update courses' },
  { name: 'course:delete', description: 'Delete courses' },
  { name: 'course:publish', description: 'Publish courses' },
  { name: 'lesson:read', description: 'View lessons' },
  { name: 'lesson:create', description: 'Create lessons' },
  { name: 'lesson:update', description: 'Update lessons' },
  { name: 'lesson:delete', description: 'Delete lessons' },
  { name: 'enrollment:read', description: 'View enrollments' },
  { name: 'enrollment:create', description: 'Create enrollments' },
  { name: 'progress:read', description: 'View progress' },
  { name: 'progress:update', description: 'Update progress' },
  { name: 'review:read', description: 'View reviews' },
  { name: 'review:create', description: 'Create reviews' },
  { name: 'review:update', description: 'Update reviews' },
  { name: 'review:delete', description: 'Delete reviews' },
  { name: 'order:read', description: 'View orders' },
  { name: 'order:create', description: 'Create orders' },
  { name: 'payment:read', description: 'View payments' },
  { name: 'audit-log:read', description: 'View audit logs' },
  { name: 'ROLE_PERMISSION_MANAGE', description: 'Manage role permissions' },
] as const;

const ROLE_PERMISSIONS: Record<string, string[]> = {
  STUDENT: [
    'course:read',
    'lesson:read',
    'enrollment:read',
    'enrollment:create',
    'progress:read',
    'progress:update',
    'review:read',
    'review:create',
    'review:update',
    'order:read',
    'order:create',
  ],
  INSTRUCTOR: [
    'course:read',
    'course:create',
    'course:update',
    'course:publish',
    'lesson:read',
    'lesson:create',
    'lesson:update',
    'lesson:delete',
    'enrollment:read',
    'progress:read',
    'review:read',
  ],
  ADMIN: PERMISSIONS.map((p) => p.name),
};

async function main() {
  const email = 'sanjaytech6375@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';

  console.log('--- Initializing StudyHub Database ---');

  // 1. Ensure avatarUrl column exists
  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" VARCHAR(1000);',
    );
    console.log('✔ Verified User.avatarUrl column exists');
  } catch {
    // Ignore if already exists
  }

  // 2. Seed all System Roles
  const roleMap = new Map<string, string>();
  for (const role of ROLES) {
    const record = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description, type: role.type },
      create: role,
    });
    roleMap.set(record.name, record.id);
  }
  console.log(`✔ Seeded ${roleMap.size} roles: ${Array.from(roleMap.keys()).join(', ')}`);

  // 3. Seed all System Permissions
  const permissionMap = new Map<string, string>();
  for (const perm of PERMISSIONS) {
    const record = await prisma.permission.upsert({
      where: { name: perm.name },
      update: { description: perm.description },
      create: perm,
    });
    permissionMap.set(record.name, record.id);
  }
  console.log(`✔ Seeded ${permissionMap.size} permissions (including ROLE_PERMISSION_MANAGE)`);

  // 4. Link Role Permissions (giving ADMIN full access)
  let linkCount = 0;
  for (const [roleName, permissionNames] of Object.entries(ROLE_PERMISSIONS)) {
    const roleId = roleMap.get(roleName);
    if (!roleId) continue;

    for (const permName of permissionNames) {
      const permissionId = permissionMap.get(permName);
      if (!permissionId) continue;

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
        update: {},
        create: {
          roleId,
          permissionId,
        },
      });
      linkCount++;
    }
  }
  console.log(`✔ Linked ${linkCount} role-permission mappings (ADMIN has full privileges)`);

  // 5. Upsert Admin User
  const adminRoleId = roleMap.get('ADMIN');
  if (!adminRoleId) {
    throw new Error('ADMIN role could not be resolved.');
  }

  const passwordHash = await argon2.hash(password, ARGON2_OPTIONS);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      roleId: adminRoleId,
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
      roleId: adminRoleId,
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
  });

  console.log(`\n========================================`);
  console.log(`ADMIN USER READY:`);
  console.log(`Email:    ${user.email}`);
  console.log(`Password: ${password}`);
  console.log(`Role:     ADMIN (${adminRoleId})`);
  console.log(`Status:   ${user.status}`);
  console.log(`========================================\n`);
}

main()
  .catch((err) => {
    console.error('Error initializing database:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
