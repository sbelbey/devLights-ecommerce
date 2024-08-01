import * as dotenv from "dotenv";
import { Config } from "../interfaces/config.interface";

dotenv.config();

const config: Config = {
    PORT: process.env.PORT || "3000",
    BACKPORT: process.env.BACKPORT || "8081",
    MONGO_URI: process.env.MONGO_URI || "",
    DATABASE: process.env.DATABASE,
    DB_PASSWORD: process.env.DB_PASSWORD,
    ADMIN_NAME: process.env.ADMIN_NAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    DATA_SOURCE: process.env.DATA_SOURCE || "",
    SECRET_KEY: process.env.SECRET_KEY || "",
    SESSION_KEY: process.env.SESSION_KEY || "",
    EMAIL: process.env.EMAIL || "",
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
};

export default config;
