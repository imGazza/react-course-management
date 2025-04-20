import { User } from "@/model/User";
import { httpClient } from "./client";

const BASE_URL = "users/"

export const getUser = async (email: string, password: string): Promise<User> => {
    const params = "?email=" + email + "&password=" + password;
    const user = await httpClient.get(BASE_URL + params);

    return user.data[0];
}