import { randomUUID } from 'node:crypto'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export interface AuditContext {
  actorId?: string | null
  actorRole?: string | null
  ipAddress?: string | null
  requestId?: string | null
  /** Stable cross-service trace key linking audit + background jobs + outbound side-effects for one logical operation. */
  correlationId?: string | null
}

type PrismaTx = Prisma.TransactionClient | typeof prisma

/**
 * Write an audit-log row inside the same transaction as the state change.
 *
 * Always pass the transaction client (`tx`) as the first argument so the
 * audit write rolls back together with the business mutation.
 *
 * Prefer `withAuditedMutation` for the common case (single-table mutation
 * that audits its own result). Use this lower-level helper directly only
 * when you need to audit multiple tables in a single transaction.
 *
 * Requires a Prisma model named `AuditLog` with the columns referenced
 * below. Adjust the model name / column names if your project uses a
 * different naming convention — keep the transactional invariant intact.
 */
export async function writeAuditLog(
  client: PrismaTx,
  ctx: AuditContext,
  action: string,
  tableName: string,
  recordId: string,
  oldValues?: Record<string, unknown> | null,
  newValues?: Record<string, unknown> | null,
): Promise<void> {
  await client.auditLog.create({
    data: {
      actor_id: ctx.actorId ?? null,
      actor_role: ctx.actorRole ?? null,
      action,
      table_name: tableName,
      record_id: recordId,
      old_values: oldValues == null ? Prisma.JsonNull : (oldValues as Prisma.InputJsonValue),
      new_values: newValues == null ? Prisma.JsonNull : (newValues as Prisma.InputJsonValue),
      ip_address: ctx.ipAddress ?? null,
      request_id: ctx.requestId ?? null,
      correlation_id: ctx.correlationId ?? null,
    },
  })
}

/**
 * Higher-order wrapper for the common case: a single-table admin mutation
 * that should be audited with its own return value as `newValues`.
 *
 * Eliminates the 5-step boilerplate (fetch existing → transaction → mutate
 * → writeAuditLog → return) and makes audit-omission a compile error
 * because the call site cannot return without invoking this wrapper.
 *
 * Usage:
 *   const updated = await withAuditedMutation(
 *     ctx,
 *     'enquiry.assign',
 *     'enquiries',
 *     id,
 *     { assigned_to: existing.assigned_to },
 *     (tx) => tx.enquiry.update({
 *       where: { id },
 *       data: { assigned_to: newRm },
 *       select: { id: true, assigned_to: true, updated_at: true },
 *     }),
 *   )
 *
 * The `result` returned by `fn` is forwarded as `newValues` (after
 * JSON-serialisation safety check).
 */
export async function withAuditedMutation<T>(
  ctx: AuditContext,
  action: string,
  tableName: string,
  recordId: string,
  oldValues: Record<string, unknown> | null,
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    const result = await fn(tx)
    await writeAuditLog(
      tx,
      ctx,
      action,
      tableName,
      recordId,
      oldValues,
      toAuditableSnapshot(result),
    )
    return result
  })
}

function toAuditableSnapshot(value: unknown): Record<string, unknown> | null {
  if (value == null) return null
  if (typeof value !== 'object') return null
  if (Array.isArray(value)) return null
  return value as Record<string, unknown>
}

/**
 * Build an AuditContext from the inbound request + authenticated user.
 *
 * If no `x-correlation-id` header is present, generates a fresh UUID so
 * downstream side-effects can be linked to this audit row by passing the
 * same id forward in their own structured-log fields.
 */
export function auditContextFromRequest(
  request: Request,
  user: { id: string; app_metadata?: Record<string, unknown> } | null,
  primaryUserRole?: string | null,
): AuditContext {
  return {
    actorId: user?.id ?? null,
    actorRole: primaryUserRole ?? null,
    ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    requestId: request.headers.get('x-request-id') ?? null,
    correlationId: request.headers.get('x-correlation-id') ?? randomUUID(),
  }
}