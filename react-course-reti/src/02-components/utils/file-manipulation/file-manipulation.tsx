import { ChangeEvent } from "react";

// Avatar

// Crea un URL temporaneo per visualizzare l'anteprima dell'immagine caricata
export const uploadPreviewDisplay = async (
		event: ChangeEvent<HTMLInputElement>, 
		setAvatarFn: React.Dispatch<React.SetStateAction<File | null>>,
		setPreviewUrlFn: React.Dispatch<React.SetStateAction<string | null>>
	) => {
	const file = event.target.files?.[0];
	if (file) {
		const compressedFile = await compressImage(file);
		const reader = new FileReader();
		reader.onloadend = () => {
			setAvatarFn(compressedFile);
			setPreviewUrlFn(reader.result as string);
		};
		reader.readAsDataURL(compressedFile);
	}
}

// Compressione dell'immagine mantenendo l'aspect ratio e una massima dimensione di 800x800px
export const compressImage = (file: File): Promise<File> => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (event) => {
			const img = new Image();
			img.src = event.target?.result as string;
			img.onload = () => {
				const canvas = document.createElement('canvas');
				const MAX_WIDTH = 800;
				const MAX_HEIGHT = 800;
				let width = img.width;
				let height = img.height;

				if (width > height) {
					if (width > MAX_WIDTH) {
						height *= MAX_WIDTH / width;
						width = MAX_WIDTH;
					}
				} else if (height > MAX_HEIGHT) {
					width *= MAX_HEIGHT / height;
					height = MAX_HEIGHT;
				}

				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext('2d');
				ctx?.drawImage(img, 0, 0, width, height);

				canvas.toBlob(
					(blob) => {
						if (blob) {
							const compressedFile = new File([blob], file.name, {
								type: 'image/jpeg',
								lastModified: Date.now(),
							});
							resolve(compressedFile);
						}
					},
					'image/jpeg',
					0.7
				);
			};
		};
	});
};