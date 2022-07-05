import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';

/**
 * Default selector for Goal.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultGoalSelect = Prisma.validator<Prisma.GoalSelect>()({
  id: true,
  title: true,
  description: true,
  active: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  tasks: true
});

export const goalRouter = createRouter()

  .mutation('add', {
    input: z.object({
      id: z.string().uuid().optional(),
      title: z.string().min(1).max(32),
      description: z.string(),
      active: z.boolean(),
      createdBy: z.string().min(1),
    }),
    async resolve({ input }) {
      const goal = await prisma.goal.create({
        data: input,
        select: defaultGoalSelect,
      });
      return goal;
    },
  })

  .query('all', {
    async resolve() {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return prisma.goal.findMany({
        select: defaultGoalSelect,
      });
    },
  })

  .query('byGoalId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const goal = await prisma.goal.findUnique({
        where: { id },
        select: defaultGoalSelect,
      });
      if (!goal) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No goal with id '${id}'`,
        });
      }
      return goal;
    },
  })

  .query('byUserId', {
    input: z.object({
      createdBy: z.string(),
    }),
    async resolve({ input }) {
      const { createdBy } = input;
      const goal = await prisma.goal.findMany({
        where: { createdBy: createdBy },
        select: defaultGoalSelect,
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

  .mutation('edit', {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        title: z.string().min(1).max(32).optional(),
        description: z.string().min(1).optional(),
        active: z.boolean(),
      }),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      const goal = await prisma.goal.update({
        where: { id },
        data,
        select: defaultGoalSelect,
      });
      return goal;
    },
  })

  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.goal.delete({ where: { id } });
      return {
        id,
      };
    },
  }
);
