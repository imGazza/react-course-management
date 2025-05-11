import { IsFileSizeValid } from "../file-manipulation/file-manipulation";

const ACCEPTED_AVATAR_FILE_EXTENSIONS = ['png', 'jpg', 'jpeg'];
const AVATAR_BASE_URL = "http://localhost:3001/api/avatar";

export const SaveAndGetAvatarFileName = async (file: File) => {
	if (!file) throw new Error('Non è stato selezionato nessun file');
	if (!IsFileSizeValid(file)) throw new Error('Dimensione file superiore a 10MB');

	const fileExtension = file.name.split('.').pop()?.toLowerCase();
	if (!ACCEPTED_AVATAR_FILE_EXTENSIONS.includes(fileExtension!)) throw new Error('Estensione file non supportata');

	const formData = new FormData();
	formData.append("avatar", file);
	try {
		const response = await fetch(`${AVATAR_BASE_URL}/upload`, {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			throw new Error('Upload del file fallito');
		}

		const { fileName } = await response.json();

		return fileName;
	} catch {
		throw new Error('Upload del file fallito');
	}
}