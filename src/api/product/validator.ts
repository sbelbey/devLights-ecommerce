import { z } from "zod";

export const productCreatePayloadValidator = z.object({
    title: z.string().min(3, { message: "Title is required" }),
    description: z.string().min(3, { message: "Description is required" }),
    code: z.string().min(3, { message: "Code is required" }),
    price: z.number().min(0, { message: "Price must be greater than 0" }),
    stock: z.number().min(0, { message: "Quantity must be greater than 0" }),
    category: z.string().refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
        message: "It must be a valid ID",
    }),
    isNew: z.boolean().optional().default(true),
    isAvailable: z.boolean().optional().default(true),
    status: z.boolean().optional().default(true),
    thumbnail: z.array(z.string()).optional().default([]),
});
