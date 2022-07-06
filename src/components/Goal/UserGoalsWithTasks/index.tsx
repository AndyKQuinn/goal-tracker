import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { trpc } from '~/utils/trpc';
import Link from 'next/link';
import Router from 'next/router';
import { BsInfoCircle } from 'react-icons/bs'
import { AiFillDelete } from 'react-icons/ai'
import { IoIosAddCircle } from 'react-icons/io'
import { UserTaskList } from '../../Task/TaskList'

export default function UserGoalsWithTasks() {
  const utils = trpc.useContext();
  const [ showGoalActions, toggleShowGoalActions] = useState(false)
  const [ showTrackActions, toggleShowTrackActions ] = useState(false)
 
  const { user } = useUser();
  const id = user?.sub || ""
  
  const goalsQuery = trpc.useQuery(['goals.byUserId', { createdBy: id }])
  const goals = goalsQuery?.data || []

  const deleteGoal = trpc.useMutation(['goals.delete'], { 
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
    <div className="p-1 mt-1">
      <div className="flex justify-end mr-1">
        <IoIosAddCircle
          className="mt-1 mr-1 text-purple-600 bg-white rounded-xl"
          size="1.5rem"
          onClick={() => toggleShowTrackActions(!showTrackActions)}
        />
      </div>
      {showTrackActions && (
        <div className="absolute p-8 mt-2 mr-2 bg-gray-800 border-4 rounded-lg right-10">
          <div className="flex flex-col">
            <button
              className="p-4 mb-6 text-2xl text-center text-white bg-purple-600 border-4 border-white right-12 rounded-xl"
              onClick={() => Router.push("/goals/createGoal")}
            >
              Create Goal
            </button>
            <button
              className="p-4 text-2xl text-center text-white bg-purple-600 border-4 border-white right-12 rounded-xl"
              onClick={() => Router.push("/tasks/createTask")}
            >
              Add Task
            </button>
          </div>
        </div>
      )}
      {goals?.map((goal) => {
        console.log("GoalID: ", goal.id)
        return (
          <article className="p-1 mt-4 border-2 border-purple-200 rounded-md shadow-md" key={goal.id}>
            <div className="flex items-center justify-between p-2 text-2xl text-white bg-purple-600 border-2 rounded-md">
              <span>Goal: {goal.title}</span>
              <Link href={`/goals/${goal.id}`}>
                <button>
                  <BsInfoCircle />
                </button>
              </Link>
            </div>
            {goal?.tasks.map((task, index: number) => {
              return <UserTaskList key={task.id} index={index} taskId={task.id} />
            })}
            <div className="flex justify-end">
              <button className="p-1 font-serif text-xl text-white" onClick={() => toggleShowGoalActions(!showGoalActions)}>
                {showGoalActions ? "Hide Actions" : "Show Actions"}
              </button>
            </div>
            {showGoalActions && (
              <div className="flex justify-end">
                {/* <button
                  className="m-1 text-white bg-purple-600 btn"
                  onClick={() => Route.push(`/goals/editGoal`)}
                >
                  Edit
                </button> */}
                <button
                  className="p-1 m-1 text-red-600"
                  onClick={() => deleteGoal.mutateAsync({ id: goal.id })}
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
