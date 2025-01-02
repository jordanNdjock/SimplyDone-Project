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

const DynamicBreadcrumb = () => {
  const pathname = usePathname();

  if(pathname === "/dashboard") {
    return null;
  }
  const paths = pathname
    .split("/")
    .filter(Boolean)
    .filter((segment, index) => !(index === 0 && segment === "dashboard"));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
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
