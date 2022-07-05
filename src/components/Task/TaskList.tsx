import { useState, useEffect } from 'react';
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

  const today = new Date()

  const [ isChecked, setIsChecked ] = useState(false)
  const [ taskEntryId, setTaskEntryId ] = useState("")
  const { data: taskData } = trpc.useQuery(['tasks.byId', { id: taskId }])
  const { data: taskEntriesData = [] } = trpc.useQuery(['taskEntry.byTaskId', { id: taskId }])

  const utils = trpc.useContext();

  const addTaskEntry = trpc.useMutation('taskEntry.add', {
    async onSuccess() {
      await utils.invalidateQueries(['tasks.byId']);
    },
  });

  const deleteTaskEntry = trpc.useMutation(['taskEntry.delete'], { 
    onSuccess: () => {
      utils.invalidateQueries('taskEntry.byTaskId')
    },
  })

  useEffect(() => {
    if (taskEntriesData) {
      const id = taskEntriesData[0]?.["id"] || "";
      setTaskEntryId(id)
    }
  }, [taskEntriesData])
  console.log("*** TASK ENTRIES ***: ", taskEntriesData)

  // clunky way to get this working
  // TODO: make this better for when cadence/quantity are implemented
  useEffect(() => {
    if (taskEntriesData.length > 0) {
      setIsChecked(true)
    }
  }, [taskEntriesData])
  
  async function updateTaskEntry() {
    const updatedTask = taskData || {id: ""}
    console.log("Updated Task: ", updatedTask)

    if (!isChecked && (taskEntriesData.length === 0)) {
      const taskEntry = {
        date: today,
        updatedAt: today,
        taskId: updatedTask.id,
      // rating: 3,
      // duration: figureOutLater,
      // comment: "Default Comment",
      }

      await addTaskEntry.mutateAsync(taskEntry);

    } else {

      await deleteTaskEntry.mutateAsync({ id: taskEntryId })
      // const updatedDatesCompleted = updatedTask.datesCompleted.filter(
      //   (date: any) => (date !== selectedDate),
      // )
    //   updatedTask.datesCompleted = updatedDatesCompleted
    }
  }

  function handleChange() {
    updateTaskEntry()
    setIsChecked(!isChecked)
  }

  console.log("TasksQuery.Data: ", taskData)

  if (!taskData) return <div>Loading...</div>

    return (
      <div key={taskData.id} className="flex justify-between mt-1 ml-4 bg-gray-100 border-2 rounded-md text-md form-input form-control">
        {taskData.title}
        <input
          type="checkbox"
          className="bg-purple-600 toggle"
          checked={isChecked}
          onChange={handleChange}
        />
      </div>
    )
  // })
}
