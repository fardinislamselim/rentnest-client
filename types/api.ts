export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage?: number;
}

export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: T;
}

export interface IApiErrorSource {
  path: string;
  message: string;
}

export interface IApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errorSources?: IApiErrorSource[];
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  meta?: PaginationMeta;
  data: T;
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
  statusCode?: number;
  message: string;
  errorSources?: IApiErrorSource[];
}
