import { Router } from 'express';

import {
  assignPermissionController,
  removePermissionController,
} from './role-permission.controller';

const router = Router();

router.post('/roles/:roleId/permissions', assignPermissionController);
router.delete('/roles/:roleId/permissions/:permissionId', removePermissionController);

export default router;
