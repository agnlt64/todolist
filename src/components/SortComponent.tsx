"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SortComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "default") {
      params.delete("sortBy");
    } else {
      params.set("sortBy", value);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      onValueChange={handleSortChange}
      defaultValue={searchParams.get("sortBy") || "default"}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Sort by Date</SelectItem>
        <SelectItem value="priority-desc">Priority (High to Low)</SelectItem>
        <SelectItem value="priority-asc">Priority (Low to High)</SelectItem>
      </SelectContent>
    </Select>
  );
}