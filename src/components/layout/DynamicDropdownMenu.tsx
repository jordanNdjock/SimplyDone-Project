"use client";

import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";

type MenuItem = {
  label: string;
  href: string;
};

const DynamicDropdownMenu: React.FC = () => {
  const pathname = usePathname();

  const menuItems: Record<string, MenuItem[]> = {
    "/dashboard": [
      { label: "Trier", href: "/dashboard/profile" },
      { label: "Afficher details", href: "/dashboard/billing" },
      { label: "Liste", href: "/dashboard/settings" },
    ],
    "/dashboard/profil": [
      { label: "Edit Profile", href: "/dashboard/profile/edit" },
      { label: "Privacy Settings", href: "/dashboard/profile/privacy" },
    ],
    "/dashboard/parametres": [
      { label: "General", href: "/dashboard/settings/general" },
      { label: "Security", href: "/dashboard/settings/security" },
    ],
  };


  const items = menuItems[pathname] ?? [
    { label: "Home", href: "/" },
    { label: "Contact Support", href: "/support" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link href={item.href}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DynamicDropdownMenu;
