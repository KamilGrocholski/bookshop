import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { categoryBase } from "~/schemes/base/categoryBase.scheme";

export const getBookByIdSchema = z.object({
  id: z.string().nonempty().transform(BigInt),
});

export const getBestSellersSchema = z.object({
  lastDays: z.number().int().positive(),
  take: z.number().int().positive(),
});

export const getRecentlyAddedSchema = z.object({
  take: z.number().int().positive(),
});

export const getPopularByCategoriesSchema = z.object({
  categories: categoryBase.id.array(),
  take: z.number().int().positive(),
});

export const getBooksByQuerySchema = z.object({
  query: z.string(),
  take: z.number().int().positive(),
});

export const bookRouter = createTRPCRouter({
  getByQuery: publicProcedure
    .input(getBooksByQuerySchema)
    .query(async ({ ctx, input }) => {
      const { take, query } = input;

      const count = await ctx.prisma.book.count({
        where: {
          OR: [
            {
              authors: {
                some: {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
      });

      const books = await ctx.prisma.book.findMany({
        take,
        where: {
          OR: [
            {
              authors: {
                some: {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          title: true,
          coverImageUrl: true,
          authors: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        books,
        count,
      };
    }),
  getSimilarBooks: publicProcedure
    .input(getPopularByCategoriesSchema)
    .query(({ ctx, input }) => {
      const { take, categories } = input;

      return ctx.prisma.book.findMany({
        take,
        where: {
          categories: {
            some: {
              id: {
                in: categories,
              },
            },
          },
        },
        orderBy: {
          orderItems: {
            _count: "desc",
          },
        },
        select: {
          id: true,
          title: true,
          coverImageUrl: true,
          authors: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }),
  getOneById: publicProcedure
    .input(getBookByIdSchema)
    .query(({ ctx, input }) => {
      const { id } = input;

      return ctx.prisma.book.findUnique({
        where: {
          id,
        },
        include: {
          authors: true,
          categories: true,
          publisher: true,
        },
      });
    }),
  getBestSellers: publicProcedure
    .input(getBestSellersSchema)
    .query(({ ctx, input }) => {
      const { take, lastDays } = input;

      const since = new Date(Date.now() - lastDays * 60 * 60 * 1000);

      return ctx.prisma.book.findMany({
        take,
        where: {
          orderItems: {
            every: {
              order: {
                createdAt: {
                  gte: since,
                },
              },
            },
          },
        },
        orderBy: {
          orderItems: {
            _count: "desc",
          },
        },
        select: {
          id: true,
          title: true,
          coverImageUrl: true,
          authors: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }),
  getRecentlyAdded: publicProcedure
    .input(getRecentlyAddedSchema)
    .query(({ ctx, input }) => {
      const { take } = input;

      return ctx.prisma.book.findMany({
        take,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          coverImageUrl: true,
          authors: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }),
});
