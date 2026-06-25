// =============================================================================
// Common Shared Types
// =============================================================================

/**
 * Numeric ID type for database entities.
 */
export type ID = number;

/**
 * ISO 8601 datetime string from the backend (e.g., "2026-06-25 12:00:00").
 */
export type Timestamp = string;

/**
 * Generic record with string keys used for optional metadata.
 */
export type Metadata = Record<string, unknown>;
