"use client"
import { Input } from "@/components/ui/input";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import CategoriesSidebar from "./CategoriesSidebar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useProductFilters } from "@/modules/products/hooks/use-product-filters";

interface SearchInputProps {
  disabled ?: boolean;
  // data : CustomCategory[],
}

const SearchInput = ({disabled} : SearchInputProps) => {
  const [filters, setFilters] = useProductFilters();
  const [isSidebarOpen,setIsSidebarOpen] = useState(false);
  const[searchValue , setSearchValue] = useState(filters.search);
  
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters({search: searchValue});
    }, 500)
    
    return () => clearTimeout(timeoutId);
  }, [searchValue, setFilters]);

  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar  open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <div className="relative w-full">
        <SearchIcon className= "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input 
          className="pl-8" 
          placeholder="Search Products" 
          disabled={disabled} 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      
      <Button variant={"elevated"}
        className="size-12 shrink-0 flex lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon />
      </Button>
      {/* TOdO : Add Library Button */}
      {session.data?.user && (
        <Button variant={"elevated"} asChild>
          <Link href={"/library"}>
            <BookmarkCheckIcon className="mr-2" />
            Library
          </Link>
        </Button>
      )}
    </div>
  )
}

export default SearchInput
