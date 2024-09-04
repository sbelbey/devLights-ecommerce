// LIBRARIES
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

export default class MiddlewareConfig {
    static config(app: express.Application): void {
        app.use(
            cors({
                origin: "http://localhost:8080",
                methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
                preflightContinue: false,
                optionsSuccessStatus: 204,
                credentials: true,
                allowedHeaders: [
                    "Content-Type",
                    "Authorization",
                    "Content-Disposition",
                    "Access-Control-Allow-Origin",
                    "Access-Control-Allow-Credentials",
                ],
            })
        );
        app.use(express.static(path.join(process.cwd(), "src", "public")));
        app.use(cookieParser());

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
    }
}
