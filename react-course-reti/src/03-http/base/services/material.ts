import { Material } from "@/05-model/Material";
import { get, post, del } from "../client";
import { BaseService } from "../base-service";

class MaterialService extends BaseService<Material> {
    constructor() {
        super("materials")
    } 

    async getMaterialsByCourseId(courseId: string): Promise<Material[]> {
        return await get<Material[]>(`${this.baseUrl}?courseId=${courseId}`);
    }
}
export const materialService = new MaterialService();