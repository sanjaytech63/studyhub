import { Router } from 'express';

import permissionRoutes from './permission.routes';
import rolePermissionRoutes from './role-permission.routes';
import roleRoutes from './role.routes';

const router = Router();

router.use(roleRoutes);
router.use(permissionRoutes);
router.use(rolePermissionRoutes);

export default router;
