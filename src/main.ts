import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Increase body size limit
    app.use(bodyParser.json({ limit: '400mb' })); // Adjust as needed
    app.use(bodyParser.urlencoded({ limit: '400mb', extended: true }));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
