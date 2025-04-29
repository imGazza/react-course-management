import { FileText, Book, Upload, Download, Trash2, Delete } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Material } from "@/model/Material";
import { addMaterial, deleteMaterial, getCourseMaterials } from "@/http/material";
import { Skeleton } from "../ui/skeleton";
import { useParams } from "react-router";
import { DeleteMaterial, DownloadMaterial, FetchInitialData, GetFileSizeInMB, SaveFileAndGetMaterial } from "../utils/course/course-utils";
import { ScrollArea } from "../ui/scroll-area";
import { de } from "date-fns/locale";

const CourseDetailMaterial = () => {

  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      await FetchInitialData<Material[], string>(setLoading, setMaterials, getCourseMaterials, courseId!);
    };
    fetchMaterials();
  }, [])

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const material = await SaveFileAndGetMaterial(event, courseId!);
      if (!material || !materials) {
        return;
      }

      setLoading(true);

      const newMaterial = await addMaterial(material);
      setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
    } catch (e) {
      //Toast che mostra come errore e.message
    } finally {
      setLoading(false);
    }
  }

  const handleFileDownload = async (material: Material) => {
    try {
      await DownloadMaterial(material);
    } catch (e) {
      //Toast che mostra come errore e.message
    }
  }

  const handleFileDelete = async (material: Material) => {
    try{
      await DeleteMaterial(material);

      setLoading(true);
      await deleteMaterial(material.id);
      setMaterials((prevMaterials) => prevMaterials.filter((m) => m.id !== material.id));
    } catch (e) {
      //Toast che mostra come errore e.message 
    } finally {
      setLoading(false); 
    }
  }

  if (loading)
    return <CourseDetailMaterialSkeleton />

  return (
    <Card className="col-span-1 sm:col-span-2 min-h-[405px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Materiale
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-[245px]">
          <div className="space-y-4">
            {
              materials.length !== 0 ?

              materials.map((material) => (
                <div key={material.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <Book className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{material.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(GetFileSizeInMB(material.size))} MB • Caricato in data {new Date(material.uploadDate).toLocaleDateString('it-IT')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button variant="ghost" size="icon" onClick={() => handleFileDownload(material)}>
                      <Download />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleFileDelete(material)}>
                      <Trash2 />
                    </Button>
                  </div>                  
                </div>
              ))

              :
              
              <div className="space-y-4 text-center">
                Non ci sono materiali caricati per questo corso.
              </div>
            }
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <input type="file" ref={fileInput} onChange={handleFileUpload} className="hidden" accept=".pdf,.ppt,.pptx,.txt" />
        <Button variant="outline" className="w-full" onClick={() => fileInput.current?.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Carica nuovo materiale
        </Button>
      </CardFooter>
    </Card>
  )
}
export default CourseDetailMaterial;

const CourseDetailMaterialSkeleton = () => {
  return (
    <Card className="col-span-1 sm:col-span-2 min-h-[405px] flex flex-col">
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
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  )
}
export { CourseDetailMaterialSkeleton }