/**
 * @fileoverview This file contains the UserDao class which provides methods to interact with the users collection in the database.
 * @author Saúl Belbey
 * @version 1.0.0
 */
import { DocumentType } from "@typegoose/typegoose";
import { User, UserModel } from "./model";
/**
 * Class representing the Data Access Object (DAO) for users.
 */
class UserDao {
    /**
     * Creates a new user in the database.
     * @param {User} user - The user object to be created.
     * @returns {Promise<DocumentType<User>>} A Promise that resolves to the created User.
     */
    static async create(user: User): Promise<DocumentType<User>> {
        return await UserModel.create(user);
    }

    /**
     * Retrieves all users from the database.
     * @returns {Promise<DocumentType<User>[]>} A Promise that resolves to an array of Users.
     */
    static async getAll(): Promise<DocumentType<User>[]> {
        return await UserModel.find();
    }

    /**
     * Retrieves a user by their ID from the database.
     * @param {string} id - The ID of the user to retrieve.
     * @returns {Promise<DocumentType<User> | null>} A Promise that resolves to the found User or null if not found.
     */
    static async getById(id: string): Promise<DocumentType<User> | null> {
        return await UserModel.findById(id);
    }

    /**
     * Updates a user in the database.
     * @param {string} id - The ID of the user to update.
     * @param {User} user - The updated user object.
     * @returns {Promise<DocumentType<User> | null>} A Promise that resolves to the updated User or null if not found.
     */
    static async update(
        id: string,
        user: User
    ): Promise<DocumentType<User> | null> {
        return await UserModel.findByIdAndUpdate(id, user, {
            new: true,
        });
    }

    /**
     * Deletes a user from the database.
     * @param {string} id - The ID of the user to delete.
     * @returns {Promise<DocumentType<User> | null>} A Promise that resolves to the deleted User or null if not found.
     */
    static async delete(id: string): Promise<DocumentType<User> | null> {
        return await UserModel.findByIdAndDelete(id);
    }
}

export default UserDao;
