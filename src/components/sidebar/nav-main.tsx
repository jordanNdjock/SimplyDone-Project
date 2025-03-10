"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/src/components/ui/sidebar"
import { IconType } from "react-icons/lib"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
  items
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon | IconType
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const path = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
        <>
          {item.items?.length === 0 && 
          <Link href={item.url} className={`${path === item.url ? "dark:bg-slate-800 rounded-sm bg-slate-500 text-white" : ""}`} key={item.url}>
            <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
            </SidebarMenuButton>
          </Link>}
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            {item.items && item.items.length > 0 && <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild >
                        <Link className={`${path === subItem.url ? "dark:bg-slate-800 rounded-sm bg-slate-500 text-white" : ""}`} href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>}
          </Collapsible>
        </>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
