export interface ApiSuccessResponse<T> {
  success: true;
  timestamp: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any[];
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
