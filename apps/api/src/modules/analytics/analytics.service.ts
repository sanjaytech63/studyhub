import { prisma } from '@studyhub/database';

export const getAdminAnalyticsOverview = async () => {
  const [
    totalStudents,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    paidOrders,
    completedCoursesCount,
    topCoursesRaw,
  ] = await Promise.all([
    prisma.user.count({ where: { role: { name: { not: 'SUPER_ADMIN' } } } }),
    prisma.course.count(),
    prisma.course.count({ where: { status: 'PUBLISHED' } }),
    prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
    prisma.order.findMany({
      where: { status: 'PAID' },
      select: { totalAmount: true },
    }),
    prisma.courseProgress.count({
      where: { progressPercent: 100 },
    }),
    prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      take: 5,
      orderBy: {
        enrollments: { _count: 'desc' },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        _count: {
          select: {
            enrollments: true,
            orders: { where: { status: 'PAID' } },
          },
        },
      },
    }),
  ]);

  const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  const completionRate =
    totalEnrollments > 0 ? Math.round((completedCoursesCount / totalEnrollments) * 100) : 0;

  const topCourses = topCoursesRaw.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    price: Number(c.price),
    enrollmentsCount: c._count.enrollments,
    revenue: c._count.orders * Number(c.price),
  }));

  return {
    kpis: {
      totalStudents,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      totalRevenue,
      completionRate,
    },
    topCourses,
  };
};
