import { IUser } from "./interface";
import UserModel from "./model";

/**
 * Provides data access operations for managing users.
 */
class UserDao {
    /**
     * Creates a new user in the database.
     * @param user - The partial user object to create.
     * @returns The created user object.
     */
    static async create(user: Partial<IUser>) {
        return await UserModel.create(user);
    }

    /**
     * Retrieves all users from the database.
     * @returns A Promise that resolves to an array of `IUser` objects representing all users.
     */
    static async getAll(): Promise<IUser[]> {
        return await UserModel.find();
    }

    /**
     * Retrieves a user from the database by their unique identifier.
     * @param id - The unique identifier of the user to retrieve.
     * @returns A Promise that resolves to the user object if found, or `null` if not found.
     */
    static async getById(id: string): Promise<IUser | null> {
        return await UserModel.findById(id);
    }

    /**
     * Updates an existing user in the database.
     * @param id - The unique identifier of the user to update.
     * @param user - The updated user object.
     * @returns A Promise that resolves to the updated user object if found, or `null` if not found.
     */
    static async update(id: string, user: IUser): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(id, user, {
            new: true,
        });
    }

    /**
     * Deletes a user from the database by their unique identifier.
     * @param id - The unique identifier of the user to delete.
     * @returns A Promise that resolves to the deleted user object if found, or `null` if not found.
     */
    static async delete(id: string): Promise<IUser | null> {
        return await UserModel.findByIdAndDelete(id);
    }
}

export default UserDao;
