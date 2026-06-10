export interface PagePaginationRequest {
    limit: number;
    page?: number;
    search?: string;
};

export interface CursorPaginationRequest {
    limit: number;
    cursor?: number;
    search?: string
}