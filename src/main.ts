import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as morgan from 'morgan';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const logStream = fs.createWriteStream('api.log', {
  flags: 'a',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.use(morgan.default('combined', { stream: logStream }));

  const config = new DocumentBuilder()
    .setTitle('HomeFinder Api')
    .setDescription('List of all HomeFinder API endpoints')
    .setVersion('1.0')
    .addTag('home_finder')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('homefinderapi', app, document);

  await app.listen(3001);
}
bootstrap();
