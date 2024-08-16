import { Response, Request, NextFunction } from "express";
import { AnyZodObject, ZodTypeAny, ZodError } from "zod";
import HTTP_STATUS from "../constants/HttpStatus";

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
