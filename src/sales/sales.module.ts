import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { SalesData } from './sales.entity';
import { AppService } from 'src/app.service';

@Module({
  imports: [
    ConfigModule, // Import ConfigModule to use environment variables
    TypeOrmModule.forFeature([SalesData]), // Add entities if required
  ],
  controllers: [SalesController],
  providers: [SalesService,AppService],
})
export class SalesModule {}
