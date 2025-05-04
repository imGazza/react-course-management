import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription, } from "@radix-ui/react-dialog";
import { Book, Download } from "lucide-react";
import { Material } from "@/model/Material";
import { DownloadMaterial, GetFileSizeInMB } from "../course/course-utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MaterialsDialogProps {
	materials: Material[];
	courseName: string
}

const handleFileDownload = async (material: Material) => {
	try {
		await DownloadMaterial(material);
	} catch (e) {
		//Toast che mostra come errore e.message
	}
}

const MaterialsDialog = ({ materials, courseName }: MaterialsDialogProps) => {
	return (
		<DialogContent className="sm:max-w-[450px]">
			<DialogHeader>
				<DialogTitle>{courseName}</DialogTitle>
			</DialogHeader>
			<DialogDescription className="mb-6">
				Materiali scaricabili per il corso.
			</DialogDescription>
			{materials.length === 0 ? (
				<div className="flex items-center justify-center gap-2 p-3 border rounded-md">
					<p className="text-sm text-muted-foreground">
						Nessun materiale disponibile.
					</p>
				</div>
			)
				:
				<ScrollArea className="h-100">
					<div className="flex flex-col gap-4">
						{
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
									</div>
								</div>
							))
						}
					</div>
				</ScrollArea>
			}
		</DialogContent>
	)
}
export default MaterialsDialog;