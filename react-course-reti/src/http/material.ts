import { httpClient } from "./client";
import { Material } from "@/model/Material";

const BASE_URL = "materials"

export const getCourseMaterials = async (courseId: string): Promise<Material[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const params = "?courseId=" + courseId;

    const materials = await httpClient.get(BASE_URL + params);

    return materials.data;
}
export const addMaterial = async (material: Material): Promise<Material> => {
    const response = await httpClient.post(BASE_URL, material);
    
    return response.data;
}