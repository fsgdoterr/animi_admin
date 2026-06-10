export function getNextCursorFromHeaders(meta: unknown) {
    const response = (meta as { response?: Response } | undefined)?.response;
    const nextCursorHeader = response?.headers.get("X-Next-Cursor");
    const nextCursor = !!nextCursorHeader ? Number(nextCursorHeader) : undefined;

    return Number.isFinite(nextCursor) ? nextCursor : undefined;
}
