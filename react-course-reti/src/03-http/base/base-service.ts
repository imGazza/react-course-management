import { BaseEntity } from "@/05-model/BaseEntity";
import { del, get, post, put } from "./client";

export class BaseService<T extends BaseEntity> {
    constructor(protected readonly baseUrl: string){}

    async get(id: string): Promise<T> {
        return get<T>(`${this.baseUrl}/${id}`);
    }
    
    async getAll(delay?: number): Promise<T[]> {
        return get<T[]>(this.baseUrl, delay);
    }

    async add(data: T): Promise<T> {
        return post<T>(this.baseUrl, data); 
    }

    async edit(data: T): Promise<T> {
        return put<T>(`${this.baseUrl}/${data.id}`, data);
    }

    async delete(id: string): Promise<T> {
        return del<T>(`${this.baseUrl}/${id}`);
    }
}