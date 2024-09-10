// LIBRARIES
import { Types } from "mongoose";

/**
 * Utility functions for managing audit data in the application.
 */
export default class AuditData {
    /**
     * Adds audit data to the provided payload, including the creation timestamp and the ID of the user who created the data.
     *
     * @param user - The ID of the user who created the data.
     * @param payload - The data to add the audit information to.
     * @returns The original payload with the added audit data.
     */
    static addCreateData<T>(
        user: string,
        payload: T
    ): T & { createdAt: Date; createdBy: Types.ObjectId } {
        const createdBy: Types.ObjectId = new Types.ObjectId(user);
        return {
            ...payload,
            createdAt: new Date(),
            createdBy,
        };
    }

    /**
     * Adds audit data to the provided payload, including the update timestamp and the ID of the user who updated the data.
     *
     * @param user - The ID of the user who updated the data.
     * @param payload - The data to add the audit information to.
     * @returns The original payload with the added audit data.
     */
    static addUpdateData<T>(
        user: string,
        payload: T
    ): T & { updatedAt: Date; updatedBy: Types.ObjectId } {
        const updatedBy: Types.ObjectId = new Types.ObjectId(user);

        return {
            ...payload,
            updatedAt: new Date(),
            updatedBy,
        };
    }
}
