// LIBRARIES
import { Response, Request, NextFunction } from "express";
import { AnyZodObject, ZodTypeAny, ZodError } from "zod";
// CONSTANTS
import HTTP_STATUS from "../constants/HttpStatus";

/**
 * Middleware function that validates the request body and parameters using Zod schemas.
 *
 * @param {AnyZodObject | null} schema - The Zod schema to validate the request body against.
 * @param {ZodTypeAny | null} paramsSchema - The Zod schema to validate the request parameters against.
 * @returns {(req: Request, res: Response, next: NextFunction) => void} - The middleware function that performs the validation.
 */
const schemaValidator = (
    schema: AnyZodObject | null,
    paramsSchema: ZodTypeAny | null
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schema) {
                schema.parse(req.body);
            }

            if (paramsSchema) {
                paramsSchema.parse(req.params.id);
                if (req.params.productId) {
                    paramsSchema.parse(req.params.productId);
                }
            }
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json(
                    error.issues.map((issue) => ({
                        path: issue.path[0],
                        message: issue.message,
                    }))
                );
            }
            return res
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };
};

export default schemaValidator;
