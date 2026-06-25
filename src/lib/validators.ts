import { z } from "zod";

// =============================================================================
// Shared Zod Schemas
// =============================================================================
// Reusable validation schemas for forms and API response validation.
// Feature-specific schemas live in their feature's types.ts file.

/** Email validation used across login and profile forms. */
export const emailSchema = z
  .string()
  .min(1, "Email is required.")
  .email("Please enter a valid email address.");

/** Password validation for the login form. */
export const passwordSchema = z
  .string()
  .min(1, "Password is required.");

/** Positive integer ID validation for route params. */
export const idSchema = z.coerce.number().int().positive();

/** Pagination page number validation. */
export const pageSchema = z.coerce.number().int().positive().default(1);
