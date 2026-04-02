import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_PERMISSIONS_KEY, ADMIN_ROLES_KEY } from '../decorators/admin-access.decorator';
import { AdminProfile } from '../admin.types';

@Injectable()
export class AdminPermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ADMIN_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [];
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(ADMIN_PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [];

    if (!requiredRoles.length && !requiredPermissions.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const admin = request.admin as AdminProfile | undefined;

    if (!admin) {
      throw new ForbiddenException('Admin identity is missing');
    }

    if (requiredRoles.length && !requiredRoles.some((role) => admin.roles.includes(role))) {
      throw new ForbiddenException('Insufficient admin role');
    }

    if (requiredPermissions.length && !requiredPermissions.every((permission) => admin.permissions.includes(permission))) {
      throw new ForbiddenException('Insufficient admin permission');
    }

    return true;
  }
}
