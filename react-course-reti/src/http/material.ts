import { httpClient } from "./client";
import { Material } from "@/model/Material";

const BASE_URL = "materials"

export const getMaterialsForCourse = async (courseId: string): Promise<Material[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const params = "?courseId=" + courseId;

    const materials = await httpClient.get(BASE_URL + params);

    return materials.data;
}