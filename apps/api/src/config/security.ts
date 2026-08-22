import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { serverConfig } from '@studyhub/config/server';

export const securityMiddleware = [
  helmet(),

  cors({
    origin: serverConfig.security.corsOrigins,
    credentials: true,
  }),

  compression(),
  cookieParser(),
];
