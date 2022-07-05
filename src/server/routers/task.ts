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
* Default selector for Task.
* It's important to always explicitly say which fields you want to return in order to not leak extra information
* @see https://github.com/prisma/prisma/issues/9353
*/
const defaultTaskSelect = Prisma.validator<Prisma.TaskSelect>()({
  id: true,
  title: true,
  description: true,
  quantity: true,
  active: true,
  cadence: true,
  goalId: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  taskEntries: true,
});

export const taskRouter = createRouter()
  // create
  .mutation('add', {
    input: z.object({
      id: z.string().uuid().optional(),
      title: z.string().min(1).max(32),
      description: z.string(),
      active: z.boolean(),
      goalId: z.string().min(1),
      quantity: z.number(),
      cadence: z.string().min(1),
      createdBy: z.string().min(1),
      taskEntries: z.array(
        z.object({

        })
      )
    }),
    async resolve({ input }) {
      const task = await prisma.task.create({
        data: input,
        select: defaultTaskSelect,
      });
      return task;
    },
  })
  // read
  .query('all', {
    async resolve() {
      /**
      * For pagination you can have a look at this docs site
      * @link https://trpc.io/docs/useInfiniteQuery
      */

      return prisma.task.findMany({
        select: defaultTaskSelect,
      });
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const task = await prisma.task.findUnique({
        where: { id },
        select: defaultTaskSelect,
      });
      if (!task) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No goal tasks with GoalID '${id}'`,
        });
      }
      return task;
    },
  })
  .query('byGoalId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const task = await prisma.task.findMany({
        where: { goalId: id },
        select: defaultTaskSelect,
      });
      if (!task) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No goal tasks with GoalID '${id}'`,
        });
      }
      return task;
    },
  })
  .query('byUserId', {
    input: z.object({
      createdBy: z.string(),
    }),
    async resolve({ input }) {
      const { createdBy } = input;
      const goal = await prisma.task.findMany({
        where: { createdBy: createdBy },
        select: defaultTaskSelect,
      });
      if (!goal) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No goals made by userID '${createdBy}'`,
        });
      }
      return goal;
    },
  })
  // update
  .mutation('edit', {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        title: z.string().min(1).max(32).optional(),
        description: z.string().min(1).optional(),
      }),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      const task = await prisma.task.update({
        where: { id },
        data,
        select: defaultTaskSelect,
      });
      return task;
    },
  })
  // delete
  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.task.delete({ where: { id } });
      return {
        id,
      };
    },
  });
