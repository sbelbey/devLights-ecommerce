// LIBRARIES
import mongoose from "mongoose";
import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    expect,
    it,
    jest,
} from "@jest/globals";
// MODELS
import CartModel from "../../../src/api/cart/model";
import ProductModel from "../../../src/api/product/model";
// DAOS
import CartDao from "../../../src/api/cart/dao";
// CONSTANTS
import config from "../../../src/config/enviroment.config";
import CategoryModel from "../../../src/api/category/model";
import { ICart } from "../../../src/api/cart/interface";

const { MONGO_URI, TEST_DATABASE } = config;

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
    await ProductModel.deleteMany();
});

describe("CartDao", () => {
    describe("create", () => {
        it("should create a new cart", async () => {
            const product = await ProductModel.create({
                title: "Test Product",
                price: 100,
                category: new mongoose.Types.ObjectId(),
                stock: 10,
                code: "test-product",
                description: "Test description",
            });

            const cartData = new CartModel({
                products: [
                    {
                        product: product._id,
                        quantity: 1,
                    },
                ],
                createdAt: new Date(),
            });

            const createdCart = await CartDao.create(cartData);
            expect(createdCart).toHaveProperty("_id");
            expect(createdCart.products[0].product._id).toEqual(product._id);
        });
    });

    describe("getAll", () => {
        it("should retrieve all carts", async () => {
            const product = await ProductModel.create({
                title: "Test Product",
                price: 100,
                category: new mongoose.Types.ObjectId(),
                stock: 10,
                code: "test-product",
                description: "Test description",
            });

            const cartData = new CartModel({
                products: [
                    {
                        product: product._id,
                        quantity: 1,
                    },
                ],
                createdAt: new Date(),
            });

            await CartDao.create(cartData);
            const carts = await CartDao.getAll();
            expect(carts.length).toBeGreaterThan(0);
        });
    });

    describe("getById", () => {
        it("should retrieve a cart by id", async () => {
            const category = await CategoryModel.create({
                name: "Category",
                description: "Category description",
                createdAt: new Date(),
                createdBy: new mongoose.Types.ObjectId(),
            });
            const product = await ProductModel.create({
                title: "Test Product",
                price: 100,
                category: category._id,
                stock: 10,
                code: "test-product",
                description: "Test description",
            });

            const cartData = new CartModel({
                products: [
                    {
                        product: product._id,
                        quantity: 1,
                    },
                ],
                createdAt: new Date(),
            });

            const createdCart = await CartDao.create(cartData);
            const foundCart = await CartDao.getById(createdCart._id.toString());
            expect(foundCart).not.toBeNull();
            expect(foundCart?._id).toEqual(createdCart._id);
        });
    });

    // describe("update", () => {
    //     it("should update an existing cart", async () => {
    //         const category = await CategoryModel.create({
    //             name: "Category2",
    //             description: "Category description",
    //             createdAt: new Date(),
    //             createdBy: new mongoose.Types.ObjectId(),
    //         });
    //         const product = await ProductModel.create({
    //             title: "Test Product",
    //             price: 100,
    //             category: category._id,
    //             stock: 10,
    //             code: "test-product",
    //             description: "Test description",
    //         });

    //         const cartData = new CartModel({
    //             products: [
    //                 {
    //                     product: product._id,
    //                     quantity: 1,
    //                 },
    //             ],
    //             createdAt: new Date(),
    //         });

    //         const createdCart = await CartDao.create(cartData);

    //         const updatedCartData = {
    //             products: [
    //                 {
    //                     product: product._id,
    //                     quantity: 2,
    //                 },
    //             ],
    //         };

    //         const updatedCart = await CartDao.update(
    //             createdCart._id.toString(),
    //             {
    //                 ...createdCart,
    //                 ...updatedCartData,
    //             }
    //         );

    //         expect(updatedCart).not.toBeNull();
    //         expect(updatedCart?.products[0].quantity).toBe(2);
    //     });
    // });

    describe("delete", () => {
        it("should delete a cart by id", async () => {
            const product = await ProductModel.create({
                title: "Test Product",
                price: 100,
                category: new mongoose.Types.ObjectId(),
                stock: 10,
                code: "test-product",
                description: "Test description",
            });

            const cartData = new CartModel({
                products: [
                    {
                        product: product._id,
                        quantity: 1,
                    },
                ],
                createdAt: new Date(),
            });

            const createdCart = await CartDao.create(cartData);
            const deletedCart = await CartDao.delete(
                createdCart._id.toString()
            );
            expect(deletedCart).not.toBeNull();

            const foundCart = await CartDao.getById(createdCart._id.toString());
            expect(foundCart).toBeNull();
        });
    });
});
