import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {

  constructor(private readonly dataSource: DataSource) {}

  getHello(): string {
    return 'Report Lite';
  }

  async createDynamicTable(tableName: string, jsonData: any[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
  
    const firstRow = jsonData[0];
    if (!firstRow) throw new Error("JSON data is empty!");
  
    const columns = Object.keys(firstRow)
      .map((col) => `"${col}" TEXT`) 
      .join(", ");


      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS "${tableName}" (
          id SERIAL PRIMARY KEY,
          ${columns}
        );
      `;

    console.log("Executing:", createTableQuery);
    await queryRunner.query(createTableQuery);
  
    const batchSize = 10000;
for (let i = 0; i < jsonData.length; i += batchSize) {
  const batch = jsonData.slice(i, i + batchSize);

  const keys = Object.keys(batch[0]).map((key) => `"${key}"`).join(", ");
  const values = batch
    .map(row => `(${Object.values(row).map(value => `'${value}'`).join(", ")})`)
    .join(", ");

  const insertQuery = `
    INSERT INTO "${tableName}" (${keys}) 
    VALUES ${values}
  `;

  await queryRunner.query(insertQuery);
}

  
    await queryRunner.release();
  }
}
