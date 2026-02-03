import { Task } from '../../types/task'

type Props = {
  task: Task
}

export default function TaskCard({ task }: Props) {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '12px',
        marginBottom: '8px',
      }}
    >
      {task.title}
    </div>
  )
}
