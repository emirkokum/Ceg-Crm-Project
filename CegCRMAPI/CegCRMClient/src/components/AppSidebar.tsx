// src/components/AppSidebar.tsx
"use client"

import * as React from "react"
import {
  CameraIcon,
  FileCodeIcon,
  FileTextIcon,
  HelpCircleIcon,
  SearchIcon,
  SettingsIcon,
  SquareMousePointer,
  LogOutIcon,
  UserIcon,
} from "lucide-react"

import { NavMain } from "@/components/NavMain"
import { NavSecondary } from "@/components/NavSecondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { navigationItems } from "@/app/router"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        { title: "Active Proposals", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        { title: "Active Proposals", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        { title: "Active Proposals", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logout, userInfo, role } = useAuth();

  const handleLogout = () => {
    try {
      logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const filteredNavigationItems = navigationItems.filter(item => 
    role && item.allowedRoles.includes(role)
  );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <SquareMousePointer className="h-5 w-5" />
                <span className="text-base font-semibold">CEG-CRM</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavigationItems} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-5 p-1.5">
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {userInfo?.email || ''}
            </span>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm hover:text-foreground bg-red-400"
            onClick={handleLogout}
          >
            <LogOutIcon className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
