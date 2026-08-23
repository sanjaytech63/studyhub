import { Router } from 'express';
import { checkDatabaseConnection } from '@studyhub/database';

const router = Router();

router.get('/live', (_req, res) => {
  res.status(200).json({
    success: true,

    data: {
      status: 'ok',
    },
  });
});

router.get('/ready', async (_req, res) => {
  const database = await checkDatabaseConnection();

  if (!database) {
    res.status(503).json({
      success: false,

      error: {
        code: 'SERVICE_NOT_READY',

        message: 'Database is unavailable.',
      },
    });

    return;
  }

  res.status(200).json({
    success: true,

    data: {
      status: 'ready',
      database: 'up',
    },
  });
});

export default router;
