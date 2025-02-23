import { Controller, Post, Body } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('upload')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('sales-data')
  async uploadSalesData(@Body() salesData: object) {
    return this.salesService.saveSalesData(salesData);
  }
}
