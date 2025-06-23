import { set } from "date-fns";
import {create} from "zustand"
import {createJSONStorage, persist} from "zustand/middleware"

interface TenantCart{
    productsIds: string[];
};

interface CartState{
    tenantsCarts : Record<string,TenantCart>
    addProduct: (tenantSlug: string, productId: string) => void;
    removeProduct: (tenantSlug: string, productId: string ) => void;
    clearCart: (tenantSlug: string ) => void;
    clearAllCarts: () => void;
    
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            tenantsCarts: {},
            addProduct: (tenantSlug, productId) => 
                set( (state) => ({
                    tenantsCarts: {
                        ...state.tenantsCarts,
                        [tenantSlug] :{
                            productsIds: [
                                ...(state.tenantsCarts[tenantSlug]?.productsIds  || []),
                                productId,
                            ]
                        }
                    }
                }) ),
            removeProduct: (tenantSlug, productId) => 
                set( (state) => ({
                    tenantsCarts: {
                        ...state.tenantsCarts,
                        [tenantSlug] :{
                            productsIds: state.tenantsCarts[tenantSlug]?.productsIds.filter(
                                (id) => id !== productId
                            ) || [],
                        }
                    }
                }) ),
            clearCart: (tenantSlug) => 
                set( (state) => ({
                    tenantsCarts: {
                        ...state.tenantsCarts,
                        [tenantSlug] :{
                            productsIds: [],
                        }
                    }
                }) ),
            clearAllCarts: () => 
                set({
                    tenantsCarts: {},
                }),
            
        }),
        {
            name: "funroad-cart",
            storage: createJSONStorage( () => localStorage ),
        },
    ),
);