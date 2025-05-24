import { SearchParams } from "nuqs/server";


import {  getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { loadProductFilters } from "@/modules/products/search-params";

import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { DEFAULT_LIMIT } from "@/constants";

interface Props {
  params: Promise<{
    category: string;
  }>;
  searchParams : Promise<SearchParams>;
}

const page = async ({ params , searchParams}: Props) => {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryCLient = getQueryClient();
  void queryCLient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      category,
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryCLient)}>
      <ProductListView category={category} />
    </HydrationBoundary>
  );
};
export default page;
