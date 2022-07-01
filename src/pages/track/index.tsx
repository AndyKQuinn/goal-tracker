// import { useState } from 'react'
import { AllGoalsWithTasksByUser } from '../../components/Goal/GoalList'
import GoalForm from '../../components/Goal/GoalForm'
import TaskForm from '../../components/Task/TaskForm'

export default function Track() {
  // const [showConfigView, setShowConfigView] = useState(false)

  return (
    <div>
      <AllGoalsWithTasksByUser />
      <GoalForm />
      <TaskForm />
    </div>
  );
}
