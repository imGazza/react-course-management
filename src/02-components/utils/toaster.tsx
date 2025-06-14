import { toast } from "sonner";

class Toaster {

	successToast = (message: string) => {
		toast.success(message);
	}

	warnToast = (message: string) => {
		toast.warning(message);
	}

	errorToast = (message: string) => {
		toast.error(message);
	}
}
export const toaster = new Toaster();
