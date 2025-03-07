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

    // Ensure JSON data is not empty
    if (!jsonData || jsonData.length === 0) {
      throw new Error("JSON data is empty!");
    }

    // Generate table structure dynamically
    const firstRow = jsonData[0];
    const columns = Object.keys(firstRow)
      .map((col) => `"${col}" TEXT`) // All columns are created as TEXT (change if needed)
      .join(", ");

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS "${tableName}" (
        id SERIAL PRIMARY KEY,
        ${columns}
      );
    `;

    console.log("Executing:", createTableQuery);
    await queryRunner.query(createTableQuery);

    // Batch insert logic
    const batchSize = 10000; // Reduced batch size for stability
    for (let i = 0; i < jsonData.length; i += batchSize) {
      const batch = jsonData.slice(i, i + batchSize);
      
      const keys = Object.keys(batch[0]).map((key) => `"${key}"`).join(", ");
      const placeholders = batch
        .map((_, rowIndex) => `(${Object.keys(batch[0]).map((_, colIndex) => `$${rowIndex * Object.keys(batch[0]).length + colIndex + 1}`).join(", ")})`)
        .join(", ");

      const values = batch.flatMap(row => 
        Object.values(row).map(value => 
          value === null || value === undefined ? null : 
          typeof value === "boolean" || typeof value === "number" ? value : 
          String(value) // Convert everything else to string safely
        )
      );

      const insertQuery = `
        INSERT INTO "${tableName}" (${keys}) 
        VALUES ${placeholders}
      `;

      console.log(`Inserting batch ${i / batchSize + 1}...`);
      await queryRunner.query(insertQuery, values);
    }

    await queryRunner.release();
  }
}
