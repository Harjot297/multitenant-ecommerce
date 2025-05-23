import z from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Input } from "@/components/ui/input";
import { InputOTPGroup } from "@/components/ui/input-otp";
import { DEFAULT_LIMIT } from "@/constants";


export const tagsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit : z.number().default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ ctx , input }) => {
      
      const data = await ctx.db.find({
        collection: "tags",
        depth: 1, // ensures image and category is populated
        page: input.cursor,
        limit: input.limit,
      });

      return data;
    }),
});
