import { useMemo, useState } from "react";
import { BreadcrumbContext } from "./breadcrumb-context";

interface BreadcrumbProviderProps  {
    children: React.ReactNode;
}

function BreadcrumbProvider({ children }: BreadcrumbProviderProps) {
    
    const [breadcrumbs, setBreadcrumbs] = useState<{ label: string, url: string }[]>([]);

    const setPageBreadcrumb = (breadcrums: { label: string, url: string }[]) => {
        setBreadcrumbs(breadcrums);
    }

    const value = useMemo(
        () => {
            return {
                breadcrumbs: breadcrumbs,
                setBreadcrumbs: setPageBreadcrumb
            }
    },[breadcrumbs])

    return (
        <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>
    )
}
export default BreadcrumbProvider;