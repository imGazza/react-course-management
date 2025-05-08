import AuthProvider from "@/06-providers/auth/auth-provider";
import { ThemeProvider } from "@/06-providers/theme/theme-provider";
import MainWrapper from "./main-wrapper";
import BreadcrumbProvider from "@/06-providers/breadcrumb/breadcrumb-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const Root = () => {

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 5, // 5 minuti
			},
		}
	});

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ThemeProvider>
					<BreadcrumbProvider>
						<MainWrapper />
					</BreadcrumbProvider>
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	)
}
export default Root;

//TODO: Refactora le cartelle
//TODO: Controlla tutti gli error handling
//TODO: Controlla i nomi delle varie variabili e componenti
//TODO: Sostituisci le parti che possono diventare troppo lunghe con ScrollArea
//TODO: Togli tutti gli import non usati
//TODO: Add all toasts
//TODO: Aggiungi commenti
//TODO: Test test test
//TODO: Crea costanti per gli url delle rotte
//TODO: Assicurati che tutte le rotte da proteggere lo siano
//TODO: Metti i vari context in hook custom
//TODO: Sistema la coerenza dei dati
//TODO: Specifica le differenze rispetto alla consegna nel file per far capire
//TODO: Sistema i fetch iniziali
//TODO: Generalizza il dialog base
//TODO: Rinomina le entità con più entità per maggiore chiarezza
//TODO: Aggiungi lazy loading
//TODO: Check di tutte le function estraibili dai component
//TODO: Mettere i fakeDelay nelle api