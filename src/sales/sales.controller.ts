import { Controller, Get, Post, Body, Query, Delete } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { SalesService } from './sales.service';

@Controller() // No prefix for root-level routes
export class SalesController {
  constructor(
    private readonly appService: AppService,
    private readonly salesService: SalesService,
  ) {}

  @Post('upload/sales-data') // POST /upload/sales-data
  async uploadSalesData(
    @Query('tableName') tableName: string,
    @Body() salesData: object[],
  ) {
    if (!tableName || !salesData) {
      throw new Error('tableName and salesData are required!');
    }
    return this.appService.createDynamicTable(tableName, salesData);
  }

  @Get('get_sales-data') // GET /get_sales-data
  async getSalesData(@Query('tableName') tableName: string) {
    if (!tableName) {
      throw new Error('tableName is required!');
    }
    return this.salesService.getSalesData(tableName);
  }

  @Delete('delete')
    async deleteTable(@Query('tableName') tableName: string){
      if (!tableName) {
        throw new Error('tableName is required!');
      }
      return this.salesService.deleteSalesData(tableName);
    }
}