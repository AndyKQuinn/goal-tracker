import { useEffect } from 'react';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';

export default function GoalsList() {
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
        <article className="p-1" key={item.id}>
          <h3 className="p-1 text-center text-white bg-blue-400">
            {item.title}
          </h3>
          <Link href={`/goal/${item.id}`}>
            <div className="p-1 text-xs text-center text-blue-800">
              View more
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
