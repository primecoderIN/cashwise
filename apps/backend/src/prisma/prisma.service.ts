import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * PrismaService — wraps PrismaClient as an injectable NestJS service.
 *
 * Why we use @prisma/adapter-pg (Driver Adapter):
 *  Prisma 7 removed its built-in Rust-based query engine for Node.js.
 *  All database connections must now go through an explicit Driver Adapter.
 *  `PrismaPg` wraps the `pg` npm package and is the standard choice for
 *  PostgreSQL without edge runtimes or connection poolers.
 *
 * The DATABASE_URL env var must be set — it is read at runtime (not in schema.prisma).
 * This is intentional in Prisma 7: connection URLs are no longer baked into the schema.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Create the pg driver adapter with the connection string from environment
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

    // Pass the adapter to PrismaClient — this replaces the old `datasourceUrl` option
    super({ adapter });
  }

  /**
   * onModuleInit is called by NestJS once the module has been fully loaded.
   * We establish the database connection here so it's ready before any request arrives.
   */
  async onModuleInit() {
    await this.$connect();
  }
}
