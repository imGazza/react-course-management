import { FileText, Book, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Course } from "@/model/Course";
import { useEffect, useState } from "react";
import { Material } from "@/model/Material";
import { getMaterialsForCourse } from "@/http/material";

interface CourseDetailMaterialProps {
  courseId: string;
}

const CourseDetailMaterial = ({ courseId }: CourseDetailMaterialProps) => {

  const [loading, setLoading] = useState(false);
  const [materialsData, setMaterialsData] = useState<Material[]>([])

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const materials = await getMaterialsForCourse(courseId);
        console.log(materials);
        setMaterialsData(materials);
      } catch (e) {

      } finally {
        setLoading(false);
      }      
    };
    fetchMaterials();
  }, [])

  return (
    <div className="grid grid-cols-1 @xl/main:grid-cols-4 gap-4 px-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="col-span-1 lg:col-span-2 min-h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Materiale
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            {materialsData.map((material) => (
              <div key={material.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <Book className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{material.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      8 MB • Caricato il {new Date(material.uploadDate).toLocaleDateString('it-IT')}
                      {/* TODO: Aggiunti la dimensione file */}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload New Material
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
export default CourseDetailMaterial;