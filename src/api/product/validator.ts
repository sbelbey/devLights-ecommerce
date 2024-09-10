// LIBRARIES
import { z } from "zod";

export const productCreatePayloadValidator = z.object({
    title: z.string().min(3, { message: "Title is required" }),
    description: z.string().min(10, { message: "Description is required" }),
    code: z.string().min(3, { message: "Code is required" }),
    price: z
        .number()
        .refine((val) => Number.isFinite(val) && !Number.isInteger(val), {
            message: "Price must be a double",
        }),
    stock: z
        .number()
        .int({ message: "Stock must be an integer" })
        .min(0, { message: "Quantity must be greater than or equal to 0" }),
    category: z.string().refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
        message: "It must be a valid ID",
    }),
    isNew: z.boolean().optional().default(true),
    isAvailable: z.boolean().optional().default(true),
    status: z.boolean().optional().default(true),
    thumbnail: z.array(z.string()).optional().default([]),
});

export const productUpdatePayloadValidator = z.object({
    title: z
        .string()
        .min(3, { message: "Title must have 3 characters at least." })
        .optional(),
    description: z
        .string()
        .min(10, { message: "Description must have 10 characters at least." })
        .optional(),
    code: z
        .string()
        .min(3, { message: "Code must have 3 characters at least." })
        .optional(),
    price: z
        .number()
        .refine((val) => Number.isFinite(val) && !Number.isInteger(val), {
            message: "Price must be a double",
        })
        .optional(),
    stock: z
        .number()
        .int({ message: "Stock must be an integer" })
        .min(0, { message: "Quantity must be greater than or equal to 0" })
        .optional(),
    category: z
        .string()
        .refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
            message: "It must be a valid ID",
        })
        .optional(),
    isNew: z.boolean().optional().default(true),
    isAvailable: z.boolean().optional().default(true),
    status: z.boolean().optional().default(true),
    thumbnail: z.array(z.string()).optional().default([]),
});
