import TaskForm from '../../components/Task/TaskForm'
import TaskList from '../../components/Task/TaskList'

export default function TasksView() {
  return (
    <div>
      Tasks
      <TaskList />
      <TaskForm />
    </div>
  )
}
