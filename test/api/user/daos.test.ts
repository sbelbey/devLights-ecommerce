import {
    afterAll,
    beforeAll,
    afterEach,
    describe,
    it,
    expect,
    jest,
} from "@jest/globals";
import mongoose from "mongoose";
import UserDao from "../../../src/api/user/dao";
import { User, UserModel } from "../../../src/api/user/model";
import { UserRole } from "../../../src/constants/UserRole.constants";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const TEST_DATABASE = process.env.TEST_DATABASE;

beforeAll(async () => {
    await mongoose.connect(`${MONGO_URI}/${TEST_DATABASE}`);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

afterEach(async () => {
    jest.clearAllMocks();
    await UserModel.deleteMany();
});

describe("UserDao", () => {
    describe("create", () => {
        it("debería crear un nuevo usuario", async () => {
            const userData: User = {
                firstName: "Juan",
                lastName: "Pérez",
                email: "juanperez@mail.com",
                password: "password123",
                role: UserRole.USER,
                cart: [],
                resetToken: "",
                resetTokenExpires: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await UserDao.create(userData);

            expect(result).toMatchObject(
                userData as unknown as Record<string, unknown>
            );
        });
    });

    describe("getAll", () => {
        it("debería obtener todos los usuarios", async () => {
            const userData1: User = {
                firstName: "Juan",
                lastName: "Pérez",
                email: "juanperez@mail.com",
                password: "password123",
                role: UserRole.USER,
                cart: [],
                resetToken: "",
                resetTokenExpires: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const userData2: User = {
                firstName: "María",
                lastName: "García",
                email: "mariagarcia@mail.com",
                password: "password456",
                role: UserRole.USER,
                cart: [],
                resetToken: "",
                resetTokenExpires: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await UserDao.create(userData1);
            await UserDao.create(userData2);

            const result = await UserDao.getAll();

            expect(result.length).toBe(2);
        });
    });

    describe("getById", () => {
        it("debería obtener un usuario por su ID", async () => {
            const userData1: User = {
                firstName: "Juan",
                lastName: "Pérez",
                email: "juanperez@mail.com",
                password: "password123",
                role: UserRole.USER,
                cart: [],
                resetToken: "",
                resetTokenExpires: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const createdUser = await UserDao.create(userData1);
            const result = await UserDao.getById(createdUser._id.toString());

            expect(result).toMatchObject(
                userData1 as unknown as Record<string, unknown>
            );
        });
    });

    describe("update", () => {
        it("debería actualizar un usuario por su ID", async () => {
            const userData: User = {
                firstName: "Juan",
                lastName: "Pérez",
                email: "juanperez@mail.com",
                password: "password123",
                role: UserRole.USER,
                cart: [],
                resetToken: "",
                resetTokenExpires: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const createdUser = await UserDao.create(userData);
            const updatedUserData = {
                firstName: "Juan",
                lastName: "Pérez Actualizado",
                email: "juanperez@mail.com",
                password: "newpassword123",
                role: UserRole.USER,
                cart: [],
                resetToken: "",
                resetTokenExpires: 0,
                createdAt: createdUser.createdAt,
                updatedAt: new Date(),
            };

            const result = await UserDao.update(
                createdUser._id.toString(),
                updatedUserData as User
            );
            expect(result).toEqual(expect.objectContaining(updatedUserData));
        });
    });

    describe("delete", () => {
        it("debería eliminar un usuario por su ID", async () => {
            const userData: User = {
                firstName: "Juan",
                lastName: "Pérez",
                email: "juanperez@example.com",
                password: "password123",
                role: UserRole.USER,
                cart: [],
                resetToken: "",
                resetTokenExpires: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const createdUser = await UserDao.create(userData);
            const result = await UserDao.delete(createdUser._id.toString());

            expect(result).toMatchObject(
                userData as unknown as Record<string, unknown>
            );

            const userAfterDelete = await UserDao.getById(
                createdUser._id.toString()
            );
            expect(userAfterDelete).toBeNull();
        });
    });
});
