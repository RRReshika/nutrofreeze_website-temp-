import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminJwtGuard } from './guards/admin-jwt.guard';
import { AdminPermissionsGuard } from './guards/admin-permissions.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  providers: [AdminJwtGuard, AdminPermissionsGuard],
  exports: [JwtModule, AdminJwtGuard, AdminPermissionsGuard],
})
export class AdminSecurityModule {}
