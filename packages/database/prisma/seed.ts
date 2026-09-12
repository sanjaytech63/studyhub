import { logger } from '../../../apps/api/src/config/logger';
import { prisma } from '../src/client';

const roles = [
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
];

const permissions = [
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
  { name: 'order:read', description: 'View orders' },
  { name: 'payment:read', description: 'View payments' },
  { name: 'analytics:read', description: 'View analytics' },
];

const rolePermissions: Record<string, string[]> = {
  STUDENT: [
    'course:read',
    'lesson:read',
    'progress:read',
    'progress:update',
    'review:create',
    'order:read',
  ],
  INSTRUCTOR: [
    'course:read',
    'course:create',
    'course:update',
    'lesson:read',
    'lesson:create',
    'lesson:update',
    'review:read',
  ],
  ADMIN: permissions.map((p) => p.name),
};

const categories = [
  {
    name: 'Full Stack & Web',
    slug: 'development',
    description: 'Modern fullstack web engineering with React, Next.js, Node.js and TypeScript',
    icon: 'code',
    orderIndex: 1,
  },
  {
    name: 'System Design & Microservices',
    slug: 'systems',
    description: 'High-scale distributed systems, microservices architectures and API gateways',
    icon: 'cpu',
    orderIndex: 2,
  },
  {
    name: 'DevOps & Cloud',
    slug: 'devops',
    description: 'Docker, Kubernetes, CI/CD pipelines, AWS and production deployments',
    icon: 'server',
    orderIndex: 3,
  },
  {
    name: 'Generative AI & Data',
    slug: 'data-ai',
    description: 'LLMs, vector databases, machine learning and AI-assisted software',
    icon: 'sparkles',
    orderIndex: 4,
  },
];

const technologies = [
  { name: 'React', slug: 'react', category: 'Frontend' },
  { name: 'Next.js', slug: 'nextjs', category: 'Frontend' },
  { name: 'TypeScript', slug: 'typescript', category: 'Frontend' },
  { name: 'Node.js', slug: 'nodejs', category: 'Backend' },
  { name: 'Express', slug: 'express', category: 'Backend' },
  { name: 'PostgreSQL', slug: 'postgresql', category: 'Database' },
  { name: 'MongoDB', slug: 'mongodb', category: 'Database' },
  { name: 'Redis', slug: 'redis', category: 'Database' },
  { name: 'Docker', slug: 'docker', category: 'Infrastructure' },
  { name: 'Kubernetes', slug: 'kubernetes', category: 'Infrastructure' },
  { name: 'Kafka', slug: 'kafka', category: 'Infrastructure' },
  { name: 'AWS', slug: 'aws', category: 'Infrastructure' },
];

const seedPermissions = async (): Promise<Map<string, string>> => {
  const permissionMap = new Map<string, string>();
  for (const permission of permissions) {
    const record = await prisma.permission.upsert({
      where: { name: permission.name },
      update: { description: permission.description },
      create: permission,
    });
    permissionMap.set(record.name, record.id);
  }
  return permissionMap;
};

const seedRoles = async (): Promise<Map<string, string>> => {
  const roleMap = new Map<string, string>();
  for (const role of roles) {
    const record = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description, type: role.type },
      create: role,
    });
    roleMap.set(record.name, record.id);
  }
  return roleMap;
};

const seedRolePermissions = async (
  roleMap: Map<string, string>,
  permissionMap: Map<string, string>,
) => {
  for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
    const roleId = roleMap.get(roleName);
    if (!roleId) continue;

    for (const permissionName of permissionNames) {
      const permissionId = permissionMap.get(permissionName);
      if (!permissionId) continue;

      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId } },
        update: {},
        create: { roleId, permissionId },
      });
    }
  }
};

const seedCategoriesAndTech = async () => {
  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        orderIndex: cat.orderIndex,
      },
      create: cat,
    });
    categoryMap.set(record.slug, record.id);
  }

  for (const tech of technologies) {
    await prisma.technology.upsert({
      where: { slug: tech.slug },
      update: { name: tech.name, category: tech.category },
      create: tech,
    });
  }

  // Seed coupons
  await prisma.coupon.upsert({
    where: { code: 'WELCOME50' },
    update: {},
    create: {
      code: 'WELCOME50',
      discountType: 'PERCENTAGE',
      discountValue: 50,
      maxDiscount: 1000,
      minOrderAmount: 499,
      usageLimit: 1000,
      validFrom: new Date(),
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FLAT500' },
    update: {},
    create: {
      code: 'FLAT500',
      discountType: 'FIXED',
      discountValue: 500,
      minOrderAmount: 999,
      usageLimit: 500,
      validFrom: new Date(),
      isActive: true,
    },
  });

  return categoryMap;
};

const main = async (): Promise<void> => {
  logger.info('Starting StudyHub database seed...');

  const permissionMap = await seedPermissions();
  logger.info({ count: permissionMap.size }, 'Permissions seeded');

  const roleMap = await seedRoles();
  logger.info({ count: roleMap.size }, 'Roles seeded');

  await seedRolePermissions(roleMap, permissionMap);
  logger.info('RBAC seeded successfully');

  await seedCategoriesAndTech();
  logger.info('Categories, Technologies, and Coupons seeded');

  logger.info('StudyHub master database seed completed successfully');
};

main()
  .catch((error: unknown) => {
    logger.error({ error }, 'StudyHub database seed failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
