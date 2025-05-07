import { BaseEntity } from "./BaseEntity";

export interface Lesson extends BaseEntity{
    name: string;
    courseId: string;
    lessonDate: string;
  }