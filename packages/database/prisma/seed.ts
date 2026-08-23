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
  {
    name: 'user:read',
    description: 'View users',
  },
  {
    name: 'user:create',
    description: 'Create users',
  },
  {
    name: 'user:update',
    description: 'Update users',
  },
  {
    name: 'user:delete',
    description: 'Delete users',
  },

  {
    name: 'course:read',
    description: 'View courses',
  },
  {
    name: 'course:create',
    description: 'Create courses',
  },
  {
    name: 'course:update',
    description: 'Update courses',
  },
  {
    name: 'course:delete',
    description: 'Delete courses',
  },
  {
    name: 'course:publish',
    description: 'Publish courses',
  },

  {
    name: 'lesson:read',
    description: 'View lessons',
  },
  {
    name: 'lesson:create',
    description: 'Create lessons',
  },
  {
    name: 'lesson:update',
    description: 'Update lessons',
  },
  {
    name: 'lesson:delete',
    description: 'Delete lessons',
  },

  {
    name: 'enrollment:read',
    description: 'View enrollments',
  },
  {
    name: 'enrollment:create',
    description: 'Create enrollments',
  },

  {
    name: 'progress:read',
    description: 'View progress',
  },
  {
    name: 'progress:update',
    description: 'Update progress',
  },

  {
    name: 'review:read',
    description: 'View reviews',
  },
  {
    name: 'review:create',
    description: 'Create reviews',
  },
  {
    name: 'review:update',
    description: 'Update reviews',
  },
  {
    name: 'review:delete',
    description: 'Delete reviews',
  },

  {
    name: 'order:read',
    description: 'View orders',
  },
  {
    name: 'order:create',
    description: 'Create orders',
  },

  {
    name: 'payment:read',
    description: 'View payments',
  },

  {
    name: 'audit-log:read',
    description: 'View audit logs',
  },
] as const;

const rolePermissions = {
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

  ADMIN: permissions.map((permission) => permission.name),
} as const;

const seedPermissions = async () => {
  const permissionMap = new Map<string, string>();

  for (const permission of permissions) {
    const record = await prisma.permission.upsert({
      where: {
        name: permission.name,
      },
      update: {
        description: permission.description,
      },
      create: permission,
    });

    permissionMap.set(record.name, record.id);
  }

  return permissionMap;
};

const seedRoles = async () => {
  const roleMap = new Map<string, string>();

  for (const role of roles) {
    const record = await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {
        description: role.description,
        type: role.type,
      },
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

    if (!roleId) {
      throw new Error(`Role not found: ${roleName}`);
    }

    for (const permissionName of permissionNames) {
      const permissionId = permissionMap.get(permissionName);

      if (!permissionId) {
        throw new Error(`Permission not found: ${permissionName}`);
      }

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
    }
  }
};

const main = async (): Promise<void> => {
  console.log('Starting StudyHub database seed...');

  const permissionMap = await seedPermissions();

  console.log(`Seeded ${permissionMap.size} permissions.`);

  const roleMap = await seedRoles();

  console.log(`Seeded ${roleMap.size} roles.`);

  await seedRolePermissions(roleMap, permissionMap);

  console.log('StudyHub RBAC seed completed successfully.');
};

main()
  .catch((error: unknown) => {
    console.error('StudyHub database seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
