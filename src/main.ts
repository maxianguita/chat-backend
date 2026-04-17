import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initFirebase } from './firebase/firebase.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // inicializar Firebase UNA sola vez
  initFirebase();

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT || 3002;
  await app.listen(port);
}
bootstrap();