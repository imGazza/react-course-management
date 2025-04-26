import { User } from "@/model/User";
import { httpClient } from "./client";

const BASE_URL = "users/"

export const getUsers = async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = await httpClient.get(BASE_URL);

    return users.data;
}

export const getUser = async (email: string, password: string): Promise<User> => {
    const params = "?email=" + email + "&password=" + password;
    const user = await httpClient.get(BASE_URL + params);

    return user.data[0];
}