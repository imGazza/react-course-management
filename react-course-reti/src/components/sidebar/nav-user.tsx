import {
  ChevronsUpDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  UserPen,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { User } from "@/model/User"
import { Link } from "react-router"
import { cn } from "@/lib/utils"

interface NavUserProps {
  user: User | null,
  logout: () => void,
}

const NavUser = ({ user, logout }: NavUserProps) => {
  const { isMobile } = useSidebar()  
  
  const UserInfo = () => {
    if (user){
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn("cursor-pointer", "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground")}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={`/avatars/${user.avatar}`} alt={`${user.firstName} ${user.lastName}`} className="object-cover" />
                <AvatarFallback className="rounded-lg">{`${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{`${user.firstName} ${user.lastName}`}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={`/avatars/${user.avatar}`} alt={`${user.firstName} ${user.lastName}`} className="object-cover" />
                  <AvatarFallback className="rounded-lg">{`${user.firstName.charAt(0).toUpperCase()} ${user.lastName.charAt(0).toUpperCase()}`}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{`${user.firstName} ${user.lastName}`}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to="/profile">
                <DropdownMenuItem>                
                  <UserPen />
                  Profilo
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
    else{
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="Guest" alt="Guest" />
                <AvatarFallback className="rounded-lg">G</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Guest</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="Guest" alt="Guest" />
                  <AvatarFallback className="rounded-lg">G</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Guest</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to="/login">
                <DropdownMenuItem>
                  <LogIn />
                  Login
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>            
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }    
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {UserInfo()}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
export default NavUser