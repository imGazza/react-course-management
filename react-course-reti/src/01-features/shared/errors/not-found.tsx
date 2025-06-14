import { Button } from "@/02-components/ui/button"
import { ThemeProvider } from "@/06-providers/theme/theme-provider"
import { AlertCircle } from "lucide-react"
import { Link } from "react-router"

const NotFound = () => {
	return (
		<ThemeProvider>
			<div className="min-h-screen flex flex-col items-center justify-center p-4">
				<div className="text-center max-w-md w-full">
					<div className="mb-6 flex items-center justify-center gap-2 bg-red-100 dark:bg-red-950/30 p-3 rounded-lg border border-red-200 dark:border-red-800">
						<AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
						<span className="text-2xl font-bold text-red-600 dark:text-red-400">404 - Pagina non trovata</span>
					</div>
					<img 
						src="/errors-images/k-on-404.png" 
						alt="404 Not Found" 
						className="mx-auto max-w-full max-h-[50vh] object-contain"
					/>
					<div className="">
						<Link to="/" className="block">
							<Button
								variant="outline"
								className="w-full h-16 text-lg font-medium transition-all hover:bg-primary hover:text-primary-foreground border-2 flex items-center justify-center gap-2"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
								Ritrova la strada
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</ThemeProvider>
	)
}
export default NotFound