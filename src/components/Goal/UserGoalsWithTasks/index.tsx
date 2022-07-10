import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { trpc } from '~/utils/trpc';
import Link from 'next/link';
import Router from 'next/router';
import { BsInfoCircle, BsCalendarDate } from 'react-icons/bs'
import { AiFillDelete, AiOutlineDown, AiOutlineUp } from 'react-icons/ai'
import { IoIosAddCircle, IoIosAddCircleOutline } from 'react-icons/io'
import UserTaskList from '~/components/Task/UserTaskList'
import DatePicker from '~/components/shared/DatePicker'

export default function UserGoalsWithTasks() {
  const today = new Date()
  const utils = trpc.useContext();
  const [ showDatePicker, toggleShowDatePicker ] = useState(false)
  const [ showGoalActions, toggleShowGoalActions] = useState(false)
  const [ showTrackActions, toggleShowTrackActions ] = useState(false)
  const [selectedDate, setSelectedDate] = useState(today);
 
  const { user } = useUser();
  const id = user?.sub || ""
  
  const goalsQuery = trpc.useQuery(['goals.byUserId', { createdBy: id }])
  const goals = goalsQuery?.data || []

  const deleteGoal = trpc.useMutation(['goals.delete'], { 
    onSuccess: () => {
      utils.invalidateQueries('goals.byUserId')
    },
  })

  // useEffect(() => {
  //   if (goalsQuery?.data.length > 0) {
  //     for (const { id } of goalsQuery.data ?? []) {
  //       utils.prefetchQuery(['goals.byGoalId', { id }]);
  //     }
  //   }
  // }, [goalsQuery, utils])

  function handleDateChange(date: Date) {
    console.log("New Date: ", date)
    setSelectedDate(date)
  }
  
  if (goalsQuery.status === "loading") return <div>Loading...</div>

  return (
    <div className="p-1 mt-1">
      <div className="flex justify-between mr-1">
        {showDatePicker ? (
          <BsCalendarDate
            className="p-1 mt-1 mr-1 text-purple-600 bg-white rounded-md"
            size="2.5rem"
            onClick={() => toggleShowDatePicker(!showDatePicker)}
          />
        ) : (
          <BsCalendarDate
            className="p-1 mt-1 mr-1 text-white bg-purple-600 rounded-md"
            size="2.5rem"
            onClick={() => toggleShowDatePicker(!showDatePicker)}
          />
        )}
        {showTrackActions ? (
          <IoIosAddCircleOutline
            className="mt-1 mr-1 text-purple-600 bg-white rounded-3xl"
            size="2.5rem"
            onClick={() => toggleShowTrackActions(!showTrackActions)}
            />
        ) : (
          <IoIosAddCircle
            className="mt-1 mr-1 text-purple-600 bg-white rounded-3xl"
            size="2.5rem"
            onClick={() => toggleShowTrackActions(!showTrackActions)}
          />
        )}
      </div>
      {showDatePicker && (
        <>
          <div className="text-2xl text-center text-white">Switch Date</div>
          <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} today={today} />
        </>
      )}
      {showTrackActions && (
        <div className="absolute p-8 mt-2 mr-2 border-4 rounded-lg bg-grey-800 right-12">
          <div className="flex flex-col">
            <button
              className="p-4 mb-6 text-2xl text-center text-white bg-purple-600 border-4 border-white shadow-2xl right-12 rounded-xl"
              onClick={() => Router.push("/goals/createGoal")}
            >
              Create Goal
            </button>
            <button
              className="p-4 text-2xl text-center text-white bg-purple-600 border-4 border-white shadow-2xl right-12 rounded-xl"
              onClick={() => Router.push("/tasks/createTask")}
            >
              Add Task
            </button>
          </div>
        </div>
      )}
      {goals?.map((goal) => {
        return (
          <article className="p-1 mt-4 border-2 border-purple-200 rounded-md shadow-md" key={goal.id}>
            <div className="flex items-center justify-between p-2 text-2xl text-white bg-purple-600 border-2 rounded-md">
              <span className="ml-2">{goal.title}</span>
              <Link href={`/goals/${goal.id}`}>
                <button>
                  <BsInfoCircle />
                </button>
              </Link>
            </div>
            {goal?.tasks.map((task) => {
              return <UserTaskList key={task.id} taskId={task.id} selectedDate={selectedDate} />
            })}
            <div className="flex justify-end">
              <button className="p-2 font-serif text-xl text-white" onClick={() => toggleShowGoalActions(!showGoalActions)}>
                {showGoalActions ? (
                  <AiOutlineUp
                    className="p-1 m-1 text-2xl text-white bg-purple-600 rounded-2xl"
                  />
                ) : (
                  <AiOutlineDown
                    className="p-1 m-1 text-2xl text-white bg-purple-600 rounded-2xl"
                  />
                )}
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
                  className="p-1 m-1 text-xl text-red-800"
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
