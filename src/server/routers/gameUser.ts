/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
 import { Prisma } from '@prisma/client';
 import { TRPCError } from '@trpc/server';
 import { z } from 'zod';
 import { createRouter } from '~/server/createRouter';
 import { prisma } from '~/server/prisma';
 
 /**
  * Default selector for User.
  * It's important to always explicitly say which fields you want to return in order to not leak extra information
  * @see https://github.com/prisma/prisma/issues/9353
  */

const defaultGameUserSelect = Prisma.validator<Prisma.GameUserSelect>()({
  userId: true,
  alias: true,
  actionCount: true,
  level: true
});
 
 export const gameUserRouter = createRouter()
  .mutation('add', {
    input: z.object({
      id: z.string().uuid().optional(),
      userId: z.string(),
      alias: z.string(),
      actionCount: z.number(),
      level: z.number()
    }),
    async resolve({ input }) {
      const user = await prisma.gameUser.create({
        data: input,
        select: defaultGameUserSelect,
      });
      return user;
    },
  })

  .query('all', {
    async resolve() {
      /**
      * For pagination you can have a look at this docs site
      * @link https://trpc.io/docs/useInfiniteQuery
      */

      return prisma.gameUser.findMany({
        select: defaultGameUserSelect,
      });
    },
  })

  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const user = await prisma.gameUser.findUnique({
        where: { id },
        select: defaultGameUserSelect,
      });
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with id '${id}'`,
        });
      }
      return user;
    },
  })

  .mutation('edit', {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        userId: z.string(),
        alias: z.string(),
        actionCount: z.number(),
        level: z.number()
      }),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      const user = await prisma.gameUser.update({
        where: { id },
        data,
        select: defaultGameUserSelect,
      });
      return user;
    },
  })

  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.gameUser.delete({ where: { id } });
      return {
        id,
      };
    },
  });
