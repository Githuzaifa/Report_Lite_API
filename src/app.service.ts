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

        const values = batch
    .map(row => `(${Object.values(row).map(value => `'${value}'`).join(", ")})`)
    .join(", ");

    for (const row of batch) {
      const rowValues: string[] = Object.values(row).map(value => {
          if (value == null) return 'NULL'; // Covers both null & undefined
          if (typeof value === 'boolean') return value ? 'true' : 'false';
          if (typeof value === 'number') return value.toString();
          
          let strValue = String(value);
          if (strValue.includes("'")) strValue = strValue.replace(/'/g, "''"); // Escape single quotes
          if (strValue.includes("T")) strValue = strValue.replace(/T(\d{2}:\d{2}:\d{2})/, ' $1'); // Format date-time
          
          return `'${strValue}'`;
      });
  
      valueSets.push(`(${rowValues.join(', ')})`);
  }
  

        // Build final insert query
        const columnsWithoutId = columnsList.split(', ').filter(col => col !== '"id"').join(', ');

const insertQuery = `
    INSERT INTO "${tableName}" (${columnsList})
    SELECT * FROM (VALUES ${valueSets.join(', ')}) AS new_data (${columnsList})
    WHERE NOT EXISTS (
        SELECT 1 FROM "${tableName}" 
        WHERE ${columnsWithoutId.split(', ').map(col => `"${tableName}".${col} = new_data.${col}`).join(' AND ')}
    );
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
