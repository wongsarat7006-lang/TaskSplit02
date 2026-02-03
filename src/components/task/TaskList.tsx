import { tasks } from '../../data/tasks'
import TaskCard from './TaskCard'

export default function TaskList() {
  return (
    <div>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
