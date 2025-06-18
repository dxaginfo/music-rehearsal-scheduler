import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface CustomError extends Error {
  statusCode?: number;
  data?: any;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  logger.error(`${req.method} ${req.path} - Error:`, err);

  // Set default status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong on the server';

  // Send response based on environment
  if (process.env.NODE_ENV === 'production') {
    // Production - don't expose error details
    res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? 'Server error' : message,
    });
  } else {
    // Development - include full error details
    res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
      data: err.data || undefined,
    });
  }
};

// Custom error class for API errors
export class ApiError extends Error {
  statusCode: number;
  data?: any;

  constructor(statusCode: number, message: string, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, data?: any) {
    return new ApiError(400, message, data);
  }

  static unauthorized(message: string = 'Unauthorized access', data?: any) {
    return new ApiError(401, message, data);
  }

  static forbidden(message: string = 'Forbidden access', data?: any) {
    return new ApiError(403, message, data);
  }

  static notFound(message: string = 'Resource not found', data?: any) {
    return new ApiError(404, message, data);
  }

  static conflict(message: string, data?: any) {
    return new ApiError(409, message, data);
  }

  static internal(message: string = 'Internal server error', data?: any) {
    return new ApiError(500, message, data);
  }
}