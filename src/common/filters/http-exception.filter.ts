import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

type ErrorResponseBody = {
  success: false;
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  errors: string[];
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request.url);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    path: string,
  ): ErrorResponseBody {
    if (exception instanceof HttpException) {
      return this.buildHttpExceptionResponse(exception, path);
    }

    return {
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path,
      message: 'Internal server error',
      errors: [],
    };
  }

  private buildHttpExceptionResponse(
    exception: HttpException,
    path: string,
  ): ErrorResponseBody {
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      return {
        success: false,
        statusCode,
        timestamp: new Date().toISOString(),
        path,
        message: exceptionResponse,
        errors: [],
      };
    }

    const responseBody = this.isRecord(exceptionResponse)
      ? exceptionResponse
      : {};

    const validationMessages = Array.isArray(responseBody.message)
      ? responseBody.message.filter(
          (message): message is string => typeof message === 'string',
        )
      : [];

    const message =
      typeof responseBody.message === 'string'
        ? responseBody.message
        : (validationMessages[0] ?? exception.message);

    const errors = validationMessages.length
      ? validationMessages
      : Array.isArray(responseBody.errors)
        ? responseBody.errors.filter(
            (error): error is string => typeof error === 'string',
          )
        : [];

    return {
      success: false,
      statusCode,
      timestamp: new Date().toISOString(),
      path,
      message,
      errors,
    };
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
