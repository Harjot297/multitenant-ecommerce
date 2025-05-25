import { Footer } from "@/modules/tenants/ui/components/Footer";
import { Navbar, NavbarSkeleton } from "@/modules/tenants/ui/components/Navbar";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface LayourProps{
    children: React.ReactNode,
    params: Promise<{slug:string}>;
}



const Layout = async ({children , params} : LayourProps) => {

    // prefetch
    const {slug} = await params;
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({
        slug,
    }));


    return (
        <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<NavbarSkeleton />}>

                    <Navbar slug={slug} /> {/* Now , navbar will have prefetch tenants details */}
                </Suspense>
            </HydrationBoundary>
            <div className="flex-1">
                <div className="max-w-(--breakpoint-xl) mx-auto">
                    {children}

                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Layout;