import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Report } from './entities/report.entity';
import { RequestReportGenerateService } from './request-report-generate/request-report-generate.service';
import { ClientKafka, ClientsModule } from '@nestjs/microservices';
import { makeKafkaOptions } from 'src/common/kafka-config';

@Module({
  imports: [
    SequelizeModule.forFeature([Report]),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        useFactory: () => makeKafkaOptions(),
      },
    ]),
  ],
  controllers: [ReportController],
  providers: [
    ReportService,
    RequestReportGenerateService,
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: async (kafkaService: ClientKafka) => {
        return kafkaService.connect();
      },
      inject: ['KAFKA_SERVICE'],
    },
  ],
})
export class ReportModule {}
