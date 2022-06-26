/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const firstGoalId = '5c03994c-fc16-47e0-bd02-d218a370a0aa';

  await prisma.goal.upsert({
    where: {
      id: firstGoalId,
    },
    create: {
      id: firstGoalId,
      title: 'First Goal',
      description: 'Baby  did his first goal, baby!',
      active: true,
      createdBy: 'andyQuinn',
    },
    update: {},
  });

  const firstTaskId = '5c03994c-fc16-47e0-bd02-d218a370a0ab';

  await prisma.task.upsert({
    where: {
      id: firstTaskId,
    },
    create: {
      id: firstTaskId,
      title: 'First Task',
      description: 'Baby  did his first TASK, baby!',
      goalID: firstGoalId,
      createdBy: 'andyQuinn',
    },
    update: {},
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
