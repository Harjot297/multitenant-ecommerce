import { SearchParams } from "nuqs/server";


import {  getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { loadProductFilters } from "@/modules/products/search-params";

import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { DEFAULT_LIMIT } from "@/constants";

interface Props {
  
  searchParams : Promise<SearchParams>;
}

const page = async ({  searchParams}: Props) => {

  const filters = await loadProductFilters(searchParams);

  const queryCLient = getQueryClient();
  void queryCLient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryCLient)}>
      <ProductListView  />
    </HydrationBoundary>
  );
};
export default page;
