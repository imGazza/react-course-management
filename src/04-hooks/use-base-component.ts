import { NotFound404Error } from "@/01-features/shared/errors/custom-exceptions/not-found-404";
import { ErrorMessage } from "@/02-components/utils/error-messages";
import { toaster } from "@/02-components/utils/toaster";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface BaseComponentProps<
	T,
	Z = T
> {
	queryKey: readonly unknown[];
	fetch: () => Promise<Z>;
	add?: (data: T) => Promise<T>;
	edit?: (data: T) => Promise<T>;
	del?: (data: T) => Promise<void>;
	equals: (a: T, b: T) => boolean;
}

/**
 * Custom hook per eseguire operazioni CRUD sui componenti
 * @template T - Entità da mandare ai servizi
 * @template Z - Tipo generico specificato per poter gestire diversi tipi di T (singola entità o array, necessario per far star tranquillo Typescript)
 **/

const useBaseComponent = <
	T,
	Z = T
>({
	queryKey,
	fetch,
	add,
	edit,
	del,
	equals
}: BaseComponentProps<T, Z>) => {
	const queryClient = useQueryClient();

	const query = useQuery<Z>({
		queryKey: queryKey,
		queryFn: fetch,
		refetchOnWindowFocus: false,
		throwOnError: true,
		// Non eseguo retry, tanto il server è demo, se non va la prima richiesta non vanno nemmeno i retry
		retry: false
	});

	// Mutations
	const addMutation = useMutation({
		mutationFn: add,
		onSuccess: (added: T) => addQueryData(queryClient, added),
		onError: () => onError(ErrorMessage.ADD_ERROR)
	});

	const editMutation = useMutation({
		mutationFn: edit,
		onSuccess: (edited: T) => editQueryData(queryClient, edited),
		onError: () => onError(ErrorMessage.EDIT_ERROR)
	});

	const deleteMutation = useMutation({
		mutationFn: del,
		onSuccess: (_, deleted: T) => deleteQueryData(queryClient, deleted),
		onError: () => onError(ErrorMessage.DELETE_ERROR)
	});

	// QueryData

	// Se viene fatta un'add, significa che si parte da un array in partenza, quindi aggiungo l'elemento alla fine
	const addQueryData = (queryClient: QueryClient, added: T) => {
		queryClient.setQueryData(queryKey, (prev: T[]) => {
			if (prev)
				return [...prev, added];
		});
	};

	// Se arrivo da array, devo trovare l'elemento e sostituirlo, altrimenti se è un singolo elemento, basta sostituirlo
	const editQueryData = (queryClient: QueryClient, edited: T) => {
		queryClient.setQueryData(queryKey, (prev: T[] | T) => {
			if (Array.isArray(prev))
				return prev.map(item => equals(item, edited) ? edited : item);
			else
				return edited;
		});
	};

	// Se arrivo da array, rimuovo l'element, altrimenti non restituisco nulla, sto cancellando l'entità stessa
	const deleteQueryData = (queryClient: QueryClient, deleted: T) => {
		queryClient.setQueryData(queryKey, (prev: T[] | T) => {
			if (Array.isArray(prev)) {
				return prev.filter(item => !equals(item, deleted));
			} else {
				return prev;
			}
		});
	};

	const isLoading = query.isLoading || addMutation.isPending || editMutation.isPending || deleteMutation.isPending;

	const refetch = () => {
		queryClient.invalidateQueries({ queryKey: queryKey });
	};

	const remove = (queryKey: unknown[]) => {
		queryClient.removeQueries({ queryKey: queryKey });
	}

	const onError = (error: string) => {
		toaster.errorToast(error);
	}

	return {
		query,
		onAdd: addMutation.mutateAsync,
		onEdit: editMutation.mutateAsync,
		onDelete: deleteMutation.mutateAsync,
		isLoading,
		refetch,
		remove
	};
};

export default useBaseComponent;