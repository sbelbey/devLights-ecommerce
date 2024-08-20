import request from "supertest";
import { afterAll, beforeAll, expect, jest } from "@jest/globals";
import HTTP_STATUS from "../../../src/constants/HttpStatus";
import UserRepository from "../../../src/api/user/reposity";
import UserService from "../../../src/api/user/service"; // Importar UserService
import app from "../../../src/server"; // Importar el servidor
import { mongoose, DocumentType } from "@typegoose/typegoose";
import { User } from "../../../src/api/user/model";

const validUserData = {
    email: "john.doe@example.com",
    password: "securePassword123",
    firstName: "John",
    lastName: "Doe",
};

const invalidUserData = {
    email: "invalid-email",
    password: "short",
};

const existingUserData = {
    email: "jane.doe@example.com",
    password: "securePassword123",
    firstName: "Jane",
    lastName: "Doe",
};

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

let userCreated: DocumentType<User>;

describe("POST / - Create User", () => {
    it("should create a user with valid data", async () => {
        const response = await request(app)
            .post("/api/v1/users")
            .send(validUserData);

        userCreated = response.body.user;
        expect(response.status).toBe(HTTP_STATUS.OK);
        expect(response.body).toEqual({
            message: "User created",
            user: validUserData,
        });
    });

    it("should return error for invalid data", async () => {
        const response = await request(app)
            .post("/api/v1/users")
            .send(invalidUserData);

        expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        expect(response.body).toEqual([
            {
                message: "Required",
                path: "firstName",
            },
            {
                message: "Required",
                path: "lastName",
            },
            { path: "email", message: "Invalid email" },
            { path: "password", message: "Password is too short" },
        ]);
    });

    it("should return error for existing user", async () => {
        // Simular que el usuario ya existe
        jest.spyOn(UserRepository, "findUserByEmail").mockResolvedValueOnce({
            email: existingUserData.email,
        } as any);

        const response = await request(app)
            .post("/api/v1/users")
            .send(existingUserData);

        expect(response.status).toBe(HTTP_STATUS.CONFLICT);
        expect(response.body).toEqual({
            description: "User already exists",
            details: "USER_ALREADY_EXISTS",
            status: HTTP_STATUS.CONFLICT,
        });
    });

    it("should return internal server error for unexpected errors", async () => {
        // Simular un error inesperado
        jest.spyOn(UserService, "createUser").mockRejectedValueOnce(
            new Error("Unexpected error")
        );

        const response = await request(app)
            .post("/api/v1/users")
            .send(validUserData);

        expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
        expect(response.body).toEqual({
            description: "Unexpected error",
            details: "Unexpected error",
            status: HTTP_STATUS.SERVER_ERROR,
        });
    });
});

describe("GET /users/:id", () => {
    const userId: string = "66beab88212d12fc21384cce";

    it("should return a user by valid ID", async () => {
        const res = await request(app).get(`/users/${userId}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("email", validUserData.email);
    });

    it("should return an error for invalid user ID", async () => {
        const res = await request(app).get("/users/invalidUserId");
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toHaveProperty(
            "message",
            "El parámetro debe ser un ID de MongoDB válido."
        );
    });

    it("should return an error if user not found", async () => {
        const nonExistentUserId = new mongoose.Types.ObjectId().toString();
        const res = await request(app).get(`/users/${nonExistentUserId}`);
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toHaveProperty("message", "User not found");
    });
});
