import AuthProvider from "@/06-providers/auth/auth-provider";
import { ThemeProvider } from "@/06-providers/theme/theme-provider";
import MainWrapper from "./main-wrapper";
import BreadcrumbProvider from "@/06-providers/breadcrumb/breadcrumb-provider";

const Root = () => {

	return (
		<AuthProvider>
			<ThemeProvider>
				<BreadcrumbProvider>
					<MainWrapper />
				</BreadcrumbProvider>
			</ThemeProvider>
		</AuthProvider>
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
//TODO: Alla cancellazione di un corso, eliminare i subscribers
//TODO: Non permettere doppioni nei subscribes
//TODO: Capire se vuoi fixare le immagini del corso
//TODO: Check se da qualche parte un useEffect può diventare useMemo
//TODO: Interceptor per creazione ID
//TODO: Rinomina tutto in pascal case
//TODO: Crea utility skeleton per evitare l'index negli array