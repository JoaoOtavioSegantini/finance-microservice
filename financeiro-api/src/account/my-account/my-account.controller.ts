import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TenantGuard } from 'src/tenant/tenant.guard';
import { TenantService } from 'src/tenant/tenant/tenant.service';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('my-account')
export class MyAccountController {
  constructor(private tenantService: TenantService) {}
  @Get()
  find() {
    return this.tenantService.tenant;
  }
}
