import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { trpc } from '../../../utils/trpc';
import Link from 'next/link';
import { BsInfoCircle } from 'react-icons/bs'
import { AiFillDelete } from 'react-icons/ai'
import { UserTaskList } from '../../Task/TaskList'

export default function UserGoalsWithTasks() {
  const utils = trpc.useContext();
  const [ showActions, toggleShowActions] = useState(false)
 
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
            <div className="flex items-center justify-between p-2 text-lg text-white bg-purple-600 border-2 rounded-md">
              <span>Goal: {goal.title}</span>
              <Link href={`/goals/${goal.id}`}>
                <button>
                  <BsInfoCircle />
                </button>
              </Link>
            </div>
            {goal?.tasks.map((task, index: number) => {
              return <UserTaskList key={goal.id} index={index} taskId={task.id} />
            })}
            <div className="flex justify-end">
              <button className="p-1 text-xs text-white" onClick={() => toggleShowActions(!showActions)}>
                {showActions ? "Hide Actions" : "Show Actions"}
              </button>
            </div>
            {showActions && (
              <div className="flex justify-end">
                {/* <button
                  className="m-1 text-white bg-purple-600 btn"
                  onClick={() => Route.push(`/goals/editGoal`)}
                >
                  Edit
                </button> */}
                <button
                  className="p-1 m-1 text-red-600"
                  onClick={() => deleteGoalMutation.mutateAsync({ id: goal.id })}
                >
                  <AiFillDelete />
                </button>
              </div>
            )}
          </article>
        )
      })}
    </div>
  );
}
