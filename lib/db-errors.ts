export function isDuplicateKeyError(error: unknown) {
  const visit = (value: unknown): boolean => {
    if (!value || typeof value !== "object") return false;
    const record = value as { code?: string; errno?: number; message?: string; cause?: unknown };
    if (record.code === "ER_DUP_ENTRY" || record.errno === 1062) return true;
    if (typeof record.message === "string" && /duplicate|unique|constraint/i.test(record.message)) return true;
    return visit(record.cause);
  };
  return visit(error);
}
