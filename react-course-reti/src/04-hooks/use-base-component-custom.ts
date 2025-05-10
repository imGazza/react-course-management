import { BaseEntity } from "@/05-model/BaseEntity";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BaseComponentProps } from "./use-base-component";

interface BaseComponentCustomProps<
	T extends BaseEntity,
	U extends { [P in K]: T | null },
	K extends keyof U & string,
	Z
> extends BaseComponentProps<T, Z> {
	queryKey: readonly unknown[];
	fetch: () => Promise<Z>;
	add?: (data: T) => Promise<T>;
	edit?: (data: T) => Promise<T>;
	del?: (id: string) => Promise<T>;
	entityKey: K; // stringa specificata dal chiamante che indica il nome della proprietà T che verrà modificata a DB dalle CRUD
	defaultEmptyItem?: unknown
}

/**
 * A custom hook for handling CRUD operations with React Query
 * @template T - Type of the base entity for mutations
 * @template U - Type of the item that contains entity T as a property
 * @template K - Key in U that represents where the entity is stored
 * @template Z - 
 * 
 **/
const useBaseComponentCustom = <
	T extends BaseEntity,
	U extends { [P in K]: T | null },
	K extends keyof U & string,
	Z
>({
	queryKey,
	fetch,
	add,
	edit,
	del,
	entityKey,
	defaultEmptyItem
}: BaseComponentCustomProps<T, U, K, Z>) => {

	//TODO: Aggiungi gestione errori
	const queryClient = useQueryClient();

	const query = useQuery<Z>({
		queryKey: queryKey,
		queryFn: fetch,
	});

	// Estrae l'entità T dall'oggetto U
	const getEntity = (item: U): T | null => {
		// Verifica che T e U siano tipi diversi
		if (Object.keys(item).length > 1) {
			// Se U ha più proprietà di T, sono tipi diversi
			return item[entityKey];
		}
		// Se sono lo stesso tipo, restituisce l'item come T
		return item as unknown as T;
	};

	const updateEntity = (item: U, entity: T): U => {
		// Verifica che T e U siano tipi diversi
		if (Object.keys(item).length > 1) {
			// Se U ha più proprietà di T, sono tipi diversi
			return { ...item, [entityKey]: entity };
		}
		// Se sono lo stesso tipo, restituisce l'entity come U
		return entity as unknown as U;
	};

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
		queryClient.setQueryData(queryKey, (prev: U[]) => {
			console.log([...prev, { ...defaultEmptyItem as U, [entityKey]: added }]);
			return [...prev, { ...defaultEmptyItem as U, [entityKey]: added }];
		});
	};

	// Se arrivo da array, devo trovare l'elemento e sostituirlo, altrimenti se è un singolo elemento, basta sostituirlo
	const editQueryData = (queryClient: QueryClient, edited: T) => {
		queryClient.setQueryData(queryKey, (prev: U[] | U) => {
			if (Array.isArray(prev)) {
				return prev.map(item => {
					const entity = getEntity(item);
					if (entity!.id === edited.id) {
						return updateEntity(item, edited);
					}
					return item;
				});
			} else {
				const entity = getEntity(prev);
				if (entity!.id === edited.id) {
					return updateEntity(prev, edited);
				}
				return prev;
			}
		});
	};

	// Se arrivo da array, rimuovo l'element, altrimenti non restituisco nulla, sto cancellando l'entità stessa
	const deleteQueryData = (queryClient: QueryClient, id: string) => {
		queryClient.setQueryData(queryKey, (prev: U[] | U | undefined) => {
			if (!prev) return prev;

			if (Array.isArray(prev)) {
				return prev.filter(item => getEntity(item)!.id !== id);
			} else {
				return getEntity(prev)!.id === id ? null : prev;
			}
		});
	};

	const isLoading = query.isLoading ||
		addMutation.isPending ||
		editMutation.isPending ||
		deleteMutation.isPending;

	const refetch = () => {
		queryClient.invalidateQueries({ queryKey: queryKey });
	};

	const remove = (queryKey: unknown[]) => {
		queryClient.removeQueries({ queryKey: queryKey });
	}

	if(query.error)
		console.log(query.error);

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
export default useBaseComponentCustom;