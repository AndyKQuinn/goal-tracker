import { AllGoalsWithTasks} from '../../components/Goal/GoalList'

export default function GoalsPage() {
  return (
    <AllGoalsWithTasks />
  )
}

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
