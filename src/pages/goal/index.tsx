import { 
  // useState,
  useEffect
} from 'react';
import { trpc } from '../../utils/trpc';
import { NextPageWithLayout } from '../_app';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

export const GoalsList: NextPageWithLayout = () => {
  const goalsQuery = trpc.useQuery(['goal.all']);
  const utils = trpc.useContext();

   // prefetch for instant navigation
  useEffect(() => {
    for (const { id } of goalsQuery.data ?? []) {
      utils.prefetchQuery(['goal.byId', { id }]);
    }
  }, [goalsQuery.data, utils]);

  return (
    <div>
      {goalsQuery.status === 'loading' && '(loading)'}
      {goalsQuery.data?.map((item) => (
        <article className='p-1' key={item.id}>
          <h3 className='p-1 text-center text-white bg-blue-400'>{item.title}</h3>
          <Link href={`/goal/${item.id}`}>
            <div className="p-1 text-xs text-center text-blue-800">View more</div>
          </Link>
        </article>
      ))}
    </div>
  )
}

export const GoalForm: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const addGoal = trpc.useMutation('goal.add', {
    async onSuccess() {
      await utils.invalidateQueries(['goal.all']);
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    const input = data
    input.active = true

    try {
      await addGoal.mutateAsync(input)
      reset()
    } catch {(error: any) => console.log(error)}
  }

  return (
    <div className="p-2">
      Add Goal
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input {...register("title")} placeholder="Title" name="title" />
        </div>
        <div>
          <input {...register("description")} placeholder="Description" name="description" />
        </div>
        <input className="bg-gray-100 btn" type="submit" />
        {addGoal.error && (
          <p style={{ color: 'red' }}>{addGoal.error.message}</p>
        )}
      </form>
    </div>
  );
};

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
