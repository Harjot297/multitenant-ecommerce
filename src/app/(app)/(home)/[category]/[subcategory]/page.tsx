import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";

import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { getQueryClient , trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs";


interface Props{
    params : Promise<{
        subcategory: string;
    }>,
    searchParams : Promise<SearchParams>;
}

export const dynamic = "force-dynamic";

const page = async ({ params , searchParams}: Props) => {
  const { subcategory } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryCLient = getQueryClient();
  void queryCLient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      category: subcategory,
      ...filters,
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryCLient)}>
      <ProductListView category={subcategory} />
    </HydrationBoundary>
  );
};
export default page;