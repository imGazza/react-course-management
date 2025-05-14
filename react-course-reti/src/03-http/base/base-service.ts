import { BaseEntity } from "@/05-model/base/BaseEntity";
import client from "./client";

export class BaseService<T extends BaseEntity> {
    constructor(protected readonly baseUrl: string){}

    get = async (id: string): Promise<T> => {
        return client.get<T>(`${this.baseUrl}/${id}`);
    }
    
    getAll = async (delay?: number): Promise<T[]> => {
        return client.get<T[]>(this.baseUrl, delay);
    }

    add = async (data: T): Promise<T> => {
        return client.post<T>(this.baseUrl, data); 
    }

    edit = async (data: T): Promise<T> => {
        return client.put<T>(`${this.baseUrl}/${data.id}`, data);
    }

    delete = async (id: string): Promise<T> => {
        return client.delete<T>(`${this.baseUrl}/${id}`);
    }
}