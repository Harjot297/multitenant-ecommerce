
import { authRouter } from '@/modules/auth/server/procedures';
import { createTRPCRouter } from '../init';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { productsRouter } from '@/modules/products/server/products';
import { tagsRouter } from '@/modules/tags/server/tags';
import { tenantsRouter } from '@/modules/tenants/server/tenants';
export const appRouter = createTRPCRouter({
  auth : authRouter,
  categories: categoriesRouter,
  products: productsRouter,
  tags: tagsRouter,
  tenants: tenantsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;