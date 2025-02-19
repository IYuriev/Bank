import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    const port = Number(process.env.APP_PORT);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.enableCors({
      origin: `http://localhost:${port}`,
      credentials: true,
    });

    await app.listen(port);
    console.log(`Server is running on http://localhost:${port}`);
  } catch (err) {
    console.log(err);
  }
}
bootstrap();
