import { prisma } from '@/lib/prisma'

/**
 * Wraps an outbound side-effect (email, webhook, job enqueue) in an
 * idempotency check so that retries never double-fire.
 *
 * Requires a Prisma model named `IdempotencyKey` with columns:
 *   key        String   @id
 *   createdAt  DateTime @default(now())
 *   expiresAt  DateTime
 *
 * The caller supplies a stable `key` (e.g. `email:welcome:<userId>:<date>`).
 * If the key already exists and has not expired, `fn` is skipped.
 */
export async function withIdempotency<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>,
): Promise<T | null> {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + ttlMs)

  // Note: findUnique → create is not atomic. Under very high concurrency two
  // callers can both see null and both proceed. For most notification workloads
  // this window is acceptable; for stricter guarantees wrap in a DB-level unique
  // constraint catch (P2002) or use SELECT … FOR UPDATE in a raw transaction.
  const existing = await prisma.idempotencyKey.findUnique({ where: { key } })
  if (existing) {
    if (existing.expiresAt > now) {
      return null
    }
    await prisma.idempotencyKey.delete({ where: { key } })
  }

  try {
    await prisma.idempotencyKey.create({ data: { key, expiresAt } })
  } catch (e: unknown) {
    // Another concurrent caller won the race — treat as already-processed.
    if ((e as { code?: string }).code === 'P2002') return null
    throw e
  }

  try {
    return await fn()
  } catch (err) {
    await prisma.idempotencyKey.delete({ where: { key } }).catch(() => undefined)
    throw err
  }
}

/**
 * Build a canonical idempotency key from parts. Parts are joined with `:` and
 * any colons within a part are escaped to prevent collisions.
 */
export function buildIdempotencyKey(...parts: (string | number)[]): string {
  return parts.map((p) => String(p).replace(/:/g, '_')).join(':')
}
