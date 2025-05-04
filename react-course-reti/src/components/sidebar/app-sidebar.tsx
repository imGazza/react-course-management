import * as React from "react"
import {
  BookOpen,
  Bot,
  ChartLine,
  Command,
  Frame,
  Library,
  LifeBuoy,
  LogIn,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  SunMoon,
  UserPen,
  Users,
} from "lucide-react"

import NavMain from "@/components/sidebar/nav-main"
import NavSecondary from "@/components/sidebar/nav-secondary"
import NavUser from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { AuthContext } from "@/providers/auth/auth-context"
import { useEffect, useMemo } from "react"
import { Theme, ThemeContext } from "@/providers/theme/theme-context"

var menu = {
  navMainAdmin: [
    {
      title: "Corsi",
      url: "/courses",
      icon: Library,
      isActive: true
    },
    {
      title: "Utenti",
      url: "/users",
      icon: Users,
      isActive: false
    },
    {
      title: "Statistiche",
      url: "/stats",
      icon: ChartLine,
      isActive: false
    }
  ],
  navMainUser: [
    {
      title: "I miei corsi",
      url: "/my-courses",
      icon: Library,
      isActive: true
    },
  ],
  navMainGuest: [
    {
      title: "Login",
      url: "/login",
      icon: LogIn,
      isActive: true
    },
  ]
}

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {  
  
  const { user, removeSessionUser } = React.useContext(AuthContext);
  const { setTheme, theme } = React.useContext(ThemeContext);
  
  const toggleTheme = () => {
    return theme === "dark" ? "light" : "dark";
  }

  const menuSecondary = [    
      {
        title: "Tema",
        onClick: () => setTheme(toggleTheme()),
        icon: SunMoon,
      }
  ]

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Luca Gazzardi</span>
                  <span className="truncate text-xs">Corso React</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={!user ? menu.navMainGuest : user.isAdmin ? menu.navMainAdmin : menu.navMainUser} />
        <NavSecondary items={menuSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} logout={removeSessionUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
export default AppSidebar