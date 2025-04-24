import { FileText, Book, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Material } from "@/model/Material";
import { addMaterial, getMaterialsForCourse } from "@/http/material";
import { Skeleton } from "../ui/skeleton";
import { useParams } from "react-router";
import { GetFileSizeInMB, SaveFileAndGetMaterial } from "../utils/course/course-utils";

const CourseDetailMaterial = () => {

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const materials = await getMaterialsForCourse(id!);
        setMaterials(materials);
      } catch (e) {

      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, [])

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    //TODO: Gestisci le varie possibili exceptions 
    const material = await SaveFileAndGetMaterial(event, id!);
    if (!material || !materials) {
      return;
    }

    setLoading(true);
    try{      
      const newMaterial = await addMaterial(material);
      setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
    } catch(e){
      //TODO: Error toast
    } finally{
      setLoading(false); 
    }    
  }

  if(materials.length === 0 || loading)
    return <CourseDetailMaterialSkeleton />

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
            {materials.map((material) => (
              <div key={material.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <Book className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{material.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {(GetFileSizeInMB(material.size))} MB • Caricato in data {new Date(material.uploadDate).toLocaleDateString('it-IT')}                      
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
          <input type="file" ref={fileInput} onChange={handleFileChange} className="hidden" accept=".pdf,.ppt,.pptx,.txt" />
          <Button variant="outline" className="w-full" onClick={() => fileInput.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Carica nuovo materiale
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
export default CourseDetailMaterial;

const CourseDetailMaterialSkeleton = () => {
  return (
    <div className="grid grid-cols-1 @xl/main:grid-cols-4 gap-4 px-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="col-span-1 lg:col-span-2 min-h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <div>
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" /> {/* Match Upload button */}
        </CardFooter>
      </Card>
    </div>
  )
}
export { CourseDetailMaterialSkeleton }