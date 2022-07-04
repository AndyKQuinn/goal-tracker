import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { trpc } from '../../../utils/trpc';
import Link from 'next/link';

interface IUserGoalsWithTasksProps {
  showTaskActions: boolean;
}

export default function UserGoalsWithTasks(props: IUserGoalsWithTasksProps) {
  const { showTaskActions } = props;

  console.log("Show Actions?: ", showTaskActions)
  const utils = trpc.useContext();
  const [ isChecked, setIsChecked ] = useState(false)

  const { user } = useUser();
  const id = user?.sub || ""
  
  const goalsQuery = trpc.useQuery(['goals.byUserId', { createdBy: id }])
  const goals = goalsQuery?.data || []

  const deleteGoalMutation = trpc.useMutation(['goals.delete'], { 
    onSuccess: () => {
      utils.invalidateQueries('goals.byUserId')
    },
  })

  useEffect(() => {
    for (const { id } of goalsQuery.data ?? []) {
      utils.prefetchQuery(['goals.byGoalId', { id }]);
    }
  }, [goalsQuery, utils])
  
  if (goalsQuery.status === "loading") return <div>Loading...</div>

  return (
    <div className="p-1">
      {goals?.map((goal) => {
        return (
          <article className="p-1 mt-1 border-2 border-purple-200 rounded-md shadow-md" key={goal.id}>
            <div className="flex justify-between p-2 text-lg text-white bg-purple-600 border-2 rounded-md">
              <span>Goal: {goal.title}</span>
              <span>Icon</span>
            </div>
            {goal?.tasks.map((task) => (
               <div key={task.id} className="mt-1 ml-4 text-xs bg-gray-100 border-2 rounded-md">
                  <div className="p-1 ml-4 text-xs">
                    <div className="form-control">
                      <label className="cursor-pointer label">
                      <span className="text-md label-text">
                        {task.title}
                      </span> 
                      <input
                        type="checkbox"
                        className="bg-purple-600 toggle"
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
            <div>
              <div className="text-center">
                <Link href={`/goals/${goal.id}`}>
                  <button className="p-1 m-1 text-xs text-center rounded-sm">
                    View more
                  </button>
                </Link>
              </div>
              <div className="text-end">
                {/* <button
                  className="m-1 text-white bg-purple-600 btn"
                  onClick={() => Route.push(`/goals/editGoal`)}
                >
                  Edit
                </button> */}
                {!showTaskActions && (
                  <button
                    className="m-1 text-white bg-red-600 btn"
                    onClick={() => deleteGoalMutation.mutateAsync({ id: goal.id })}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  );
}
