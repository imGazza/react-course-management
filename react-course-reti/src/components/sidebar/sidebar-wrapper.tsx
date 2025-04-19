import { Separator } from "@radix-ui/react-separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb"
import { useLocation } from "react-router"
import { navigationTitles } from "@/routing/routes"
import React from "react"

interface SidebarWrapperProps {
  children: React.ReactNode
}

const SidebarWrapper = ({ children }: SidebarWrapperProps) => {

    const location = useLocation()

    // Splitting url routes
    const pageRoutesTree = location.pathname.split("/"); // e.g. /admin/create -> ['', 'admin', 'create']
    // Slice the first element because it's an empty string, then build an array with all the titles of the current route 
    const pageTitles = pageRoutesTree.slice(1).map(item => navigationTitles[item]); // e.g. ['Admin Dashboard', 'Create']

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                {pageTitles.map((title, index) => (
                                    <React.Fragment key={index}>
                                        <BreadcrumbItem className="hidden md:block">
                                            {/*                                             
                                                For every breadcrumb item the href value is assigned building the route until the item route 
                                                +2: one because index is zero based and one because slice does not include the end element
                                                e.g. pageRoutesTree = ['', 'admin', 'create']
                                                e.g. first element is Admin Dashboard: index = 0[+2] - ['', 'admin'] - '/admin'
                                                e.g. second element is Create: index = 1[+2] - ['', 'admin', 'create'] - '/admin/create'
                                             */}
                                            <BreadcrumbLink href={pageRoutesTree.slice(0, index+2).join("/")}>
                                                {title}
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
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
export default SidebarWrapper