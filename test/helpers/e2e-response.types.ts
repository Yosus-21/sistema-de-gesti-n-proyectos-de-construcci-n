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
  message: string | string[];
  errors?: unknown[];
}

export const getSuccessBody = <T>(response: {
  body: unknown;
}): ApiSuccessResponse<T> => response.body as ApiSuccessResponse<T>;

export const getErrorBody = (response: { body: unknown }): ApiErrorResponse =>
  response.body as ApiErrorResponse;

export {
  expectAnyDate,
  expectAnyNumber,
  expectObjectContaining,
  expectAnyString,
} from '../../src/test-utils/typed-matchers';
