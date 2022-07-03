import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';

export function AllGoalsWithTasks() {
  const goalsQuery = trpc.useQuery(['goals.all']);
  const utils = trpc.useContext();

  const goals = goalsQuery?.data

  useEffect(() => {
    for (const { id } of goalsQuery.data ?? []) {
      utils.prefetchQuery(['goals.byGoalId', { id }]);
    }
  }, [goalsQuery.data, utils]);

  return (
    <div className="p-1">
      {goalsQuery.status === 'loading' && '(loading)'}
      {goals?.map((goal) => (
        <article className="p-1 mt-1 border-2 border-purple-200 rounded-md shadow-md" key={goal.id}>
          <h3 className="p-2 text-white bg-purple-600 border-2 rounded-md">
            Goal: {goal.title}
          </h3>
          {goal?.tasks.map((task) => (
            <div key={task.id} className="p-1 ml-2 text-xs bg-gray-200">
              Task {task.id}
              <div className="ml-4 text-xs">
                <div>Title: {task.title}</div>
                <div>Description: {task.description}</div>
                <div>Cadence: {task.cadence}</div>
                <div>Quantity: {task.quantity}</div>
              </div>
            </div>
          ))}
          <Link href={`/goal/${goal.id}`}>
            <div className="p-1 text-xs text-center text-purple-800">
              View more
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

export function AllGoals() {
  const goalsQuery = trpc.useQuery(['goals.all']);
  const utils = trpc.useContext();

  useEffect(() => {
    for (const { id } of goalsQuery.data ?? []) {
      utils.prefetchQuery(['goals.byGoalId', { id }]);
    }
  }, [goalsQuery.data, utils]);

  return (
    <div className="p-1">
      {goalsQuery.status === 'loading' && '(loading)'}
      {goalsQuery.data?.map((goal) => (
        <article className="p-1 mt-1 border-2 border-purple-200 rounded-md shadow-md" key={goal.id}>
        <h3 className="p-2 text-white bg-purple-600 border-2 rounded-md">
          Goal: {goal.title}
        </h3>
        </article>
      ))}
    </div>
  );
}

export default function AllGoalsWithTasksByUser() {
  const utils = trpc.useContext();
  const [ isChecked, setIsChecked ] = useState(false)

  const { user } = useUser();
  const id = user?.sub || "defaultUser"
  
  const goalsQuery = trpc.useQuery(['goals.byUserId', { createdBy: id }])
  const goals = goalsQuery?.data

  const deleteGoalMutation = trpc.useMutation(['goals.delete'], { 
    onSuccess: () => {
      utils.invalidateQueries('goals.byUserId')
    },
  })

  useEffect(() => {
    for (const { id } of goalsQuery.data ?? []) {
      utils.prefetchQuery(['goals.byGoalId', { id }]);
    }
  }, [goalsQuery.data, utils]);

  return (
    <div className="p-1">
      {goalsQuery.status === 'loading' && '(loading)'}
      {goals?.map((goal: any) => (
        <article className="p-1 mt-1 border-2 border-purple-200 rounded-md shadow-md" key={goal.id}>
          <h3 className="p-2 text-white bg-purple-600 border-2 rounded-md">
            Goal: {goal.title}
          </h3>
          {goal?.tasks.map((task: any) => (
            <div key={task.id} className="mt-1 ml-4 text-xs bg-gray-100 border-2 rounded-md">
              <div className="p-1 ml-4 text-xs">
                <div className="form-control">
                  <label className="cursor-pointer label">
                    <span className="label-text">{task.title}</span> 
                    <input
                      type="checkbox"
                      className="bg-purple-600 toggle"
                      checked={isChecked}
                      onClick={() => setIsChecked(!isChecked)}
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
              <button
                className="m-1 text-white bg-red-600 btn"
                onClick={() => deleteGoalMutation.mutateAsync({ id: goal.id })}
              >
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
