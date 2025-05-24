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

const page = async ({ params , searchParams}: Props) => {
  const { subcategory } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryCLient = getQueryClient();
  void queryCLient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category: subcategory,
      ...filters,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryCLient)}>
      <ProductListView category={subcategory} />
    </HydrationBoundary>
  );
};
export default page;