import { prisma } from '@studyhub/database';

export const findCertificateByCode = async (certificateCode: string) => {
  return prisma.certificate.findUnique({
    where: { certificateCode },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
      course: {
        include: {
          instructor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const findStudentCertificates = async (userId: string) => {
  return prisma.certificate.findMany({
    where: { userId },
    orderBy: { issueDate: 'desc' },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          instructor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
  });
};
