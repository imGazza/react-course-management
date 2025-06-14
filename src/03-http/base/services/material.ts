import { Material } from "@/05-model/base/Material";
import client from "../client";
import { BaseService } from "../base-service";

class MaterialService extends BaseService<Material> {
    constructor() {
        super("materials")
    } 

    getMaterialsByCourseId = async (courseId: string): Promise<Material[]> => {
        return await client.get<Material[]>(`${this.baseUrl}?courseId=${courseId}`);
    }

    deleteMaterial = async (material: Material): Promise<void> => {
        await client.delete<Material>(`${this.baseUrl}/${material.id}`);
    }
}
export const materialService = new MaterialService();