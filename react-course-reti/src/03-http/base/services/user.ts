import { User, UserEmbedsSubscriptions } from "@/05-model/User";
import client from "../client";
import { BaseService } from "../base-service";

const BASE_URL = "users"

class UserService extends BaseService<User>  {
    constructor() {
        super("users")
    } 

    getUserToLog = async (email: string, password: string, delay?: number): Promise<User[]> => {
        return client.get<User[]>(`${BASE_URL}?email=${email}&password=${password}`, delay);
    }

    getUsersWithSubscriptions = async (): Promise<UserEmbedsSubscriptions[]> => {
        return client.get<UserEmbedsSubscriptions[]>(`${BASE_URL}?_embed=subscribers`);
    }

    deleteUser = async (id: number): Promise<User> => {
        return client.delete(`${BASE_URL}/${id}&_dependent=subscriptions`);
    }
}
export const userService = new UserService();