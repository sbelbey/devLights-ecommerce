import { jest, expect } from "@jest/globals";
import { BcryptUtils } from "../../src/utils/bcrypt.utils";
import { User } from "../../src/api/user/model";
import bcrypt from "bcrypt"; // Import bcrypt as a module

jest.mock("bcrypt");

describe("BcryptUtils", () => {
    describe("createHash", () => {
        it("should create a hash for the given password", () => {
            const password = "testPassword";
            const salt = "testSalt";
            const hash = "testHash";

            // Cast bcrypt functions to jest.Mock
            (bcrypt.genSaltSync as jest.Mock).mockReturnValue(salt);
            (bcrypt.hashSync as jest.Mock).mockReturnValue(hash);

            const result = BcryptUtils.createHash(password);

            expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
            expect(bcrypt.hashSync).toHaveBeenCalledWith(password, salt);
            expect(result).toBe(hash);
        });
    });

    describe("isValidPassword", () => {
        it("should return true if the password is valid", () => {
            const password = "testPassword";
            const user: User = { password: "hashedPassword" } as User;

            // Cast bcrypt function to jest.Mock
            (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

            const result = BcryptUtils.isValidPassword(user, password);

            expect(bcrypt.compareSync).toHaveBeenCalledWith(
                password,
                user.password
            );
            expect(result).toBe(true);
        });

        it("should return false if the password is invalid", () => {
            const password = "testPassword";
            const user: User = { password: "hashedPassword" } as User;

            // Cast bcrypt function to jest.Mock
            (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

            const result = BcryptUtils.isValidPassword(user, password);

            expect(bcrypt.compareSync).toHaveBeenCalledWith(
                password,
                user.password
            );
            expect(result).toBe(false);
        });
    });
});
