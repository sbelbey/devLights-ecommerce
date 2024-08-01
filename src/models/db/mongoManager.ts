/**
 * @file mongoManager.ts
 * @description This file contains the MongoManager class that handles the MongoDB connection using the Singleton pattern.
 */

import mongoose from "mongoose";
import DB_CONFIG from "../../config/db.config";

/**
 * @class MongoManager
 * @description Class that manages the MongoDB connection using the Singleton pattern.
 */
export default class MongoManager {
    /** @private Unique instance of MongoManager */
    private static _instance: MongoManager | null = null;

    /**
     * @private
     * @constructor
     * @description Private constructor that establishes the MongoDB connection.
     * @throws {Error} If the MongoDB URI is not defined.
     */
    private constructor() {
        mongoose.set("strictQuery", false);
        const mongoUri = DB_CONFIG.mongo.uri;
        if (!mongoUri) {
            throw new Error("MongoDB URI is not defined.");
        }

        mongoose.connect(mongoUri);

        const db = mongoose.connection;

        db.on("error", (error) => {
            console.log(`db connection failed: ${error}`);
            throw error;
        });

        db.once("open", () => {
            console.log("db connection succeeded");
        });
    }

    /**
     * @public
     * @static
     * @method connect
     * @description Static method to get the unique instance of MongoManager and establish the connection.
     * @returns {MongoManager} The unique instance of MongoManager.
     */
    public static connect(): MongoManager {
        if (!MongoManager._instance) {
            MongoManager._instance = new MongoManager();
        }
        return MongoManager._instance;
    }
}
