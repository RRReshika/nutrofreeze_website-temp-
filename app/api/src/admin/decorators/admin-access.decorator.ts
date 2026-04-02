import { SetMetadata } from '@nestjs/common';

export const ADMIN_ROLES_KEY = 'admin_roles';
export const ADMIN_PERMISSIONS_KEY = 'admin_permissions';

export const AdminRoles = (...roles: string[]) => SetMetadata(ADMIN_ROLES_KEY, roles);
export const AdminPermissions = (...permissions: string[]) => SetMetadata(ADMIN_PERMISSIONS_KEY, permissions);
