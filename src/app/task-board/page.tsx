'use client'
import TaskCard from '../../components/task/TaskCard'
import { useTasks } from '../../context/TaskContext'

export default function TaskBoardPage() {
  const { tasks, moveTaskNext } = useTasks()

  const todoTasks = tasks.filter(t => t.status === 'todo')
  const doingTasks = tasks.filter(t => t.status === 'doing')
  const doneTasks = tasks.filter(t => t.status === 'done')

  return (
    <main style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>
        Task Board
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}
      >
        <section style={columnStyle}>
          <h2>📝 Todo</h2>
          {todoTasks.map(task => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              status={task.status}
              onNext={moveTaskNext}
            />
          ))}
        </section>

        <section style={columnStyle}>
          <h2>⚙️ Doing</h2>
          {doingTasks.map(task => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              status={task.status}
              onNext={moveTaskNext}
            />
          ))}
        </section>

        <section style={columnStyle}>
          <h2>✅ Done</h2>
          {doneTasks.map(task => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              status={task.status}
              onNext={moveTaskNext}
            />
          ))}
        </section>
      </div>
    </main>
  )
}

const columnStyle = {
  background: '#f9f9f9',
  padding: '16px',
  borderRadius: '12px',
  minHeight: '300px',
  display: 'grid',
  gap: '12px',
}
