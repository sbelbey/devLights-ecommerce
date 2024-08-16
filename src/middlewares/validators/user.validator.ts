import { z } from "zod";
import { UserRole } from "../../constants/UserRole.constants";

export const userCreatePayloadValidator = z.object({
    firstName: z.string().min(3, { message: "Name is required" }),
    lastName: z.string().min(3, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(8, { message: "Password is too short" }),
    role: z.nativeEnum(UserRole).optional(),
});
