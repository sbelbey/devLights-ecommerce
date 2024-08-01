/**
 * Database Configuration Module
 *
 * This module handles the configuration for the MongoDB connection.
 * It imports environment variables and constructs the MongoDB URI.
 */

import { DBConfig } from "../interfaces/config.interface";
import config from "./enviroment.config";

const { MONGO_URI, DATABASE, DB_PASSWORD } = config;

/**
 * Database configuration object
 * @type {Object} DBConfig
 * @property {Object} mongo - MongoDB specific configuration
 * @property {string|null} mongo.uri - Constructed MongoDB URI
 */

const DB_CONFIG: DBConfig = {
    mongo: {
        uri: MONGO_URI
            ? MONGO_URI.includes("<password>") && DB_PASSWORD && DATABASE
                ? MONGO_URI.replace("<password>", DB_PASSWORD).replace(
                      "<database>",
                      DATABASE
                  )
                : MONGO_URI
            : null,
    },
};

export default DB_CONFIG;
