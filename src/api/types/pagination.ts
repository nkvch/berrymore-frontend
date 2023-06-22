export interface PaginatedResponse<T> {
  items: T[];
  totalPages: number;
  totalItems: any;
  currentPage: number;
}

export interface PaginationParams {
  page: number;
  perPage: number;
}
