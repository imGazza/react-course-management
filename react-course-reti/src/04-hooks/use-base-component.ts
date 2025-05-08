import { BaseEntity } from "@/05-model/BaseEntity";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface BaseComponentProps<T extends BaseEntity, U extends T, Z = U[] | U> {
	queryKey: readonly unknown[];
	fetch: () => Promise<Z>;
	add?: (data: T) => Promise<T>;
	edit?: (data: T) => Promise<T>;
	del?: (id: string) => Promise<void>;
	relations?: { key: string };
}

/**
 * A custom hook for handling CRUD operations with React Query
 * @template T - Type of the base entity
 * @template U - Type of the entity expanded with entity relations. Same as T if no relations are defined
 * @template Z - Return type for fetch operation (defaults to U[] | U)
 **/
const useBaseComponent = <T extends BaseEntity, U extends T, Z = U[] | U>({
	queryKey,
	fetch,
	add,
	edit,
	del,
	relations
}: BaseComponentProps<T, U, Z>) => {

	//TODO: Aggiungi gestione errori

	const queryClient = useQueryClient();

	const query = useQuery<Z>({
		queryKey: [queryKey],
		queryFn: fetch
	})

	// Mutations

	const addMutation = useMutation({
		mutationFn: add,
		onSuccess: (added: T) => addQueryData(queryClient, added)
	})

	const editMutation = useMutation({
		mutationFn: edit,
		onSuccess: (edited: T) => editQueryData(queryClient, edited)
	})

	const deleteMutation = useMutation({
		mutationFn: del,
		onSuccess: (_, id: string) => deleteQueryData(queryClient, id)
	})

	// QueryData

	// Ritorna l'oggetto ampliato delle relation (es. array vuoto di subscribers per CourseSubscribers)
	const addQueryData = (queryClient: QueryClient, added: T) => {
		queryClient.setQueryData([queryKey], (prev: U[]) => {
			return [...prev, relations ? { ...added, [relations.key]: [] } : added as U];
		});
	}

	// Se Array va a sostituire l'oggetto con quello modificato con le relazioni precedenti
	// Se oggetto singolo, aggiorna l'oggetto precedente tenendo le relazioni precedenti
	const editQueryData = (queryClient: QueryClient, edited: T) => {
		queryClient.setQueryData([queryKey], (prev: U[] | U) => {
			if (Array.isArray(prev))
				return prev
				.map(item => item.id === edited.id ?
					{ ...prev.find(p => p.id === edited.id), ...edited  } as U
					: item);
			else
				return {...edited,...prev} as U;
			
		});
	}

	// Se Array va a rimuovere l'oggetto con quell'id
	// Se oggetto singolo, ritorna null come nuovo valore
	const deleteQueryData = (queryClient: QueryClient, id: string) => {
		queryClient.setQueryData([queryKey], (prev: U[] | U) => {
			if (Array.isArray(prev))
				return prev.filter(item => item.id!== id);
			else
				return null;
		});
	}

	const isLoading = query.isLoading ||
		addMutation.isPending ||
		editMutation.isPending ||
		deleteMutation.isPending;

	const refetch = () => {
		queryClient.invalidateQueries({ queryKey: [queryKey] });
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
	}
}
export default useBaseComponent;