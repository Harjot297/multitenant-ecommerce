"use client";

import { generateTenantURL } from "@/lib/utils";
// import { CheckoutButton } from "@/modules/checkout/ui/components/checkout-button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

// Dynamically loading to avoid hydration error because these data
// is present on client side and checkout button with cart items count is generated on client
// side but not on server side because we are not storing data on server or database , so server side
// generates with no checkout button and cart count but client generates with checkout and cart count
// because when we click add to cart its stored in client using zustand (similar to redux ) , so to fix
// that hydration error we dynamically load the checkoutButton page and disable server side rendering
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";

const CheckoutButton = dynamic(
  () =>
    import("@/modules/checkout/ui/components/checkout-button").then(
      (mod) => mod.CheckoutButton
    ),
  {
    ssr: false,
    loading: () => (
      <Button disabled className=" bg-white">
        <ShoppingCartIcon className="text-black" />
      </Button>
    ),
  }
);

interface Props {
  slug: string;
}

export const Navbar = ({ slug }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  ); // Now you can normally get data as its already loaded or prefetched in Layout.tsx
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div
        className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full 
            px-4 lg:px-12"
      >
        <Link
          href={generateTenantURL(slug)}
          className="flex items-center gap-2"
        >
          {data.image?.url && (
            <Image
              src={data.image.url}
              width={32}
              height={32}
              className="rounded-full border shrink-0 size-32px"
              alt="slug"
            />
          )}
          <p className="text-xl ">{data.name}</p>
        </Link>
        <CheckoutButton hideIfEmpty tenantSlug={slug} />
      </div>
    </nav>
  );
};
// Hola
export const NavbarSkeleton = () => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div
        className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full 
            px-4 lg:px-12"
      >
        <Button disabled className=" bg-white">
          <ShoppingCartIcon className="text-black" />
        </Button>
      </div>
    </nav>
  );
};
