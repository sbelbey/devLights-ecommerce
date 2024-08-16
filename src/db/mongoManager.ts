import mongoose from "mongoose";
import DB_CONFIG from "../config/db.config";

export default class MongoManager {
    private static _instance: MongoManager | null = null;

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

    public static connect(): MongoManager {
        if (!MongoManager._instance) {
            MongoManager._instance = new MongoManager();
        }
        return MongoManager._instance;
    }
}
