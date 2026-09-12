import { prisma, PaymentProvider, PaymentStatus, Prisma } from '@studyhub/database';

export const createPayment = async (data: {
  orderId: string;
  provider: PaymentProvider;
  providerOrderId?: string;
  providerPaymentId?: string;
  providerSignature?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  rawWebhookPayload?: any;
}) => {
  return prisma.payment.create({
    data: {
      orderId: data.orderId,
      provider: data.provider,
      providerOrderId: data.providerOrderId,
      providerPaymentId: data.providerPaymentId,
      providerSignature: data.providerSignature,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      rawWebhookPayload: data.rawWebhookPayload,
    },
  });
};

export const findPaymentByProviderId = async (providerPaymentId: string) => {
  return prisma.payment.findFirst({
    where: { providerPaymentId },
    include: {
      order: true,
    },
  });
};

export const findAdminPayments = async (filters: {
  status?: PaymentStatus;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: Prisma.PaymentWhereInput = {};
  if (filters.status) {
    where.status = filters.status;
  }

  const [payments, totalCount] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
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
          },
        },
      },
    }),
    prisma.payment.count({ where }),
  ]);

  return { payments, totalCount, page, limit };
};
