import { BaseEntity } from "@/05-model/BaseEntity";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface BaseComponentProps<
	T extends BaseEntity, // Entità base per CRUD nelle mutations
    Z = T
> {
	queryKey: readonly unknown[];
	fetch: () => Promise<Z>;
	add?: (data: T) => Promise<T>;
	edit?: (data: T) => Promise<T>;
	del?: (id: string) => Promise<T>;
}

/**
 * Custom hook per eseguire operazioni CRUD sui componenti
 * @template T - Tipo base dell'entità che finisce a DB
 * @template Z - Tipo generico specificato per poter gestire diversi tipi di T (singola entità o array, necessario per far star tranquillo Typescript)
 * 
 **/

const useBaseComponent = <
	T extends BaseEntity,
    Z = T
>({
	queryKey,
	fetch,
	add,
	edit,
	del
}: BaseComponentProps<T, Z>) => {

	//TODO: Aggiungi gestione errori
	const queryClient = useQueryClient();

	const query = useQuery<Z>({
		queryKey: queryKey,
		queryFn: fetch,
		refetchOnWindowFocus: false,
	});

	// Mutations
	const addMutation = useMutation({
		mutationFn: add,
		onSuccess: (added: T) => addQueryData(queryClient, added)
	});

	const editMutation = useMutation({
		mutationFn: edit,
		onSuccess: (edited: T) => editQueryData(queryClient, edited)
	});

	const deleteMutation = useMutation({
		mutationFn: del,
		onSuccess: (_, id: string) => deleteQueryData(queryClient, id)
	});

	// QueryData

    // Se viene fatta un'add, significa che si parte da un array in partenza, quindi aggiungo l'elemento alla fine
	const addQueryData = (queryClient: QueryClient, added: T) => {
		queryClient.setQueryData(queryKey, (prev: T[]) => {
			return [...prev, added];
		});
	};

	// Se arrivo da array, devo trovare l'elemento e sostituirlo, altrimenti se è un singolo elemento, basta sostituirlo
	const editQueryData = (queryClient: QueryClient, edited: T) => {
		queryClient.setQueryData(queryKey, (prev: T[] | T) => {			
            if (Array.isArray(prev))
				return prev.map(item => item.id === edited.id ? edited : item);
			else
				return edited;
		});
	};

	// Se arrivo da array, rimuovo l'element, altrimenti non restituisco nulla, sto cancellando l'entità stessa
	const deleteQueryData = (queryClient: QueryClient, id: string) => {
		queryClient.setQueryData(queryKey, (prev: T[] | T) => {
			if (Array.isArray(prev)) {
				return prev.filter(item => item.id !== id);
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

	// const onError = (error) => {
	// }

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