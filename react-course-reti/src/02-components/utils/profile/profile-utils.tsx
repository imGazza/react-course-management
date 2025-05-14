import { NoFileSelectedError } from "@/01-features/shared/errors/custom-exceptions/no-file-selected";
import { IsFileSizeValid } from "../file-manipulation/file-manipulation";
import { FileTooBigError } from "@/01-features/shared/errors/custom-exceptions/file-too-big";
import { FileNotAcceptedError } from "@/01-features/shared/errors/custom-exceptions/file-not-accepted";

const ACCEPTED_AVATAR_FILE_EXTENSIONS = ['png', 'jpg', 'jpeg'];
const AVATAR_BASE_URL = "http://localhost:3001/api/avatar";

export const SaveAndGetAvatarFileName = async (file: File) => {
	if (!file) throw new NoFileSelectedError();
	if (!IsFileSizeValid(file)) throw new FileTooBigError();

	const fileExtension = file.name.split('.').pop()?.toLowerCase();
	if (!ACCEPTED_AVATAR_FILE_EXTENSIONS.includes(fileExtension!)) throw new FileNotAcceptedError();

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