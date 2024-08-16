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
import { DocumentType } from "@typegoose/typegoose";
import CartDao from "../../../src/api/cart/dao";
import { Cart, CartModel } from "../../../src/api/cart/model";
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
    await CartModel.deleteMany();
});

describe("CartDao", () => {
    describe("create", () => {
        it("should create a new cart", async () => {
            const cartData = {
                products: [
                    {
                        product: new mongoose.Types.ObjectId(),
                        quantity: 1,
                    },
                ],
            };

            const result = await CartDao.create(cartData as Cart);

            expect(result).toMatchObject(cartData);
        });
    });

    describe("getAll", () => {
        it("should get all carts", async () => {
            const cartData1 = {
                products: [
                    {
                        product: new mongoose.Types.ObjectId(),
                        quantity: 1,
                    },
                ],
            };
            const cartData2 = {
                products: [
                    {
                        product: new mongoose.Types.ObjectId(),
                        quantity: 2,
                    },
                ],
            };

            await CartDao.create(cartData1 as Cart);
            await CartDao.create(cartData2 as Cart);

            const result = await CartDao.getAll();

            expect(result.length).toBe(2);
        });
    });

    describe("getById", () => {
        it("should get a cart by its ID", async () => {
            const cartData = {
                products: [
                    {
                        product: new mongoose.Types.ObjectId(),
                        quantity: 1,
                    },
                ],
            };

            const createdCart = await CartDao.create(cartData as Cart);
            const result = await CartDao.getById(createdCart._id.toString());

            expect(result).toMatchObject(cartData);
        });
    });

    describe("update", () => {
        it("should update a cart by its ID", async () => {
            const cartData = {
                products: [
                    {
                        product: new mongoose.Types.ObjectId(),
                        quantity: 1,
                    },
                ],
            };

            const createdCart = await CartDao.create(cartData as Cart);

            const updatedCartData = {
                products: [
                    {
                        product: new mongoose.Types.ObjectId(),
                        quantity: 3,
                    },
                ],
            };

            const result = await CartDao.update(
                createdCart._id.toString(),
                updatedCartData as DocumentType<Cart>
            );

            expect(result?.products).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        product: expect.any(mongoose.Types.ObjectId),
                        quantity: updatedCartData.products[0].quantity,
                    }),
                ])
            );
        });
    });

    describe("delete", () => {
        it("should delete a cart by its ID", async () => {
            const cartData = {
                products: [
                    {
                        product: new mongoose.Types.ObjectId(),
                        quantity: 1,
                    },
                ],
            };

            const createdCart = await CartDao.create(cartData as Cart);
            const result = await CartDao.delete(createdCart._id.toString());

            expect(result).toMatchObject(cartData);

            const cartAfterDelete = await CartDao.getById(
                createdCart._id.toString()
            );
            expect(cartAfterDelete).toBeNull();
        });
    });
});
