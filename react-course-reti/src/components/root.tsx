import AuthProvider from "@/providers/auth/auth-provider";
import { ThemeProvider } from "@/providers/theme/theme-provider";
import MainWrapper from "./main-wrapper";
import BreadcrumbProvider from "@/providers/breadcrumb/breadcrumb-provider";

const Root = () => {
    return (
        <>
            <AuthProvider>
                <ThemeProvider>
                    <BreadcrumbProvider>
                        <MainWrapper />
                    </BreadcrumbProvider>
                </ThemeProvider>
            </AuthProvider>
        </>
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