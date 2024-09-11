// LIBRARIES
import { jest, expect } from "@jest/globals";
import bcrypt from "bcrypt";
// INTERFACES
import { IUser } from "../../src/api/user/interface";
// UTILS
import { BcryptUtils } from "../../src/utils/bcrypt.utils";

jest.mock("bcrypt");

describe("BcryptUtils", () => {
    describe("Should create a hash", () => {
        it("Should create a hash for the given password", () => {
            const password = "testPassword";
            const salt = "testSalt";
            const hash = "testHash";

            (bcrypt.genSaltSync as jest.Mock).mockReturnValue(salt);
            (bcrypt.hashSync as jest.Mock).mockReturnValue(hash);

            const result = BcryptUtils.createHash(password);

            expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
            expect(bcrypt.hashSync).toHaveBeenCalledWith(password, salt);
            expect(result).toBe(hash);
        });
    });

    describe("isValidPassword", () => {
        it("Should return true if the password is valid", () => {
            const password = "testPassword";
            const user: IUser = { password: "hashedPassword" } as IUser;

            // Cast bcrypt function to jest.Mock
            (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

            const result = BcryptUtils.isValidPassword(user, password);

            expect(bcrypt.compareSync).toHaveBeenCalledWith(
                password,
                user.password
            );
            expect(result).toBe(true);
        });

        it("Should return false if the password is invalid", () => {
            const password = "testPassword";
            const user: IUser = { password: "hashedPassword" } as IUser;

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
