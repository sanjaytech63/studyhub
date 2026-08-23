import { findAllRoles } from './role.repository';

export const getAllRoles = async () => {
  return findAllRoles();
};
