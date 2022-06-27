/**
 * Integration test example for the `post` router
 */
import { createContextInner } from '../context';
import { appRouter } from './_app';
import { inferMutationInput } from '~/utils/trpc';

test('add and get goal', async () => {
  const ctx = await createContextInner({});
  const caller = appRouter.createCaller(ctx);

  const input: inferMutationInput<'goal.add'> = {
    title: 'hello test',
    description: 'hello test description',
    active: true,
    createdBy: 'rando user',
  };
  const post = await caller.mutation('goal.add', input);
  const byId = await caller.query('goal.byId', {
    id: post.id,
  });

  expect(byId).toMatchObject(input);
});
