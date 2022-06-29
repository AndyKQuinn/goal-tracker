import { useState } from 'react'
import GoalList from '../../components/Goal/GoalList'
import GoalForm from '../../components/Goal/GoalForm'
import TaskList from '../../components/Task/TaskList'
import TaskForm from '../../components/Task/TaskForm'

export default function Track() {
  const [showConfigView, setShowConfigView] = useState(false)

  return (
    <div>
      <GoalList />
      <GoalForm />
      <TaskList />
      <TaskForm />
    </div>
  );
}
