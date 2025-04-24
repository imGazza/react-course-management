import { Course } from "@/model/Course";
import CourseDetailCards from "./course-detail-cards";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { deleteCourse, editCourse, getCourse } from "@/http/course";
import { AreThereDifferences } from "../utils/course/course-utils";
import CourseDetailMaterial from "./course-detail-material";

const CourseDetail = () => { 

  return (
    <>      
      <CourseDetailCards />
      <CourseDetailMaterial  />
    </>
  )
}
export default CourseDetail;