import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AdminProfile } from './admin.types';
import { AdminLoginDto, CreateAdminDto } from './dto/admin-auth.dto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: AdminLoginDto) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
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
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, admin.hashedPassword);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles = admin.roles.map((r) => r.role.name);
    const permissions = Array.from(
      new Set(
        admin.roles.flatMap((entry) =>
          entry.role.permissions.map((permission) => `${permission.permission.resource}:${permission.permission.action}`),
        ),
      ),
    );
    const token = this.jwtService.sign({
      sub: admin.id,
      email: admin.email,
      roles,
      permissions,
      type: 'admin',
    });

    return {
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        roles,
        permissions,
      },
      accessToken: token,
    };
  }

  async createAdmin(dto: CreateAdminDto) {
    const existing = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const admin = await this.prisma.adminUser.create({
      data: {
        email: dto.email,
        hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    const roleName = dto.roleName?.toUpperCase() || 'ADMIN';

    let role = await this.prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      role = await this.prisma.role.create({
        data: { name: roleName, description: `${roleName} access`, isSystem: true },
      });
    }
    await this.prisma.adminUserRole.create({
      data: { adminUserId: admin.id, roleId: role.id },
    });

    return { id: admin.id, email: admin.email };
  }

  async me(adminId: string): Promise<AdminProfile> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: adminId },
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
      throw new NotFoundException('Admin not found');
    }

    const roles = admin.roles.map((entry) => entry.role.name);
    const permissions = Array.from(
      new Set(
        admin.roles.flatMap((entry) =>
          entry.role.permissions.map((permission) => `${permission.permission.resource}:${permission.permission.action}`),
        ),
      ),
    );

    return {
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      roles,
      permissions,
    };
  }

  async getDashboardStats() {
    const [totalProducts, totalOrders, totalCustomers, recentOrders, revenue, inventorySummary, lowStockCount] =
      await Promise.all([
        this.prisma.product.count(),
        this.prisma.order.count(),
        this.prisma.customer.count(),
        this.prisma.order.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { payment: true, items: { include: { variant: { include: { product: true } } } } },
        }),
        this.prisma.order.aggregate({
          where: { status: 'PAID' },
          _sum: { total: true },
        }),
        this.prisma.inventory.aggregate({ _sum: { onHand: true, reserved: true } }),
        this.prisma.inventory.count({ where: { onHand: { lte: 10 } } }),
      ]);

    const totalCategories = await this.prisma.category.count();

    return {
      totalProducts,
      totalCategories,
      totalOrders,
      totalCustomers,
      totalRevenue: revenue._sum.total ? Number(revenue._sum.total) : 0,
      inventoryCount: Number(inventorySummary._sum.onHand ?? 0),
      reservedCount: Number(inventorySummary._sum.reserved ?? 0),
      lowStockCount,
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        total: Number(o.total),
        currency: o.currency,
        guestEmail: o.guestEmail,
        createdAt: o.createdAt,
        paymentStatus: o.payment?.status || null,
        itemCount: o.items.length,
      })),
    };
  }

  async listCustomers() {
    const customers = await this.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true, wishlistItems: true },
        },
      },
    });

    return {
      customers: customers.map((customer) => ({
        id: customer.id,
        email: customer.email,
        phone: customer.phone,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        orderCount: customer._count.orders,
        wishlistCount: customer._count.wishlistItems,
      })),
    };
  }
}

