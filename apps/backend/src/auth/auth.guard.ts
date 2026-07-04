import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import { PrismaService } from '../prisma/prisma.service';

/**
 * AuthGuard — applied to every protected route via @UseGuards(AuthGuard).
 *
 * Responsibility:
 *  1. Extract the Bearer token from the Authorization header.
 *  2. Verify the JWT with Clerk's public keys (no secret needed on client side).
 *  3. Look up or create the corresponding User row in the database.
 *  4. Attach the DB user's UUID to `req.user.id` so all downstream services
 *     can query data with the correct userId (DB UUID, not Clerk's external ID).
 *
 * Why we store users in our own DB:
 *  Clerk manages authentication (passwords, OAuth, MFA) but we need our own
 *  User table to associate expenses, categories, and groups with a stable
 *  internal UUID rather than Clerk's opaque string ID.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // ── Step 1: Extract the token ──────────────────────────────────────────
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }
    const token = authHeader.split(' ')[1];

    try {
      // ── Step 2: Verify the Clerk JWT ─────────────────────────────────────
      // `verifyToken` fetches Clerk's JWKS and validates the signature + expiry.
      // `payload.sub` is Clerk's unique user ID (e.g. "user_2abcXYZ").
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      const clerkId = payload.sub;

      // ── Step 3: Upsert the DB User ────────────────────────────────────────
      // On the very first login we create a local User record so we can link
      // expenses and categories to it via a proper relational UUID foreign key.
      let user = await this.prisma.user.findUnique({ where: { clerkId } });
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            clerkId,
            // Clerk embeds the email in the token payload; fall back gracefully
            email: (payload as any).email ?? `${clerkId}@unknown.com`,
            name: (payload as any).name ?? null,
          },
        });
      }

      // ── Step 4: Attach resolved user to request ───────────────────────────
      // Controllers access req.user.id — this is the DB UUID used in all queries.
      request.user = { id: user.id, clerkId };
      return true;
    } catch (error) {
      // Token is expired, tampered with, or Clerk cannot verify it
      throw new UnauthorizedException('Invalid token');
    }
  }
}
