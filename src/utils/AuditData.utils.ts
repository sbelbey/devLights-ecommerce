import { mongoose } from "@typegoose/typegoose";
import { Request } from "express";

export default class AuditData {
    /**
     * Adds creation data to a payload.
     *
     * @param {Request} req - The request object.
     * @param {T} payload - The payload to add creation data to.
     * @return {T & { createdAt: Date; createdBy: string | undefined }} - The payload with creation data.
     */
    static addCreateData<T>(
        req: Request,
        payload: T
    ): T & { createdAt: Date; createdBy: string | undefined } {
        let createdBy: string | undefined;
        if (req.user && typeof req.user === "string") {
            createdBy = new mongoose.Types.ObjectId(req.user).toString();
        }

        return {
            ...payload,
            createdAt: new Date(),
            createdBy,
        };
    }

    /**
     * A description of the entire function.
     *
     * @param {Request} req - the request object
     * @param {T} payload - the payload data
     * @return {T & { updatedAt: Date; updatedBy: string | undefined }} the updated payload with additional updatedAt and updatedBy properties
     */
    static addUpdateData<T>(
        req: Request,
        payload: T
    ): T & { updatedAt: Date; updatedBy: string | undefined } {
        let updatedBy: string | undefined;
        if (req.user && typeof req.user === "string") {
            updatedBy = new mongoose.Types.ObjectId(req.user).toString();
        }

        return {
            ...payload,
            updatedAt: new Date(),
            updatedBy,
        };
    }
}
