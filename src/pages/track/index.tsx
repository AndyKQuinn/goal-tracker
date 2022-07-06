import { useEffect } from 'react'
import UserGoalsWithTasks from '../../components/Goal/UserGoalsWithTasks'
// import GoalForm from '../../components/Goal/GoalForm'
// import TaskForm from '../../components/Task/TaskForm'

import { trpc } from '../../utils/trpc';
import { useUser } from '@auth0/nextjs-auth0';

export default function Track() {
  // const [showConfigView, setShowConfigView] = useState(false)

  const utils = trpc.useContext();

  const { user } = useUser();
  const id = user?.sub || "defaultUser"
  const goalsQuery = trpc.useQuery(['goals.byUserId', { createdBy: id }])

  // console.log("User Goals: ", goalsQuery.data)
  // const goals = goalsQuery?.data

  useEffect(() => {
    for (const { id } of goalsQuery.data ?? []) {
      utils.prefetchQuery(['goals.byGoalId', { id }]);
    }
  }, [goalsQuery.data, utils]);

  if (goalsQuery?.status === 'loading') {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <>
      <div className="p-2 m-2 font-serif text-4xl tracking-wider text-center text-white border-b-4 border-b-purple-900">
        Track
      </div>
      <UserGoalsWithTasks />
    </>
  );
}
