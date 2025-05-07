import { createContext } from "react"

export const  BreadcrumbContext = createContext<{
    breadcrumbs: { label: string, url: string }[],
    setBreadcrumbs: (breadcrumbs: { label: string, url: string }[]) => void
}>({
    breadcrumbs: [],
    setBreadcrumbs: () => {} 
})