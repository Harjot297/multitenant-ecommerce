import { ProductList, ProductListSkeleton } from "@/modules/products/ui/components/product-list";
import { caller, getQueryClient , trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props{
    params : Promise<{
        category: string;
    }>
}

const page = async ({params} : Props) => {
    const {category } = await params;
  
  const queryCLient = getQueryClient();
  void queryCLient.prefetchQuery(trpc.products.getMany.queryOptions({
    category,
  }));
  return (
   <HydrationBoundary state={dehydrate(queryCLient)}>
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductList category={category} />
    </Suspense>
   </HydrationBoundary>
  )
}
export default page

