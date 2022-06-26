import { GoalsList } from './goal';

export default function Dashboard() {
  return (
    <div>
      <h2 className="p-2 text-center">Dashboard</h2>
      <GoalsList />
    </div>
  );
}