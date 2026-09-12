import { AppError } from '@/errors/app-error';
import { HTTP_STATUS } from '@/utils/http-status';
import { ERROR_CODES } from '@/errors/error-codes';
import * as certRepo from './certificate.repository';

export const verifyCertificate = async (code: string) => {
  const cert = await certRepo.findCertificateByCode(code);
  if (!cert) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Certificate not found.');
  }

  return {
    certificateCode: cert.certificateCode,
    issueDate: cert.issueDate,
    pdfUrl: cert.pdfUrl,
    verificationUrl: cert.verificationUrl,
    student: {
      name: `${cert.user.firstName} ${cert.user.lastName || ''}`.trim(),
      avatarUrl: cert.user.avatarUrl,
    },
    course: {
      title: cert.course.title,
      slug: cert.course.slug,
      instructorName:
        `${cert.course.instructor.user.firstName} ${cert.course.instructor.user.lastName || ''}`.trim(),
    },
  };
};

export const getMyCertificates = async (userId: string) => {
  const certs = await certRepo.findStudentCertificates(userId);
  return certs.map((cert) => ({
    id: cert.id,
    certificateCode: cert.certificateCode,
    issueDate: cert.issueDate,
    pdfUrl: cert.pdfUrl,
    verificationUrl: cert.verificationUrl,
    course: {
      title: cert.course.title,
      slug: cert.course.slug,
      thumbnailUrl: cert.course.thumbnailUrl,
      instructorName:
        `${cert.course.instructor.user.firstName} ${cert.course.instructor.user.lastName || ''}`.trim(),
    },
  }));
};
