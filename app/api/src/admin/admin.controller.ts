import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto, CreateAdminDto } from './dto/admin-auth.dto';
import { AdminJwtGuard } from './guards/admin-jwt.guard';
import { AdminPermissionsGuard } from './guards/admin-permissions.guard';
import { AdminRoles } from './decorators/admin-access.decorator';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('login')
  login(@Body() dto: AdminLoginDto) {
    return this.adminService.login(dto);
  }

  @UseGuards(AdminJwtGuard)
  @Get('me')
  me(@Request() req) {
    return this.adminService.me(req.admin.id);
  }

  @UseGuards(AdminJwtGuard, AdminPermissionsGuard)
  @AdminRoles('OWNER', 'ADMIN', 'OPS', 'SUPPORT', 'MARKETING')
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @UseGuards(AdminJwtGuard, AdminPermissionsGuard)
  @AdminRoles('OWNER', 'ADMIN', 'OPS', 'SUPPORT', 'MARKETING')
  @Get('customers')
  listCustomers() {
    return this.adminService.listCustomers();
  }

  @UseGuards(AdminJwtGuard, AdminPermissionsGuard)
  @AdminRoles('OWNER')
  @Post('setup')
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.adminService.createAdmin(dto);
  }
}
