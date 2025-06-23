import { useStore } from "zustand";
import { useCartStore } from "../store/use-cart-store";
import { useCallback } from "react";
import {useShallow} from "zustand/react/shallow"
export const useCart = (tenantSlug: string) => {
    // const {
    //     getCartByTenant,
    //     addProduct,
    //     removeProduct,
    //     clearAllCarts,
    //     clearCart,
    // } = useCartStore();

    //! USECALLBACK IS NOTHING BUT MEMOIZING SO THAT IT DOESNT RELOAD THOSE COMPONENTS UNTIL DEPENDENCIES
    // CHANGE FOR BETTER PERFORMANCE
    

    
    const addProduct = useCartStore((state) => state.addProduct);
    const removeProduct = useCartStore((state) => state.removeProduct);
    const clearAllCarts = useCartStore((state) => state.clearAllCarts);
    const clearCart = useCartStore((state) => state.clearCart);


    const productIds = useCartStore(useShallow((state) => state.tenantsCarts[tenantSlug]?.productsIds || []));
    
    const toggleProduct = useCallback((productId: string) => {
        if(productIds.includes(productId)){
            removeProduct(tenantSlug,productId);
        }
        else{
            addProduct(tenantSlug,productId);
        }
    },[addProduct, removeProduct , productIds, tenantSlug]);

    const isProductInCart = useCallback((productId: string) => {
        return productIds.includes(productId);
    },[productIds]);

    const clearTenantCart = useCallback(() => {
        clearCart(tenantSlug);
    },[tenantSlug, clearCart]);

    const handleAddProduct = useCallback((productId: string) => {
        addProduct(tenantSlug,productId);
    },[addProduct,tenantSlug]);

    const handleRemoveProduct = useCallback((productId: string) => {
        removeProduct(tenantSlug,productId);
    },[removeProduct,tenantSlug]);

    return{
        productIds,
        addProduct: handleAddProduct,
        removeProduct: handleRemoveProduct,
        clearCart: clearTenantCart,
        clearAllCarts,
        toggleProduct,
        isProductInCart,
        totalItems: productIds.length,
    };
};