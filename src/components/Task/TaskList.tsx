import { useState, useEffect } from 'react';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa'

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
          <div className="p-1 text-center text-white bg-blue-400">
            {item.title}
          </div>
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

interface IUserTaskList {
  key: string;
  index: number;
  taskId: string;
}

export function UserTaskList(props: IUserTaskList) {
  const {
    // index,
    taskId
  } = props;
  const now = new Date()

  const [ isDisabled, toggleIsDisabled ] = useState(false)
  const [ isChecked, setIsChecked ] = useState(false)
  const [ taskEntryId, setTaskEntryId ] = useState("")
  const { data: taskData } = trpc.useQuery(['tasks.byId', { id: taskId }])
  const { data: taskEntriesData = [] } = trpc.useQuery(['taskEntry.byTaskId', { 
    id: taskId,
  }])

  const utils = trpc.useContext();

  const addTaskEntry = trpc.useMutation('taskEntry.add', {
    async onSuccess() {
      await utils.invalidateQueries(['tasks.byId']);
      await utils.invalidateQueries(['taskEntry.byTaskId']);
    },
  });

  const deleteTaskEntry = trpc.useMutation(['taskEntry.delete'], { 
    async onSuccess() {
      await utils.invalidateQueries('tasks.byId')
      await utils.invalidateQueries(['taskEntry.byTaskId']);
    },
  })

  useEffect(() => {
    if (taskEntriesData) {
      const id = taskEntriesData[0]?.["id"] || "";
      setTaskEntryId(id)
    }
  }, [taskEntriesData])

  // clunky way to get this working
  // TODO: make this better for when cadence/quantity are implemented
  useEffect(() => {
    if (taskEntriesData.length > 0) {
      setIsChecked(true)
    }
  }, [taskEntriesData])
  
  async function updateTaskEntry() {
    const updatedTask = taskData || {id: ""}

    if (!isChecked && (taskEntriesData.length === 0)) {
      const taskEntry = {
        date: now,
        updatedAt: now,
        taskId: updatedTask.id,
      // rating: 3,
      // duration: figureOutLater,
      // comment: "Default Comment",
      }

      addTaskEntry.mutateAsync(taskEntry);

    } else {

      deleteTaskEntry.mutateAsync({ id: taskEntryId })
      // const updatedDatesCompleted = updatedTask.datesCompleted.filter(
      //   (date: any) => (date !== selectedDate),
      // )
    //   updatedTask.datesCompleted = updatedDatesCompleted
    }
  }

  function checkForTodayEntry(entries: any) {
    const today = now.toLocaleDateString()

    for (let i = 0; i < entries.length; i++) {
      const entryDate = entries[i].date.toLocaleDateString();
      const isEqual = entryDate === today
      if (isEqual) return true
    }

    return false
  }

  async function handleChange() {
    toggleIsDisabled(true)
    
    // TODO: refine this into a query for quicker processing
    const exists = checkForTodayEntry(taskEntriesData)
    
    {!exists ? (
      console.log("Exists!")
      // check number against quantity & cadence values
    ) : (
      // no entries at all
      console.log("Done checking if it exists...")
    )}
    
    await updateTaskEntry(),
    setIsChecked(!isChecked)

    toggleIsDisabled(false)
  }

  if (!taskData) return <div>Loading...</div>

  return (
    <>
      <div key={taskData.id} className="flex justify-between mt-2 ml-4 text-2xl bg-gray-100 border-2 rounded-md form-input form-control">
        {taskData.title}
        {isChecked ? (
          <button
            disabled={isDisabled}
          >
            <FaToggleOn
              size="2.5rem"
              className="text-purple-600 toggle"
              onClick={handleChange}
            />
          </button>
        ) : (
          <button
            disabled={isDisabled}
          >
            <FaToggleOff
              size="2.5rem"
              className="text-purple-600 toggle"
              onClick={handleChange}
            />
          </button>
        )}
        {/* <input
          type="checkbox"
          className="bg-purple-600 toggle"
          checked={isChecked}
          onChange={handleChange}
        /> */}
      </div>
    </>
  )
}
