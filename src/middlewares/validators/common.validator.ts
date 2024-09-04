// LIBRARIES
import { z } from "zod";

export const idValidator = z
    .string()
    .refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
        message: "El parámetro debe ser un ID de MongoDB válido.",
    })
    .optional();

export const idValidatorRequired = z
    .string()
    .refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
        message: "El parámetro debe ser un ID de MongoDB válido.",
    });
