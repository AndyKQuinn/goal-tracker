import { useState, useEffect } from 'react';
import { trpc } from '../../utils/trpc';
import { NextPageWithLayout } from '../_app';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

const GoalsList = () => {
  const goalsQuery = trpc.useQuery(['goal.all']);
  const utils = trpc.useContext();

   // prefetch for instant navigation
  useEffect(() => {
    for (const { id } of goalsQuery.data ?? []) {
      utils.prefetchQuery(['goal.byId', { id }]);
    }
  }, [goalsQuery.data, utils]);

  return (
    <>
      <p>
        <a href="https://trpc.io/docs">Docs</a>
      </p>
      <h2>
        Goals
        {goalsQuery.status === 'loading' && '(loading)'}
      </h2>
      {goalsQuery.data?.map((item) => (
        <article key={item.id}>
          <h3>{item.title}</h3>
          <Link href={`/goal/${item.id}`}>
            <a>View more</a>
          </Link>
        </article>
      ))}
    </>
  )
}

const GoalsPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const addGoal = trpc.useMutation('goal.add', {
    async onSuccess() {
      await utils.invalidateQueries(['goal.all']);
    },
  });

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    const input = data
    input.active = true

    try {
      await addGoal.mutateAsync(input)
    } catch {(error: any) => console.log(error)}
  }

  return (
    <>
      <GoalsList />
      <hr />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("title")} placeholder="Title" name="title" />
        <input {...register("description")} placeholder="Description" name="description" />
        <input type="submit" />
        {addGoal.error && (
          <p style={{ color: 'red' }}>{addGoal.error.message}</p>
        )}
      </form>
    </>
  );
};

export default GoalsPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createCondescription` from [trpc].ts
 * - Make the `opts` object optional on `createCondescription()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   condescription: GetStaticPropsCondescription<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createCondescription(),
//   });
//
//   await ssg.fetchQuery('goal.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: condescription.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
