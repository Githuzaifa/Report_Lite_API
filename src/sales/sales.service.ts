import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SalesService {
    constructor(private readonly dataSource: DataSource) {}

    async getSalesData(tableName: string): Promise<any[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
    
        try {
            // Query to fetch the last record from the table
            const selectQuery = `SELECT * FROM ${tableName} WHERE id=(SELECT max(id) FROM TableName);`;
            const result = await queryRunner.query(selectQuery);
    
            // If no records are found, return an empty array
            if (result.length === 0) {
                return [];
            }
    
            // Return the last record directly
            return [result[0]];
        } catch (error) {
            // Handle any errors by returning an empty array
            console.error(`Error fetching data: ${error.message}`);
            return [];
        } finally {
            // Release the query runner
            await queryRunner.release();
        }
    }

}
