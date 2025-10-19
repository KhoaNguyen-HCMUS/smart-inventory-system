import { ApiResponse } from '../interfaces';

export class ResponseUtil {
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  static error(message: string, error?: string): ApiResponse<null> {
    return {
      success: false,
      message,
      error,
    };
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string,
  ): ApiResponse<T[]> {
    return {
      success: true,
      data,
      message,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
