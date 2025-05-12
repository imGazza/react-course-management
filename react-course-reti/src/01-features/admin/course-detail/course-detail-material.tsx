import { FileText, Book, Upload, Download, Trash2 } from "lucide-react";
import { Button } from "@/02-components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/02-components/ui/card";
import { ChangeEvent, useRef } from "react";
import { Material } from "@/05-model/Material";
import { Skeleton } from "@/02-components/ui/skeleton";
import { useParams } from "react-router";
import { DeleteMaterial, DownloadMaterial, GetFileSizeInMB, SaveAndGetMaterial } from "@/02-components/utils/course/course-utils";
import { ScrollArea } from "@/02-components/ui/scroll-area";
import useBaseComponent from "@/04-hooks/use-base-component";
import { materialService } from "@/03-http/base/services/material";
import { createSkeletonArray, skeletonUniqueId } from "@/02-components/utils/misc";
import { ErrorMessage } from "@/02-components/utils/error-messages";
import { toaster } from "@/02-components/utils/toaster";

const CourseDetailMaterial = () => {
  const { courseId } = useParams();
  const fileInput = useRef<HTMLInputElement>(null);

  const { query: { data: materials = [] }, onAdd, onDelete, isLoading } = useBaseComponent<Material, Material[]>({
    queryKey: ["materials", courseId!],
    fetch: () => materialService.getMaterialsByCourseId(courseId!),
    add: materialService.add,
    del: materialService.delete    
  });

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const material = await SaveAndGetMaterial(event, courseId!);
      if (!material) return;

      onAdd(material);
    } catch {
      toaster.errorToast(ErrorMessage.UPLOAD_FILE)
    }    
  }

  const handleFileDownload = async (material: Material) => {
    try {
      await DownloadMaterial(material);
    } catch {
      toaster.errorToast(ErrorMessage.DOWNLOAD_FILE)
    }
  }

  const handleFileDelete = async (material: Material) => {
    try {
      await DeleteMaterial(material);
      onDelete(material.id);
    } catch {
      toaster.errorToast(ErrorMessage.DELETE_FILE)
    }    
  }

  if (isLoading)
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
          {createSkeletonArray(3).map(() => (
            <div key={skeletonUniqueId()} className="flex items-center justify-between p-3 border rounded-md">
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