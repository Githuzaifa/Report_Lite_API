import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SalesService {
    constructor(private readonly dataSource: DataSource) {}

    async deleteSalesData(tableName: string): Promise<number> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
    
        try {
            // Query to count the total number of records
            queryRunner.query(`TRUNCATE TABLE "${tableName}"`);

        } catch (error) {
            console.error(`Error removing record count: ${error.message}`);
            return 0; // Return 0 in case of any errors
        } finally {
            await queryRunner.release();
        }
        return 0;
    }
    async getSalesData(tableName: string): Promise<number> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
    
        try {
            // Query to count the total number of records
            const countQuery = `SELECT COUNT(*) AS total FROM "${tableName}";`;
            const result = await queryRunner.query(countQuery);
    
            // Return the count (ensure it's properly parsed as a number)
            return result[0]?.total ? parseInt(result[0].total, 10) : 0;
        } catch (error) {
            console.error(`Error fetching record count: ${error.message}`);
            return 0; // Return 0 in case of any errors
        } finally {
            await queryRunner.release();
        }
    }
    

}
