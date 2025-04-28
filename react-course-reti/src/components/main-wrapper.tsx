import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./sidebar/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Outlet, useLocation } from "react-router"
import { navigationTitles } from "@/routing/routes"
import React, { useContext } from "react"
import MainContent from "./main-content"
import { BreadcrumbContext } from "@/providers/breadcrumb/breadcrumb-context"

const MainWrapper = () => {

    const location = useLocation();
    const { breadcrumbs } = useContext(BreadcrumbContext);

    // Splitting url routes
    const pageRoutesTree = location.pathname.split("/"); // e.g. /admin/create -> ['', 'admin', 'create']
    // Slice the first element because it's an empty string, then build an array with all the titles of the current route 
    const pageTitles = pageRoutesTree.slice(1).map((item) => navigationTitles[item]); // e.g. ['Admin Dashboard', 'Create']
    //TODO: transform this into a context

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mx-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbs.map(({ label, url }, index) => (
                                    <React.Fragment key={index}>
                                        <BreadcrumbItem className="hidden md:block">                                            
                                            <BreadcrumbLink href={url}>
                                                {label}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        {index !== pageTitles.length - 1 && (
                                            <BreadcrumbSeparator className="hidden md:block" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <MainContent>
                    <Outlet />
                </MainContent>                
            </SidebarInset>
        </SidebarProvider>
    )
}
export default MainWrapper