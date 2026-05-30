import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import Joi from 'joi';
import { AiModule } from './ai/ai.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { auth } from './auth.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { TmdbModule } from './providers/tmdb/tmdb.module.js';
import { RecommendationsModule } from './recommendations/recommendations.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().port().default(3001),
        WEB_ORIGIN: Joi.string().uri().default('http://localhost:3000'),
        TMDB_BEARER_TOKEN: Joi.string().required(),
        BETTER_AUTH_SECRET: Joi.string().required(),
        BETTER_AUTH_URL: Joi.string().uri().required(),
        GROQ_API_KEY: Joi.string().required(),
        GROQ_MODEL: Joi.string().default('openai/gpt-oss-120b'),
      }),
    }),
    AuthModule.forRoot({
      auth,
      bodyParser: {
        json: { limit: '2mb' },
        urlencoded: { limit: '2mb', extended: true },
        rawBody: true,
      },
    }),
    TmdbModule,
    PrismaModule,
    AiModule,
    RecommendationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
