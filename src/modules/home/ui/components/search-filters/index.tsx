"use client";
import { useTRPC } from "@/trpc/client";
import Categories from "./Categories";
import SearchInput from "./SearchInput";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { DEFAULT_BG_COLOR } from "@/modules/home/constants";
import BreadcrumbNavigation from "./BreadcrumbNavigation";
import { useProductFilters } from "@/modules/products/hooks/use-product-filters";

// interface SearchFiltersProps {
//   data : CustomCategory[];
// }

const SearchFilters = () => {
  const trpc = useTRPC();
  const {data} = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  const params = useParams();
  const categoryParam = params.category as string | null;
  const activeCategory = categoryParam || "all";
  const [filters, setFilters] = useProductFilters();

  const activeCategoryData = data.find((category) => category.slug === activeCategory);
  const activeCategoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR;
  const activeCategoryName = activeCategoryData?.name || null;

  const activeSubCategory = params.subcategory as string | undefined;
  const activeSubcategoryName = activeCategoryData?.subcategories?.find(
    (subcategory) => subcategory.slug === activeSubCategory
  )?.name || null;
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full" style={{
      backgroundColor : activeCategoryColor
    }}>
      <SearchInput defaultValue={filters.search} onChange={(value) => setFilters({search: value})}  />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
      <BreadcrumbNavigation
        activeCategoryName = {activeCategoryName}
        activeCategory = {activeCategory}
        activeSubcategoryName = {activeSubcategoryName}
      />
    </div>
  )
}

export default SearchFilters;

export const SearchFiltersSkeleton = () => {
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full" style={{
      backgroundColor: "#F5F5F5"
    }}>
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  )
}
