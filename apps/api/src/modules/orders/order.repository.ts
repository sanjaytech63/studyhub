import { prisma, OrderStatus, Prisma } from '@studyhub/database';

export const findOrderById = async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      course: true,
      coupon: true,
      payments: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const findOrderByNumber = async (orderNumber: string) => {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      course: true,
      payments: true,
    },
  });
};

export const findStudentOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
        },
      },
      payments: true,
    },
  });
};

export const findAdminOrders = async (filters: {
  status?: OrderStatus;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {};
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.search) {
    where.OR = [
      { orderNumber: { contains: filters.search, mode: 'insensitive' } },
      { user: { email: { contains: filters.search, mode: 'insensitive' } } },
      { course: { title: { contains: filters.search, mode: 'insensitive' } } },
    ];
  }

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        payments: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, totalCount, page, limit };
};

export const createOrder = async (data: {
  orderNumber: string;
  userId: string;
  courseId: string;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  couponId?: string;
}) => {
  return prisma.order.create({
    data: {
      orderNumber: data.orderNumber,
      userId: data.userId,
      courseId: data.courseId,
      subtotalAmount: data.subtotalAmount,
      discountAmount: data.discountAmount,
      totalAmount: data.totalAmount,
      currency: data.currency,
      couponId: data.couponId,
      status: 'PENDING',
    },
    include: {
      course: true,
    },
  });
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
};
