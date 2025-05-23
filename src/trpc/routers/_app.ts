
import { authRouter } from '@/modules/auth/server/procedures';
import { createTRPCRouter } from '../init';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { productsRouter } from '@/modules/products/server/products';
import { tagsRouter } from '@/modules/tags/server/tags';
export const appRouter = createTRPCRouter({
  auth : authRouter,
  categories: categoriesRouter,
  products: productsRouter,
  tags: tagsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;