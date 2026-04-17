import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initFirebase } from './firebase/firebase.config';

async function bootstrap() {
  try {
    console.log("🚀 Starting app...");

    const app = await NestFactory.create(AppModule);
    console.log("✅ Nest app created");

    // inicializar Firebase
    console.log("🔥 Initializing Firebase...");
    initFirebase();
    console.log("✅ Firebase initialized");

    app.enableCors({
      origin: true,
      credentials: true,
    });
    console.log("✅ CORS enabled");

    const port = process.env.PORT || 3002;
    console.log(`🌐 Using port: ${port}`);

    await app.listen(port);

    console.log(`🔥 Server running on port ${port}`);
  } catch (error) {
    console.error("❌ ERROR DURING STARTUP:");
    console.error(error);
    process.exit(1);
  }
}

bootstrap();