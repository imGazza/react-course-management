import { Separator } from "@/02-components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/02-components/ui/sidebar"
import AppSidebar from "./sidebar/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/02-components/ui/breadcrumb"
import { Link, Outlet } from "react-router"
import React, { useContext } from "react"
import MainContent from "./main-content"
import { BreadcrumbContext } from "@/06-providers/breadcrumb/breadcrumb-context"

const MainWrapper = () => {

	const { breadcrumbs } = useContext(BreadcrumbContext);

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
											<BreadcrumbLink asChild>
												<Link to={url}>
													{label}
												</Link>
											</BreadcrumbLink>
										</BreadcrumbItem>
										{index !== breadcrumbs.length - 1 && (
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