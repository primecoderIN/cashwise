import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '../../../.env') }); // dist -> backend -> apps -> root

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Create the NestJS application instance using the root AppModule
  const app = await NestFactory.create(AppModule);

  // Enable CORS so the Vite dev server (port 5173) can call the API (port 3000)
  // In production both are served from the same origin, so this is mainly for dev
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // Apply global validation pipe — automatically validates incoming DTOs using class-validator
  // `transform: true` coerces query strings and body values to their declared types
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // ── Swagger UI (development only) ──────────────────────────────────────────
  // We gate Swagger behind NODE_ENV to avoid exposing the API explorer in production.
  // Set NODE_ENV=development when running `npm run start:dev`.
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('CashWise API')
      .setDescription('Personal finance tracking REST API')
      .setVersion('1.0')
      .addBearerAuth() // Adds the "Authorize" button to supply a Clerk JWT
      .build();

    const document = SwaggerModule.createDocument(app, config);
    // Mount the Swagger UI at /api/docs
    SwaggerModule.setup('api/docs', app, document);

    console.log(`📄 Swagger UI: http://localhost:${process.env.PORT || 3000}/api/docs`);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();
