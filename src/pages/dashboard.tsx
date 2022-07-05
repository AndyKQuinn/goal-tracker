import UserGoalsWithTasks from '../components/Goal/UserGoalsWithTasks';
// import Link from 'next/link'

export default function Dashboard() {
  return (
    <div>
      <div className="p-2 text-lg text-center text-white bg-purple-600">
        Dashboard
      </div>
      <UserGoalsWithTasks />
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
