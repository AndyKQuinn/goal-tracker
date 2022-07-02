import GoalList from '../components/Goal/GoalList';
import Link from 'next/link'

export default function Dashboard() {
  return (
    <div>
      <div className="p-2 mt-2 text-lg text-center">
        Dashboard
      </div>
      <div className="p-1 text-center">
        <Link href="/goals/createGoal">
          <button
            className="m-1 text-white bg-purple-600 btn"
          >
            New Goal
          </button>
        </Link>
        <Link href="/goals/createGoal">
          <button
            className="text-white bg-purple-600 btn"
          >
            Add Task
          </button>
        </Link>
      </div>
      <GoalList />
    </div>
  );
}
