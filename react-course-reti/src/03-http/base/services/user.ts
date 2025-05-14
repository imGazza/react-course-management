import { User, UserEmbedsSubscriptions } from "@/05-model/base/User";
import client from "../client";
import { BaseService } from "../base-service";

const BASE_URL = "users"

class UserService extends BaseService<User>  {
    constructor() {
        super("users")
    } 

    getUserToLog = async (email: string, password: string, delay?: number): Promise<User[]> => {
        return await client.get<User[]>(`${BASE_URL}?email=${email}&password=${password}`, delay);
    }

    getUsersWithSubscriptions = async (): Promise<UserEmbedsSubscriptions[]> => {
        return await client.get<UserEmbedsSubscriptions[]>(`${BASE_URL}?_embed=subscriptions`);
    }

    deleteUser = async (user: User): Promise<void> => {
        await client.delete(`${BASE_URL}/${user.id}?_dependent=subscriptions`);
    }
}
export const userService = new UserService();