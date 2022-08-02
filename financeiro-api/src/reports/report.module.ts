import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Report } from './entities/report.entity';
import { RequestReportGenerateService } from './request-report-generate/request-report-generate.service';

@Module({
  imports: [SequelizeModule.forFeature([Report])],
  controllers: [ReportController],
  providers: [ReportService, RequestReportGenerateService],
})
export class ReportModule {}
