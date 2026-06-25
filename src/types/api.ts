// =============================================================================
// API Envelope Types
// =============================================================================
// Mirrors the standardized JSON envelope from the WordPress REST API.
// Every backend response follows one of these shapes.

/**
 * Successful API response envelope.
 *
 * @example
 * {
 *   success: true,
 *   message: "Dashboard stats loaded.",
 *   data: { total_attempts: 42 }
 * }
 */
export interface ApiResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

/**
 * Error API response envelope.
 *
 * @example
 * {
 *   success: false,
 *   code: "token_expired",
 *   message: "Token has expired.",
 *   errors: {}
 * }
 */
export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
  errors: Record<string, string>;
}

/**
 * Paginated API response — wraps items with pagination metadata.
 *
 * @example
 * {
 *   success: true,
 *   message: "Quiz history loaded.",
 *   data: {
 *     items: [...],
 *     pagination: { page: 1, per_page: 20, total_items: 100, total_pages: 5 }
 *   }
 * }
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
}

/**
 * Normalized error thrown by the API client.
 * Axios interceptor transforms API errors into this shape.
 */
export interface ApiError {
  code: string;
  message: string;
  status: number;
  errors: Record<string, string>;
}
