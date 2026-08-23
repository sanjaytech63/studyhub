import { findAllPermissions } from './permission.repository';

export const getAllPermissions = async () => {
  return findAllPermissions();
};
