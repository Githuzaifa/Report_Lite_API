import { Controller, Post, Body, Query } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('upload')
export class SalesController {
  constructor(private readonly appService: AppService) {}

  @Post('sales-data')
  async uploadSalesData(
    @Query('tableName') tableName: string, 
    @Body() salesData: object[]
  ) {
    if (!tableName || !salesData) {
      throw new Error('tableName and salesData are required!');
    }
    return this.appService.createDynamicTable(tableName, salesData);
  }
}
