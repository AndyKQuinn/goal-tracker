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
  const { index, taskId } = props;

  console.log("Index: ", index, " : GoalID: ", taskId)

  const [ isChecked, setIsChecked ] = useState(false)
  // const tasksQuery = trpc.useQuery(['tasks.byGoalId', { id: goalId }]) || [];
  const { data } = trpc.useQuery(['tasks.byId', { id: taskId }])
  // const tasks = tasksQuery?.data || []

  console.log("TasksQuery.Data: ", data)
  // console.log("Task?: ", tasksQuery?.data.task)
  
  // return (
  //   <div>

  //   </div>
  // )

  if (!data) return <div>Loading...</div>

  // return data.map((task) => {
    return (
      <div key={data.id} className="flex justify-between mt-1 ml-4 bg-gray-100 border-2 rounded-md text-md form-input form-control">
        {data.title}
        <input
          type="checkbox"
          className="bg-purple-600 toggle"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
      </div>
    )
  // })
}
