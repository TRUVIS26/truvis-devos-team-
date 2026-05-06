const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value)
}

export function assertUuid(value: unknown, paramName = 'id'): string {
  if (!isUuid(value)) {
    throw new Error(`Invalid ${paramName}: expected a UUID, got ${JSON.stringify(value)}`)
  }
  return value
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function assertNonEmptyString(value: unknown, paramName: string): string {
  if (!isNonEmptyString(value)) {
    throw new Error(`Invalid ${paramName}: expected a non-empty string`)
  }
  return value.trim()
}

export function isPositiveInt(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
}

/** Parse a string or number into a positive integer, or throw. */
export function parsePositiveInt(value: unknown, paramName: string): number {
  const n = Number(value)
  if (!isPositiveInt(n)) {
    throw new Error(`Invalid ${paramName}: expected a positive integer, got ${JSON.stringify(value)}`)
  }
  return n
}
