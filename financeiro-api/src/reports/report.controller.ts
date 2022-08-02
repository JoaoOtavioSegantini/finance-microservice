import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TenantGuard } from 'src/tenant/tenant.guard';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportsService: ReportService) {}

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Get()
  findAll() {
    return this.reportsService.findAll();
  }
}
