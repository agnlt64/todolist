"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function BreadcrumbComponent() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem key="home">
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{segment}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
