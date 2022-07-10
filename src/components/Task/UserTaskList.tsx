import { useState, useEffect } from 'react';
import { trpc } from '../../utils/trpc';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa'

interface IUserTaskList {
  key: string;
  taskId: string;
  selectedDate: Date;
}

export default function UserTaskList(props: IUserTaskList) {
  const { taskId, selectedDate } = props;
  const now = new Date()
  const utils = trpc.useContext();

  const [ isChecked, setIsChecked ] = useState(false)
  const [ taskEntryId, setTaskEntryId ] = useState("")
  const { data: taskData } = trpc.useQuery(['tasks.byId', { id: taskId }])
  const { data: taskEntriesData } = trpc.useQuery(['taskEntry.byTaskId', { 
    id: taskId,
  }])

  console.log("Entries: ", taskEntriesData)

  const addTaskEntry = trpc.useMutation('taskEntry.add', { 
    onSuccess() {
      utils.invalidateQueries(['tasks.byId']);
      utils.invalidateQueries(['taskEntry.byTaskId']);
    }
  })
  const deleteTaskEntry = trpc.useMutation(['taskEntry.delete'], { 
    onSuccess() {
      utils.invalidateQueries(['tasks.byId']);
      utils.invalidateQueries(['taskEntry.byTaskId']);
    }
  })

  useEffect(() => {
    if (taskEntriesData) {
      for (let i = 0; i < taskEntriesData.length; i++) {
        const entry = taskEntriesData[i]
        if (entry?.date.toLocaleDateString() === selectedDate.toLocaleDateString()) {
          console.log("True: ", entry?.date.toLocaleDateString(), " | ", selectedDate.toLocaleDateString())
          setIsChecked(true)
          setTaskEntryId(entry.id)
          break
        } else {
          console.log("False: ", entry?.date.toLocaleDateString(), " | ", selectedDate.toLocaleDateString())
          setIsChecked(false)
        }
      }
    }
  }, [selectedDate, taskEntriesData])

  async function handleChange() {
    if (isChecked) {
      deleteTaskEntry.mutateAsync({ id: taskEntryId })
    } else {
      const entry = {
        date: selectedDate,
        updatedAt: now,
        taskId: taskData?.id || "emptyTaskId",
      }
      addTaskEntry.mutateAsync(entry);
    }
  }

  if (!taskData) return <div>Loading...</div>

  return (
    <div key={taskData.id} className="flex justify-between mt-2 ml-4 text-2xl bg-gray-100 border-2 rounded-md form-input form-control">
      {taskData.title}
      {isChecked ? (
        <button>
          <FaToggleOn
            size="2.5rem"
            className="text-purple-600 toggle"
            onClick={handleChange}
          />
        </button>
      ) : (
        <button>
          <FaToggleOff
            size="2.5rem"
            className="text-purple-600 toggle"
            onClick={handleChange}
          />
        </button>
      )}
    </div>
  )
}
