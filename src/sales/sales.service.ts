import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesData } from './sales.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(SalesData)
    private readonly salesRepository: Repository<SalesData>,
  ) {}

  async saveSalesData(salesData: object): Promise<SalesData> {
    const newSales = this.salesRepository.create({ data: salesData });
    return this.salesRepository.save(newSales);
  }
}
