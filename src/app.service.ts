import { Injectable } from '@nestjs/common';
import { exit } from 'process';
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

    // Create table with dynamic columns (all TEXT type)
    const columns = Object.keys(firstRow)
        .map((col) => `"${col}" TEXT`)
        .join(", ");

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS "${tableName}" (
            id SERIAL PRIMARY KEY,
            ${columns}
        );
    `;

    await queryRunner.query(createTableQuery);

    // Batch insert with parameterized queries
    const batchSize = 10000;
    const columnsList = Object.keys(firstRow).map(key => `"${key}"`).join(", ");
    const columnCount = Object.keys(firstRow).length;

    for (let i = 0; i < jsonData.length; i += batchSize) {
        const batch = jsonData.slice(i, i + batchSize);
        const valueSets: string[] = [];
        const parameters = [];

        // Build parameters and placeholders
        for (const row of batch) {
          const rowValues: string[] = []; // Explicitly define the type as string[]
            for (const value of Object.values(row)) {
                if (value === null || value === undefined) {
                    rowValues.push('NULL');
                } else if (typeof value === 'boolean') {
                    rowValues.push(value ? 'true' : 'false');
                } else if (typeof value === 'number') {
                    rowValues.push(value.toString());
                } else {
                    // Escape single quotes and handle date formatting
                    const escapedValue = String(value)
                        .replace(/'/g, "''")
                        .replace(/T(\d{2}:\d{2}:\d{2})/, ' $1');
                    rowValues.push(`'${escapedValue}'`);
                }
            }
            valueSets.push(`(${rowValues.join(', ')})`);
        }

        // Build final insert query
        const insertQuery = `
            INSERT INTO "${tableName}" (${columnsList})
            VALUES ${valueSets.join(', ')}
        `;

        await queryRunner.query(insertQuery);
    }

    await queryRunner.release();
}

 /* async createDynamicTable(tableName: string, jsonData: any[]) {
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

    //await queryRunner.query(`TRUNCATE TABLE "${tableName}"`);
    //return;
  
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
  }*/
}
