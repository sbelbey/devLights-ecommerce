import { z } from "zod";

export const categoryCreatePayloadValidator = z.object({
    name: z.string().min(3, { message: "Name is required" }),
    description: z.string().min(3, { message: "Description is required" }),
    status: z.boolean().default(true).optional(),
    subCategory: z
        .array(
            z.string().refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
                message: "It must be a valid ID",
            })
        )
        .default([])
        .optional(),
});
