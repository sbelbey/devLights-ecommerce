// LIBRARIES
import request from "supertest";
import { afterAll, beforeAll, expect } from "@jest/globals";
// SERVER
import app from "../../../src/server";
// MODELS
import UserModel from "../../../src/api/user/model";
// CONSTANTS
import HTTP_STATUS from "../../../src/constants/HttpStatus";
// ENVIRONMENT VARIABLES
import config from "../../../src/config/enviroment.config";

const { SESSION_KEY } = config;

describe("User Routes Integration Tests", () => {
    let adminToken: any;
    let userToken: string;

    beforeAll(async () => {
        // Crear un usuario administrador
        const adminResponse = await request(app).post("/api/v1/users").send({
            firstName: "Admin",
            lastName: "User",
            email: "admin@example.com",
            password: "password123",
            role: "admin",
        });

        // Loguearse como administrador para obtener el token y la cookie
        const adminLoginResponse = await request(app)
            .post("/api/v1/users/login")
            .send({
                email: "admin@example.com",
                password: "password123",
            });

        adminToken = adminLoginResponse.header["set-cookie"][0]
            .split(";")[0]
            .split("=")[1];

        // Crear un usuario normal
        const userResponse = await request(app).post("/api/v1/users").send({
            firstName: "Normal",
            lastName: "User",
            email: "user@example.com",
            password: "password123",
            role: "user",
        });

        // Loguearse como usuario normal para obtener el token y la cookie
        const userLoginResponse = await request(app)
            .post("/api/v1/users/login")
            .send({
                email: "user@example.com",
                password: "password123",
            });

        userToken = userLoginResponse.header["set-cookie"][0]
            .split(";")[0]
            .split("=")[1];
    });

    afterAll(async () => {
        await UserModel.deleteMany({});
    });

    describe("POST /api/v1/users/login", () => {
        it("should login a user with valid credentials", async () => {
            const response = await request(app)
                .post("/api/v1/users/login")
                .send({
                    email: "user@example.com",
                    password: "password123",
                });
            expect(response.status).toBe(HTTP_STATUS.ACCEPTED);
            expect(response.body).toHaveProperty("payload.email");
        });

        it("should not login a user with invalid credentials", async () => {
            const response = await request(app)
                .post("/api/v1/users/login")
                .send({
                    email: "user@example.com",
                    password: "wrongpassword",
                });
            expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
        });
    });

    describe("POST /api/v1/users", () => {
        it("should create a new user with valid data", async () => {
            const response = await request(app).post("/api/v1/users").send({
                firstName: "New",
                lastName: "User",
                email: "newuser@example.com",
                password: "password123",
            });
            expect(response.status).toBe(HTTP_STATUS.CREATED);
            expect(response.body).toHaveProperty("payload.email");
        });

        it("should not create a new user with invalid data", async () => {
            const response = await request(app).post("/api/v1/users").send({
                firstName: "New",
                lastName: "User",
                email: "invalidemail",
                password: "short",
            });
            expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });
    describe("PUT /api/v1/users", () => {
        it("should update a user with valid data", async () => {
            const response = await request(app)
                .put("/api/v1/users")
                .set("Cookie", `${SESSION_KEY}=${userToken}`)
                .send({
                    firstName: "Updated",
                    lastName: "User",
                });
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(response.body.payload.firstName).toBe("Updated");
        });

        it("should not update a user with invalid data", async () => {
            const response = await request(app)
                .put("/api/v1/users")
                .set("Cookie", `${SESSION_KEY}=${userToken}`)
                .send({
                    email: "invalidemail",
                });
            expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });

    describe("PUT /api/v1/users/newRole/:id", () => {
        it("should assign a new role to a user by admin", async () => {
            const user = await UserModel.findOne({ email: "user@example.com" });
            if (user) {
                const response = await request(app)
                    .put(`/api/v1/users/newRole/${user._id}`)
                    .set("Cookie", `${SESSION_KEY}=${adminToken}`)
                    .send({
                        role: "saler",
                    });
                expect(response.status).toBe(HTTP_STATUS.OK);
                expect(response.body.payload.role).toBe("saler");
            }
        });

        it("should not assign a new role to a user by non-admin", async () => {
            const user = await UserModel.findOne({ email: "user@example.com" });
            if (user) {
                const response = await request(app)
                    .put(`/api/v1/users/newRole/${user._id}`)
                    .set("Cookie", `${SESSION_KEY}=${userToken}`)
                    .send({
                        role: "saler",
                    });
                expect(response.status).toBe(HTTP_STATUS.FORBIDDEN);
            }
        });
    });

    describe("GET /api/v1/users/:id", () => {
        it("should get a user by id by admin", async () => {
            const user = await UserModel.findOne({ email: "user@example.com" });
            if (user) {
                const response = await request(app)
                    .get(`/api/v1/users/${user._id}`)
                    .set("Cookie", `${SESSION_KEY}=${adminToken}`);
                expect(response.status).toBe(HTTP_STATUS.OK);
                expect(response.body.payload.email).toBe("user@example.com");
            }
        });

        it("should not get a user by id by non-admin", async () => {
            const user = await UserModel.findOne({ email: "user@example.com" });
            if (user) {
                const response = await request(app)
                    .get(`/api/v1/users/${user._id}`)
                    .set("Cookie", `${SESSION_KEY}=${userToken}`);
                expect(response.status).toBe(HTTP_STATUS.FORBIDDEN);
            }
        });
    });

    describe("GET /api/v1/users", () => {
        it("should get all users by admin", async () => {
            const response = await request(app)
                .get("/api/v1/users")
                .set("Cookie", `${SESSION_KEY}=${adminToken}`);
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(response.body.payload.length).toBeGreaterThan(0);
        });

        it("should not get all users by non-admin", async () => {
            const response = await request(app)
                .get("/api/v1/users")
                .set("Cookie", `${SESSION_KEY}=${userToken}`);
            expect(response.status).toBe(HTTP_STATUS.FORBIDDEN);
        });
    });
});
