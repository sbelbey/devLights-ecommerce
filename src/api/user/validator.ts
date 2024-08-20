import { z } from "zod";
import { UserRole } from "../../constants/UserRole.constants";

/**
 * Validates the payload for creating a new user.
 * The validator ensures the following:
 * - `firstName` is a string with at least 3 characters
 * - `lastName` is a string with at least 3 characters
 * - `email` is a valid email address
 * - `password` is a string with at least 8 characters
 * - `role` is an optional `UserRole` enum value
 */
export const userCreatePayloadValidator = z.object({
    firstName: z.string().min(3, { message: "Name is required" }),
    lastName: z.string().min(3, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(8, { message: "Password is too short" }),
    role: z.nativeEnum(UserRole).optional(),
});

/**
 * Validates the payload for a user login request.
 * The validator ensures the following:
 * - `email` is a valid email address
 * - `password` is at least 8 characters long
 */
export const userLoginValidator = z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(8, { message: "Password is too short" }),
});
