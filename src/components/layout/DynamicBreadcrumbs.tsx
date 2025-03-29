"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { selectUser, useAuthStore } from "../../store/authSlice";
import { useSidebar } from "../ui/sidebar";
import { getInitials } from "../../utils/utils";


const DynamicBreadcrumb = () => {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const user = useAuthStore(selectUser);
  function getGreeting(): string {
    const hour = new Date().getHours();
    if(isMobile) {
      return hour >= 6 && hour < 13  ? `Bonjour ☀️ ${getInitials(user?.name, true)}` : hour >= 13 && hour < 20 ? `Bonsoir 🌇 ${getInitials(user?.name, true)}` : `Bonne Nuit 🌙 ${getInitials(user?.name, true)}`;
    } 
      return hour >= 6 && hour < 13  ? `Bonjour ☀️ ${user?.name}` : hour >= 13 && hour < 20 ? `Bonsoir 🌇 ${user?.name}` : `Bonne Nuit 🌙 ${user?.name}`;
  }

  if(pathname === "/dashboard") {
    return getGreeting();
  }
  const paths = pathname
    .split("/")
    .filter(Boolean)
    .filter((segment, index) => !(index === 0 && segment === "dashboard"));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden lg:block sm:block md:block">
          <Link href="/dashboard">Accueil</Link>
        </BreadcrumbItem>
        {paths.map((segment, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === paths.length - 1 ? (
                <BreadcrumbPage> {segment.charAt(0).toUpperCase() + segment.slice(1)}</BreadcrumbPage>
              ) : (
                <Link
                href={`/${paths.slice(0, index + 1).join("/")}`}
              >
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </Link>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
