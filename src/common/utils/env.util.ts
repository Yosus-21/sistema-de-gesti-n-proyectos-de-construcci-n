export function parseBooleanEnv(
  value: string | undefined,
  defaultValue = false,
): boolean {
  if (value === undefined) {
    return defaultValue;
  }

  return value.trim().toLowerCase() === 'true';
}

export function parseCsvEnv(value: string | undefined): string[] {
  return (
    value
      ?.split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0) ?? []
  );
}

export function parsePositiveIntEnv(
  value: string | undefined,
  defaultValue: number,
): number {
  const parsed = Number.parseInt(value ?? '', 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
}
