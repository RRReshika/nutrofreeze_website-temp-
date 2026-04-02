import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminProfile, AdminTokenPayload } from '../admin.types';

@Injectable()
export class AdminJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const token = authHeader.split(' ')[1];
      const payload = this.jwtService.verify<AdminTokenPayload>(token);

      if (payload.type !== 'admin') {
        throw new UnauthorizedException('Not an admin token');
      }

      const admin = await this.prisma.adminUser.findUnique({
        where: { id: payload.sub },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!admin || !admin.isActive) {
        throw new UnauthorizedException('Admin account is disabled');
      }

      const roles = admin.roles.map((entry) => entry.role.name);
      const permissions = Array.from(
        new Set(
          admin.roles.flatMap((entry) =>
            entry.role.permissions.map((permission) => `${permission.permission.resource}:${permission.permission.action}`),
          ),
        ),
      ) as string[];

      const adminProfile: AdminProfile = {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        roles,
        permissions,
      };

      request.admin = adminProfile;
      request.adminToken = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
