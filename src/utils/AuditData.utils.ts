// LIBRARIES
import { Types } from "mongoose";

export default class AuditData {
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
