import {
    beforeAll,
    afterAll,
    jest,
    describe,
    it,
    afterEach,
    expect,
} from "@jest/globals";
import { mongoose } from "@typegoose/typegoose";
import { ProductModel } from "../../../src/api/product/model";
import ProductDAO from "../../../src/api/product/dao";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const TEST_DATABASE = process.env.TEST_DATABASE;

beforeAll(async () => {
    await mongoose.connect(`${MONGO_URI}/${TEST_DATABASE}`);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

afterEach(async () => {
    jest.clearAllMocks();
    await ProductModel.deleteMany();
});

describe("ProductDao", () => {
    describe("create", () => {
        it("should create a product", async () => {
            const productData = {
                title: "Test Product",
                description: "Test Description",
                code: "123456",
                price: 100,
                stock: 100,
                category: "Test Category",
                isNew: true,
                isAvailable: true,
                status: true,
                thumbnail: ["Test Thumbnail"],
            };

            const productCreated = await ProductDAO.create(productData);

            expect(productCreated).toMatchObject(productData);
        });
    });

    describe("getAll", () => {
        it("should get all products", async () => {
            const productData = {
                title: "Test Product",
                description: "Test Description",
                code: "123456",
                price: 100,
                stock: 100,
                category: "Test Category",
                isNew: true,
                isAvailable: true,
                status: true,
                thumbnail: ["Test Thumbnail"],
            };
            const productData2 = {
                title: "Test Product2",
                description: "Test Description2",
                code: "123457",
                price: 100,
                stock: 100,
                category: "Test Category",
                isNew: true,
                isAvailable: true,
                status: true,
                thumbnail: ["Test Thumbnail"],
            };

            await ProductDAO.create(productData);
            await ProductDAO.create(productData2);

            const productsFound = await ProductDAO.getAll();

            expect(productsFound).toHaveLength(2);
        });
    });

    describe("getById", () => {
        it("should get a product by id", async () => {
            const productData = {
                title: "Test Product",
                description: "Test Description",
                code: "123457",
                price: 100,
                stock: 100,
                category: "Test Category",
                isNew: true,
                isAvailable: true,
                status: true,
                thumbnail: ["Test Thumbnail"],
            };
            const productCreated = await ProductDAO.create(productData);

            const productFound = await ProductDAO.getById(
                productCreated._id.toString()
            );

            expect(productFound).toMatchObject(productData);
        });
    });

    describe("update", () => {
        it("should update a product", async () => {
            const productData = {
                title: "Test Product",
                description: "Test Description",
                code: "123456",
                price: 100,
                stock: 100,
                category: "Test Category",
                isNew: true,
                isAvailable: true,
                status: true,
                thumbnail: ["Test Thumbnail"],
            };
            const productCreated = await ProductDAO.create(productData);

            const productDataUpdated = {
                title: "Test Product Updated",
                description: "Test Description",
                code: "123456",
                price: 100,
                stock: 100,
                category: "Test Category",
                isNew: true,
                isAvailable: true,
                status: true,
                thumbnail: ["Test Thumbnail"],
            };

            const productUpdated = await ProductDAO.update(
                productCreated._id.toString(),
                productDataUpdated
            );

            expect(productUpdated).toEqual(
                expect.objectContaining(productDataUpdated)
            );
        });
    });

    describe("delete", () => {
        it("should delete a product by id", async () => {
            const productData = {
                title: "Test Product",
                description: "Test Description",
                code: "123456",
                price: 100,
                stock: 100,
                category: "Test Category",
                isNew: true,
                isAvailable: true,
                status: true,
                thumbnail: ["Test Thumbnail"],
            };

            const createdProduct = await ProductDAO.create(productData);

            const result = await ProductDAO.delete(
                createdProduct._id.toString()
            );

            expect(result).toEqual(expect.objectContaining(productData));

            const productAfterDelete = await ProductDAO.getById(
                createdProduct._id.toString()
            );

            expect(productAfterDelete).toBeNull();
        });
    });
});
