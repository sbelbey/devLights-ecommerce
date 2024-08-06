import { User, UserModel } from "../schemas/users.models";

class UserDao {
    static async create(user: User) {
        return await UserModel.create(user);
    }
}

export default UserDao;
