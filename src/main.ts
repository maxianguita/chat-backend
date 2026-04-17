import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initFirebase } from './firebase/firebase.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  inicializar Firebase UNA sola vez
  initFirebase();

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(3002);
}
bootstrap();