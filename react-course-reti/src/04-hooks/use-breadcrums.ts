import { BreadcrumbContext } from "@/06-providers/breadcrumb/breadcrumb-context";
import { useContext, useEffect } from "react";

const useBreadcrumbs = (breadcrums: { label: string, url: string }[]) => {

    const { setBreadcrumbs } = useContext(BreadcrumbContext);

    useEffect(() => {
        setBreadcrumbs(breadcrums);
    }, []);
    
}
export default useBreadcrumbs;