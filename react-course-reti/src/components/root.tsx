import AuthProvider from "@/providers/auth/auth-provider";
import { ThemeProvider } from "@/providers/theme/theme-provider";
import MainWrapper from "./main-wrapper";

const Root = () => {
    return (
        <>
            <AuthProvider>
                <ThemeProvider>
                    <MainWrapper />
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
//TODO: Test test test