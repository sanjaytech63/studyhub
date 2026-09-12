import type { RequestHandler } from 'express';
import { HTTP_STATUS } from '@/utils/http-status';
import * as certService from './certificate.service';

export const verifyCertificateHandler: RequestHandler = async (req, res) => {
  const cert = await certService.verifyCertificate(req.params.code as string);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: cert,
  });
};

export const getMyCertificatesHandler: RequestHandler = async (req, res) => {
  const certs = await certService.getMyCertificates(req.user!.id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: certs,
  });
};
