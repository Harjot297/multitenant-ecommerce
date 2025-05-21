import z from "zod"
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { headers as getHeaders , cookies as getCookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import { AUTH_COOKIE } from "../constants";
import { loginSchema, registrationSchema } from "../schemas";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ctx}) => {
    
    const headers = await getHeaders();

    const session = await ctx.db.auth({headers}); // its payload.auth({headers}) ...check baseProcedure in trpc init file

    return session;
    
  }),
  logout : baseProcedure.mutation(async () => {
    const cookies = await getCookies();
    cookies.delete(AUTH_COOKIE);
  }),
  register: baseProcedure.input(registrationSchema)
    .mutation(async ({input, ctx}) => { // register procedure only
        const existingData = await ctx.db.find({
            collection: "users",
            limit: 1,
            where : {
                username: {
                    equals : input.username
                },
            },
        });
        const existingUser = existingData.docs[0];
        if(existingUser){
            throw new TRPCError({
                code : "BAD_REQUEST",
                message : "Username Already Taken"
            })
        }
       await ctx.db.create({
        collection : "users",
        data: {
            email : input.email,
            username : input.username,
            password: input.password
        },
       });
       // after registration immediately login
       const data = await ctx.db.login({
        collection : "users",
        data : {
            email : input.email,
            password : input.password
        },
       });
       if(!data.token){
        throw new TRPCError({
            code : "UNAUTHORIZED",
            message: "Failed to login"
        })
       }

       const cookies = await getCookies();
       cookies.set({
        name : AUTH_COOKIE,
        value: data.token,
        httpOnly : true,
        path : "/",
        // sameSite: "none",
        // domain : ""
        // TODO: Ensure cross domain cookie sharing
       });
    }),
    login: baseProcedure.input(loginSchema)
    .mutation(async ({input, ctx}) => { // register procedure only
       const data = await ctx.db.login({
        collection : "users",
        data : {
            email : input.email,
            password : input.password
        },
       });
       if(!data.token){
        throw new TRPCError({
            code : "UNAUTHORIZED",
            message: "Failed to login"
        })
       }

       const cookies = await getCookies();
       cookies.set({
        name : AUTH_COOKIE,
        value: data.token,
        httpOnly : true,
        path : "/",
        // sameSite: "none",
        // domain : ""
        // TODO: Ensure cross domain cookie sharing
       });

       return data;
    }),
});
