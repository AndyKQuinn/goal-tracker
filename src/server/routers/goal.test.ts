/**
 * Integration test example for the `post` router
 */
import { createContextInner } from '../context';
import { appRouter } from './_app';
import { inferMutationInput } from '~/utils/trpc';

test('add and get goal', async () => {
  // const ctx = await createContextInner({});
  // const caller = appRouter.createCaller(ctx);

  // const input: inferMutationInput<'goals.add'> = {
  //   title: 'hello test',
  //   description: 'hello test description',
  //   active: true,
  //   createdBy: 'rando user',
  // };
  // const goal = await caller.mutation('goals.add', input);
  // const byId = await caller.query('goals.byGoalId', {
  //   id: goal.id,
  // });

  // expect(byId).toMatchObject(input);
});
