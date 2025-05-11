import { Material } from "@/05-model/Material";
import { ChangeEvent } from "react";
import { GenerateId } from "@/05-model/BaseEntity";
import { IsFileSizeValid } from "../file-manipulation/file-manipulation";

const TO_MB_DIVIDER = 1024 * 1024;
const ACCEPTED_MATERIAL_FILE_EXTENSIONS = ['pdf', 'ppt', 'pptx', 'txt', 'mp4'];
const MATERIALS_BASE_URL = "http://localhost:3001/api/material";

export const SaveAndGetMaterial = async (event: ChangeEvent<HTMLInputElement>, courseId: string) => {
	const file = event.target.files?.[0];
	if (!file) throw new Error('Non è stato selezionato nessun file');
	if (!IsFileSizeValid(file)) throw new Error('Dimensione file superiore a 10MB');

	const fileExtension = file.name.split('.').pop()?.toLowerCase();
	if (!ACCEPTED_MATERIAL_FILE_EXTENSIONS.includes(fileExtension!)) throw new Error('Estensione file non supportata');

	const formData = new FormData();
	formData.append("material", file);

	try {
		const response = await fetch(`${MATERIALS_BASE_URL}/upload`, {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			throw new Error('Upload del file fallito');
		}

		const { fileName } = await response.json();

		const material: Material = {
			id: GenerateId(),
			name: file.name,
			courseId: courseId,
			uploadDate: new Date().toISOString(),
			size: file.size,
			fileName: fileName
		};

		return material;
	} catch {
		throw new Error('Upload del file fallito');
	}
}

export const DownloadMaterial = async (material: Material) => {
	try {
		const response = await fetch(`${MATERIALS_BASE_URL}/download/${material.fileName}`);

		if (!response.ok) {
			throw new Error('Download del file fallito');
		}

		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = material.name;
		document.body.appendChild(link);

		link.click();

		window.URL.revokeObjectURL(url);
		document.body.removeChild(link);
	} catch {
		throw new Error('Download del file fallito');
	}
}

export const DeleteMaterial = async (material: Material) => {
	try {
	   const response = await fetch(`${MATERIALS_BASE_URL}/delete/${material.fileName}`, {
		   method: 'DELETE'
	   });

	   if (!response.ok) {
		   throw new Error('Eliminazione del file fallita');
	   }

	   return true;
	} catch {
		throw new Error('Eliminazione del file fallita'); 
	}
}

export const GetFileSizeInMB = (fileSize: number) => {
	return (fileSize / TO_MB_DIVIDER).toFixed(1);
}