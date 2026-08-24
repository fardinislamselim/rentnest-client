export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/** `meta` is emitted by every paginated backend list endpoint via sendResponse(). */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  meta?: PaginationMeta;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiError {
  success: boolean;
  message: string;
}
