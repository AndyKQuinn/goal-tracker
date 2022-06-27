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
 * Default selector for TaskEntry.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
 const defaultTaskEntrySelect = Prisma.validator<Prisma.TaskEntrySelect>()({
   id: true,
   taskId: true,
   date: true,
   rating: true,
   comment: true,
   createdAt: true,
   updatedAt: true,
 });
 
 export const taskEntryRouter = createRouter()
  // create
  .mutation('add', {
    input: z.object({
      id: z.string().uuid(),
      taskId: z.string(),
      date: z.date(),
      rating: z.number(),
      comment: z.string(),
    }),
    async resolve({ input }) {
      const taskEntry = await prisma.taskEntry.create({
        data: input,
        select: defaultTaskEntrySelect,
      });
      return taskEntry;
    },
  })
  // read
  .query('all', {
    async resolve() {
      /**
     * For pagination you can have a look at this docs site
     * @link https://trpc.io/docs/useInfiniteQuery
     */

      return prisma.taskEntry.findMany({
        select: defaultTaskEntrySelect,
      });
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const taskEntry = await prisma.taskEntry.findUnique({
        where: { id },
        select: defaultTaskEntrySelect,
      });
      if (!taskEntry) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No taskEntry with id '${id}'`,
        });
      }
      return taskEntry;
    },
  })
  // update
  .mutation('edit', {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        taskId: z.string(),
        date: z.date(),
        rating: z.number(),
        comment: z.string(),
        taskEntryId: z.string().uuid()
      }),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      const taskEntry = await prisma.taskEntry.update({
        where: { id },
        data,
        select: defaultTaskEntrySelect,
      });
      return taskEntry;
    },
  })
  // delete
  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.taskEntry.delete({ where: { id } });
      return {
        id,
      };
    },
  });
