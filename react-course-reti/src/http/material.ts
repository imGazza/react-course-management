import { Material } from "@/model/Material";
import { get, post, del } from "./client";

const BASE_URL = "materials"

export const getCourseMaterials = async (courseId: string): Promise<Material[]> => {
    return await get(`${BASE_URL}?courseId=${courseId}`);
}

export const addMaterial = async (material: Material): Promise<Material> => {
    return await post(BASE_URL, material);
}

export const deleteMaterial = async (materialId: string): Promise<void> => {
    return await del(`${BASE_URL}/${materialId}`);
}