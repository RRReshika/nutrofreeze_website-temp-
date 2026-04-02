import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, RefreshDto, LogoutDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.customer.findUnique({
      where: { email: dto.email },
    });
    
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    const customer = await this.prisma.customer.create({
      data: {
        email: dto.email,
        hashedPassword,
        phone: dto.phone,
        cart: { create: {} },
        loyaltyAccount: { create: {} },
      },
    });

    const tokens = await this.issueTokens(customer.id, customer.email);
    
    return {
      customer: { id: customer.id, email: customer.email },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { email: dto.email },
    });

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, customer.hashedPassword);
    
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.cart.upsert({
      where: { customerId: customer.id },
      update: {},
      create: { customerId: customer.id },
    });

    const tokens = await this.issueTokens(customer.id, customer.email);
    
    return {
      customer: { id: customer.id, email: customer.email },
      ...tokens,
    };
  }

  async refresh(dto: RefreshDto) {
    const tokenHash = this.hashToken(dto.refreshToken);
    const stored = await this.prisma.customerRefreshToken.findUnique({
      where: { tokenHash },
      include: { customer: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokens = await this.issueTokens(stored.customer.id, stored.customer.email, stored.id);

    return {
      customer: { id: stored.customer.id, email: stored.customer.email },
      ...tokens,
    };
  }

  async logout(dto: LogoutDto) {
    const tokenHash = this.hashToken(dto.refreshToken);
    await this.prisma.customerRefreshToken.deleteMany({ where: { tokenHash } });
    return { ok: true };
  }

  async me(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        cart: {
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: {
                      include: {
                        category: true,
                        images: { orderBy: { sortOrder: 'asc' } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        wishlistItems: {
          include: {
            product: {
              include: {
                category: true,
                images: { orderBy: { sortOrder: 'asc' } },
              },
            },
          },
        },
        loyaltyAccount: true,
      },
    });

    if (!customer) {
      throw new UnauthorizedException('Customer not found');
    }

    return {
      id: customer.id,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt,
      loyaltyAccount: customer.loyaltyAccount,
      cart: customer.cart
        ? {
            id: customer.cart.id,
            itemCount: customer.cart.items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: customer.cart.items.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0),
            items: customer.cart.items.map((item) => ({
              id: item.id,
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: Number(item.variant.price),
              lineTotal: Number(item.variant.price) * item.quantity,
              product: item.variant.product,
              variant: item.variant,
            })),
          }
        : null,
      wishlist: customer.wishlistItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        product: item.product,
      })),
    };
  }

  private async issueTokens(customerId: string, email: string, keepTokenId?: string) {
    const accessToken = this.jwtService.sign({ sub: customerId, email, type: 'customer' });
    const refreshToken = randomBytes(48).toString('hex');
    const refreshTokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    if (keepTokenId) {
      await this.prisma.customerRefreshToken.update({
        where: { id: keepTokenId },
        data: { tokenHash: refreshTokenHash, expiresAt },
      });
    } else {
      await this.prisma.customerRefreshToken.create({
        data: {
          customerId,
          tokenHash: refreshTokenHash,
          expiresAt,
        },
      });
    }

    return { accessToken, refreshToken };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
