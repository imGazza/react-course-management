import { BaseEntity } from "./BaseEntity";

export interface Material extends BaseEntity {
  name: string;
  courseId: string;
  uploadDate: string;
  size: number;
  fileName: string;
}