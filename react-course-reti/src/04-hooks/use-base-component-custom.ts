import { BaseEntity } from "@/05-model/BaseEntity";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BaseComponentProps } from "./use-base-component";

interface BaseComponentCustomProps<
	T extends BaseEntity,
	U extends { [P in K]: T | null },
	K extends keyof U & string,
	Z
> extends BaseComponentProps<T, Z> {
	entityKey: K; // stringa specificata dal chiamante che indica il nome della proprietà T che verrà modificata a DB dalle CRUD
	defaultEmptyItem?: unknown
}

/**
 * Custom hook per eseguire operazioni CRUD sui componenti
 * @template T - Tipo base dell'entità che finisce a DB
 * @template U - Tipo personalizzato più ampio che contiene almeno un campo di tipo T
 * @template K - Key in U che rappresenta la proprietà di tipo T all'interno di U
 * @template Z - Tipo generico specificato per poter gestire diversi tipi di T (singola entità o array, necessario per far star tranquillo Typescript)
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

	const queryClient = useQueryClient();

	const query = useQuery<Z>({
		queryKey: queryKey,
		queryFn: fetch,
		refetchOnWindowFocus: false,
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

	// Override delle mutation dell'hook base
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
			if (prev)
				// Necessario aggiungere in input un defaultEmptyItem per inizializzare tutte le altre proprietà di U
				// nella proprietà entityKey aggiungo il nuovo elemento (esempio T = Course, entityKey = course, added = Course)
				return [...prev, { ...defaultEmptyItem as U, [entityKey]: added }];
		});
	};

	// Se arrivo da array, devo trovare l'elemento e sostituirlo, altrimenti se è un singolo elemento, basta sostituirlo
	const editQueryData = (queryClient: QueryClient, edited: T) => {
		queryClient.setQueryData(queryKey, (prev: U[] | U) => {
			if (Array.isArray(prev)) {
				// Se array ricavo l'elemento vecchio e stostituisco
				return prev.map(item => {
					const entity = getEntity(item);
					if (entity!.id === edited.id) {
						return updateEntity(item, edited);
					}
					return item;
				});
			} else {
				// Se singolo, controllo se è quello che devo modificare e lo sostituisco
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

	const isLoading = query.isLoading || addMutation.isPending || editMutation.isPending || deleteMutation.isPending;

	const refetch = () => {
		queryClient.invalidateQueries({ queryKey: queryKey });
	};

	const remove = (queryKey: unknown[]) => {
		queryClient.removeQueries({ queryKey: queryKey });
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

export default useBaseComponentCustom;