export function getTotalCountFromHeaders(meta: unknown) {
    const response = (meta as { response?: Response } | undefined)?.response;
    const totalCountHeader = response?.headers.get("X-Total-Count");
    const totalCount = Number(totalCountHeader ?? 0);

    return Number.isFinite(totalCount) ? totalCount : 0;
}
