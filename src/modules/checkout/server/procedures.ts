import z from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Sort, Where } from "payload";
import CategoryDropdown from "@/modules/home/ui/components/search-filters/CategoryDropdown";
import { Category, Media, Tenant } from "@/payload-types";

import { DEFAULT_LIMIT } from "@/constants";
import { TRPCError } from "@trpc/server";

export const checkoutRouter = createTRPCRouter({
  getProducts: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      

      const data = await ctx.db.find({
        collection: "products",
        depth: 2, // ensures image and category , tenant , and also tenant.image(depth 2) is populated
        where: {
          id: {
            in: input.ids
          }
        }
      });
      
      if(data.totalDocs !== input.ids.length){
        throw new TRPCError({code: "NOT_FOUND" , message: "Products not found"});
      }

      const totalPrice = data.docs.reduce((acc,product) => {
        const price = Number(product.price);
        return acc + (isNaN(price) ? 0 : price);
      }, 0);

      return {
        ...data,
        totalPrice: totalPrice,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & {image: Media | null},
        }))
      }
    }),
});
