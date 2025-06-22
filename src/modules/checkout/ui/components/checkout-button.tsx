import { Button } from "@/components/ui/button";
import { cn , generateTenantURL } from "@/lib/utils";

import { useCart } from "../../hooks/use-cart";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

interface CheckOutButtonProps{
    classname ?: string;
    hideIfEmpty?: boolean;
    tenantSlug: string;
}

export const CheckoutButton = ({classname , hideIfEmpty , tenantSlug} : CheckOutButtonProps) => {
    const {totalItems} = useCart(tenantSlug);
    if(hideIfEmpty && totalItems == 0) return null;

    return(
        <Button variant={"elevated"} asChild className={cn("bg-white" , classname)}>
            <Link href={`${generateTenantURL(tenantSlug)}/checkout`}>
                <ShoppingCartIcon /> {totalItems > 0 ? totalItems : ""}
            </Link>

        </Button>
    )
}