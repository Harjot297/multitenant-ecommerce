import type { SearchParams } from "nuqs/server";

import { DEFAULT_LIMIT } from "@/constants";
import { getQueryClient, trpc } from '@/trpc/server';

import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { loadProductFilters } from "@/modules/products/search-params";
import { PageProps } from "../../../../../../../.next/types/app/layout";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
interface Props{
    searchParams: Promise<SearchParams>;
    params: Promise<{slug: string}>;
};

const Page = async ({params,searchParams} : Props) => {
    const {slug }= await params;
    const filters = await loadProductFilters(searchParams);

    const queryCLient = getQueryClient();
      void queryCLient.prefetchInfiniteQuery(
        trpc.products.getMany.infiniteQueryOptions({
          ...filters,
          tenantSlug: slug,
          limit: DEFAULT_LIMIT,
        })
      );

    return (
    <HydrationBoundary state={dehydrate(queryCLient)}>
      <ProductListView tenantSlug={slug} narrowView />
    </HydrationBoundary>
  );
}
 
export default Page;