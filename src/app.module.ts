import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesModule } from './sales/sales.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({

  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes env variables available globally
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10), // Ensure it's a valid string
      username: process.env.DB_USERNAME || 'default_user',
      password: process.env.DB_PASSWORD || 'default_password',
      database: process.env.DB_NAME || 'default_db',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
    }),
    SalesModule,
  ],
controllers:[AppController],
providers:[AppService],
  
})
export class AppModule {}
