import AuthProvider from "@/06-providers/auth/auth-provider";
import { ThemeProvider } from "@/06-providers/theme/theme-provider";
import MainWrapper from "./main-wrapper";
import BreadcrumbProvider from "@/06-providers/breadcrumb/breadcrumb-provider";
import { Toaster } from "sonner";

const Root = () => {

	return (
		<AuthProvider>
			<ThemeProvider>
				<BreadcrumbProvider>
					<Toaster richColors />
					<MainWrapper />
				</BreadcrumbProvider>
			</ThemeProvider>
		</AuthProvider>
	)
}
export default Root;


//TODO: Popola dati
//TODO: Controlla il tema in tutte le pagine e il responsive
//TODO: Indaga ErrorBoundary
//TODO: Pagina di unauthrized e 404
//TODO: Rifare la parte degli oggetti delle chiamate