import Database from '../config/Database';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';

class UserController {
  public static async getAllUsers() {
    const connection = Database.getConnection();
    const allUsers = await connection.manager.find(User);
    return allUsers;
  }

  public static async getAllUsersSafe() {
    const userRepository = getRepository(User);
    const allUsersSafe = await userRepository.find({
      select: [
        'id',
        'email',
        'name',
        'role',
        'isJudging',
        'company',
        'tags',
        'createdAt',
        'updatedAt',
      ],
    });
    const usersToReturn: { [userID: number]: Partial<User> } = {};
    for (const user of allUsersSafe) {
      usersToReturn[user.id!] = {
        ...user,
      };
    }

    return usersToReturn;
  }

  public static async updateUser(user: User) {
    const userRepository = getRepository(User);
    return await userRepository.save(user);
  }
}

export default UserController;
