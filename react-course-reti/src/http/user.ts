import { User, UserEntity } from "@/model/User";
import { get, post, put, del } from "./client";

const BASE_URL = "users"

export const getUsers = async (delay?: number): Promise<User[]> => {
    return await get(BASE_URL, delay);
}

export const getUserById = async (id: string): Promise<User> => {
    return await get(`${BASE_URL}/${id}`);
}

export const getUser = async (email: string, password: string): Promise<User> => {
    return (await get(`${BASE_URL}?email=${email}&password=${password}`))[0];
}

export const getUsersSubscribtions = async (): Promise<UserEntity[]> => {
    return await get(`${BASE_URL}?_embed=subscribers`);
}

export const addUser = async (user: User): Promise<User> => {
    return await post(BASE_URL, user);
}

export const editUser = async (user: User): Promise<User> => {
    return await put(`${BASE_URL}/${user.id}`, user);
}

export const deleteUser = async (id: string): Promise<void> => {
    return await del(`${BASE_URL}/${id}`);
}