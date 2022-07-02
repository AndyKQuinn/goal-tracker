import NextError from 'next/error';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';

export default function ViewGoal() {
  const id = useRouter().query.id as string;
  const goalQuery = trpc.useQuery(['goals.byGoalId', { id }]);

  if (goalQuery.error) {
    return (
      <NextError
        title={goalQuery.error.message}
        statusCode={goalQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (goalQuery.status !== 'success') {
    return <>Loading...</>;
  }

  const { data } = goalQuery;

  return (
    <>
      <h1>{data.title}</h1>
      <em>Created {data.createdAt.toLocaleDateString('en-us')}</em>

      <p>{data.description}</p>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(data, null, 4)}</pre>
      <ViewGoal />
    </>
  );
}
