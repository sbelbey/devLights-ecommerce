// LIBRARIES
import { Types } from "mongoose";
// INTERFACES
import { CartPopulated, CartResponse, ICart } from "./interface";
import { ProductFindPopulated } from "../product/interface";
import { TicketResponse } from "../ticket/interface";
import { UserResponse } from "../user/interface";
// DAOS
import CartDao from "./dao";
import ProductDao from "../product/dao";
import UserDao from "../user/dao";
// MODELS
import CartModel from "./model";
// SERVICES
import TicketService from "../ticket/service";
// UTILS
import HttpError from "../../utils/HttpError.utils";
// CONSTANTS
import HTTP_STATUS from "../../constants/HttpStatus";
// DTOS
import ProductDto from "../product/dto";
import UserDto from "../user/dto";

/**
 * Provides functionality for managing a user's shopping cart, including creating a new cart, adding products to the cart, and purchasing the items in the cart.
 */
export class CartService {
    /**
     * Creates a new cart in the database.
     * @returns {Promise<CartPopulated>} The newly created cart.
     * @throws {HttpError} If there is an error creating the cart.
     */
    static async createCart(): Promise<CartPopulated> {
        try {
            const cartPayload: ICart = new CartModel({
                products: [],
                createdAt: new Date(),
            });

            const cartCreated = await CartDao.create(cartPayload);
            return cartCreated;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );

            throw error;
        }
    }

    /**
     * Adds a product to the specified user's cart.
     * @param cartIdRequested - The ID of the cart to add the product to.
     * @param productId - The ID of the product to add to the cart.
     * @param user - The ID of the user whose cart the product should be added to.
     * @returns {Promise<CartResponse>} The updated cart with the new product added.
     * @throws {HttpError} If the cart or product is not found, or if there is an error updating the cart.
     */
    static async addToCart(
        cartIdRequested: string,
        productId: string,
        user: string
    ): Promise<CartResponse> {
        try {
            // Find the cart by its ID
            const cartFound: CartPopulated | null = await CartDao.getById(
                cartIdRequested
            );

            // If the cart is not found, throw an error
            if (!cartFound) {
                const error: HttpError = new HttpError(
                    "Cart not found",
                    "Cart not found",
                    HTTP_STATUS.NOT_FOUND
                );
                throw error;
            }

            // Find the product by its ID
            const productFound: ProductFindPopulated | null =
                await ProductDao.getById(productId);

            // If the product is not found, throw an error
            if (!productFound) {
                const error: HttpError = new HttpError(
                    "Product not found",
                    "Product not found",
                    HTTP_STATUS.NOT_FOUND
                );
                throw error;
            }

            let firstProduct:
                | { product: Types.ObjectId; quantity: number }
                | undefined = undefined;

            // Check if the cart is empty or if the product is not already in the cart
            if (
                !cartFound.products.length ||
                cartFound.products.some(
                    (item) => item.product._id.toString() !== productId
                )
            ) {
                // If the cart is empty or the product is not in the cart, add the product with a quantity of 1
                firstProduct = {
                    product: new Types.ObjectId(productFound._id),
                    quantity: 1,
                };
            }

            // Create a new cart object with the updated product list and updated timestamp
            const cartModeled: ICart = {
                ...cartFound,
                products: [
                    ...(firstProduct ? [firstProduct] : []),
                    ...cartFound.products.map((individualProduct) => {
                        if (
                            individualProduct.product._id.toString() ===
                            productId
                        ) {
                            // If the product is already in the cart, increase its quantity by 1
                            return {
                                product: individualProduct.product._id,
                                quantity: individualProduct.quantity + 1,
                            };
                        }
                        // Otherwise, keep the quantity unchanged
                        return {
                            product: individualProduct.product._id,
                            quantity: individualProduct.quantity,
                        };
                    }),
                ],
                updatedAt: new Date(),
            };

            // Update the cart in the database
            const cartUpdated: CartPopulated | null = await CartDao.update(
                cartIdRequested,
                cartModeled
            );

            // If the cart update fails, throw an error
            if (!cartUpdated) {
                const error: HttpError = new HttpError(
                    "Cart not updated",
                    "Cart not updated",
                    HTTP_STATUS.NOT_FOUND
                );
                throw error;
            }

            // Create a cart response object with the updated cart and populated product details
            const cartResponse: CartResponse = {
                ...cartUpdated,
                products: cartUpdated.products.map((item) => {
                    return {
                        ...item,
                        product: ProductDto.single(
                            item.product as unknown as ProductFindPopulated
                        ),
                    };
                }),
            };

            // Return the updated cart response
            return cartResponse;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );

            throw error;
        }
    }

    /**
     * Purchases the cart associated with the provided `cartIdRequested` and the `user`.
     *
     * This method performs the following steps:
     * 1. Retrieves the cart by the provided `cartIdRequested`.
     * 2. Checks if the cart exists and if there is enough stock for each product in the cart.
     * 3. Creates a ticket for the cart.
     * 4. Updates the cart to be inactive.
     * 5. Creates a new cart for the user.
     * 6. Updates the user's cart reference to the newly created cart.
     * 7. Updates the stock for each product in the purchased cart.
     * 8. Returns the created ticket and the updated user response.
     *
     * @param cartIdRequested - The ID of the cart to be purchased.
     * @param user - The ID of the user purchasing the cart.
     * @returns An object containing the created ticket and the updated user response.
     * @throws {HttpError} If the cart is not found, there is insufficient stock, or any other error occurs during the purchase process.
     */
    static async purchase(
        cartIdRequested: string,
        user: string
    ): Promise<{
        ticketCreated: TicketResponse;
        userUpdateResponse: UserResponse;
    }> {
        try {
            // Step 1: Retrieve the cart by the provided `cartIdRequested`
            const cartFound: CartPopulated | null = await CartDao.getById(
                cartIdRequested
            );

            // Step 2: Check if the cart exists and if there is enough stock for each product in the cart
            if (!cartFound) {
                const error: HttpError = new HttpError(
                    "Cart not found",
                    "Cart not found",
                    HTTP_STATUS.NOT_FOUND
                );
                throw error;
            }

            for (const item of cartFound.products) {
                if (
                    item.product.stock < item.quantity &&
                    !item.product.status
                ) {
                    const error: HttpError = new HttpError(
                        `Not enough stock for product ${item.product.title}`,
                        "INSUFFICIENT_STOCK",
                        HTTP_STATUS.BAD_REQUEST
                    );
                    throw error;
                }
            }

            // Step 3: Create a ticket for the cart
            const cartResponsed: CartResponse = {
                ...cartFound,
                products: cartFound.products.map((item) => {
                    return {
                        ...item,
                        product: ProductDto.single(
                            item.product as unknown as ProductFindPopulated
                        ),
                    };
                }),
            };

            const userFound = await UserDao.getById(user);

            if (!userFound) {
                throw new HttpError(
                    "User not found",
                    "USER_NOT_FOUND",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            // Step 4: Update the cart to be inactive
            // Step 5: Create a new cart for the user
            // Step 6: Update the user's cart reference to the newly created cart
            const [ticketCreated, cartUpdated, cartCreated] = await Promise.all(
                [
                    TicketService.create(cartResponsed, userFound),
                    CartDao.update(cartIdRequested, {
                        ...cartFound,
                        isActive: false,
                        updatedAt: new Date(),
                    } as unknown as ICart),
                    CartService.createCart(),
                ]
            );

            if (!ticketCreated || !cartUpdated || !cartCreated) {
                const error: HttpError = new HttpError(
                    "Cart not purchased",
                    "Cart not purchased",
                    HTTP_STATUS.NOT_FOUND
                );
                throw error;
            }

            const userUpdated = await UserDao.update(user, {
                ...userFound,
                cart: cartCreated._id,
            });
            if (!userUpdated) {
                const error: HttpError = new HttpError(
                    "User not updated",
                    "User not updated",
                    HTTP_STATUS.NOT_FOUND
                );
                throw error;
            }

            // Step 7: Update the stock for each product in the purchased cart
            for (const item of cartFound.products) {
                const productFound: ProductFindPopulated | null =
                    await ProductDao.getById(item.product._id.toString());

                if (productFound) {
                    const newStock = productFound.stock - item.quantity;
                    await ProductDao.update(item.product._id.toString(), {
                        stock: newStock,
                        updatedAt: new Date(),
                    });
                }
            }

            // Step 8: Return the created ticket and the updated user response
            return {
                ticketCreated,
                userUpdateResponse: UserDto.userDTO(userUpdated),
            };
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );

            throw error;
        }
    }
}
