import NextError from 'next/error';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '~/pages/_app';
import { trpc } from '~/utils/trpc';

const TaskViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const taskQuery = trpc.useQuery(['tasks.byId', { id }]);

  if (taskQuery.error) {
    return (
      <NextError
        title={taskQuery.error.message}
        statusCode={taskQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (taskQuery.status !== 'success') {
    return <>Loading...</>;
  }

  const { data } = taskQuery;

  return (
    <>
      <h1>{data.title}</h1>
      <em>Created {data.createdAt.toLocaleDateString('en-us')}</em>

      <p>{data.description}</p>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </>
  );
};

export default TaskViewPage;
