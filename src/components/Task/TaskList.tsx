import { useEffect } from 'react';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';

export default function TaskList() {
  const tasksQuery = trpc.useQuery(['tasks.all']);
  const utils = trpc.useContext();

  // prefetch for instant navigation
  useEffect(() => {
    for (const { id } of tasksQuery.data ?? []) {
      utils.prefetchQuery(['tasks.byId', { id }]);
    }
  }, [tasksQuery.data, utils]);

  return (
    <div>
      {tasksQuery.status === 'loading' && '(loading)'}
      {tasksQuery.data?.map((item) => (
        <article className="p-1" key={item.id}>
          <h3 className="p-1 text-center text-white bg-blue-400">
            {item.title}
          </h3>
          <Link href={`/task/${item.id}`}>
            <div className="p-1 text-xs text-center text-blue-800">
              View more
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
