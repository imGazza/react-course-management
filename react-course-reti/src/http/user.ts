import { User, UserEntity } from "@/model/User";
import { httpClient } from "./client";

const BASE_URL = "users/"

export const getUsers = async (delay?: number): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, delay ?? 500));
    const users = await httpClient.get(BASE_URL);

    return users.data;
}

export const getUserById = async (id: string): Promise<User> => {
    
    const user = await httpClient.get(BASE_URL + id); 

    return user.data;
}

export const getUser = async (email: string, password: string): Promise<User> => {
    const params = "?email=" + email + "&password=" + password;
    const user = await httpClient.get(BASE_URL + params);

    return user.data[0];
}

export const getUsersSubscribtions = async (): Promise<UserEntity[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = await httpClient.get(BASE_URL + "?_embed=subscribers");
    
    return user.data;
}

export const addUser = async (user: User): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser = await httpClient.post(BASE_URL, user);

    return newUser.data;
}

export const editUser = async (user: User): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const editedUser = await httpClient.put(BASE_URL + user.id, user);

    return editedUser.data; 
}

export const deleteUser = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    await httpClient.delete(BASE_URL + id);
}