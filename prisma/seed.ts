/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const firstGoalId = '5c03994c-fc16-47e0-bd02-d123456780aa';
  const firstTaskId = '5c03994c-fc16-47e0-bd02-d123456780ab';
  const firstTaskEntryId = '5c03994c-fc16-47e0-bd02-d123456780ac';

  const firstTaskEntry = {
    id: firstTaskEntryId,
    rating: 5,
    comment: 'Not my best effort...',
    duration: 60
  }

  const firstTask =  {
    id: firstTaskId,
    title: 'First Task Title',
    description: 'First Task Description',
    createdBy: 'andyQuinn',
    cadence: 'daily',
    quantity: 3,
    taskEntries: {
      create: [
        firstTaskEntry,
      ]
    }
  }

  const firstGoal = {
    id: firstGoalId,
    title: 'First Goal',
    description: 'LETS GO, BABY!!!',
    active: true,
    createdBy: 'andyQuinn',
    tasks: {
      create: [
        firstTask,
      ]
    }
  }

  const updatedGoal = {
    title: 'First Updated Goal',
    description: 'LETS GO, PIKACHU!!!',
    active: false,
  }

  const updatedTask = {
    title: 'Updated Task Title',
    description: 'Updated Task Description',
  }

  const updatedTaskEntry = {
    rating: 3,
    comment: 'Getting better...',
  }

  await prisma.goal.upsert({
    where: {
      id: firstGoalId,
    },
    create: firstGoal,
    update: updatedGoal,
  })

  await prisma.task.upsert({
    where: {
      id: firstTaskId,
    },
    create: firstTask,
    update: updatedTask,
  })

  await prisma.taskEntry.upsert({
    where: {
      id: firstTaskEntryId,
    },
    create: firstTaskEntry,
    update: updatedTaskEntry,
  })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
