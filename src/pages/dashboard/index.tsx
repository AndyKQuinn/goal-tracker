// import UserGoalsWithTasks from '~/components/Goal/UserGoalsWithTasks';
// import Link from 'next/link'

export default function Dashboard() {
  return (
    <div>
      <div className="p-2 m-2 font-serif text-4xl tracking-wider text-center text-white border-b-4 border-b-purple-900">
        Dashboard
      </div>
      <div className="p-4 text-2xl text-center text-white">
        Coming soon!
      </div>
      {/* <UserGoalsWithTasks /> */}
      {/* <div className="p-1 mt-6 text-center">
        <Link href="/goals/createGoal">
          <button
            className="m-1 text-white bg-purple-600 btn"
          >
            New Goal
          </button>
        </Link>
        <Link href="/tasks/createTask">
          <button
            className="text-white bg-purple-600 btn"
          >
            Add Task
          </button>
        </Link>
      </div> */}
    </div>
  );
}
