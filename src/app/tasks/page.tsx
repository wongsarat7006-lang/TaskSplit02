'use client'

import { useTasks } from '../../context/TaskContext'
import TaskCard from '../../components/TaskCard'

export default function TaskBoardPage() {
  const { tasks, moveTaskNext } = useTasks()

  const todoTasks = tasks.filter(t => t.status === 'todo')
  const doingTasks = tasks.filter(t => t.status === 'doing')
  const doneTasks = tasks.filter(t => t.status === 'done')

  return (
    <main
      style={{
        padding: '24px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>
        📋 Task Board
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}
      >
        <Column title="📝 Todo">
          {todoTasks.length === 0 && <EmptyText />}
          {todoTasks.map(task => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              status={task.status}
              onNext={moveTaskNext}
            />
          ))}
        </Column>

        <Column title="⚙️ Doing">
          {doingTasks.length === 0 && <EmptyText />}
          {doingTasks.map(task => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              status={task.status}
              onNext={moveTaskNext}
            />
          ))}
        </Column>

        <Column title="✅ Done">
          {doneTasks.length === 0 && (
  <EmptyText text="No completed tasks" />
)}
          {doneTasks.map(task => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              status={task.status}
              onNext={moveTaskNext}
            />
          ))}
        </Column>
      </div>
    </main>
  )
}

/* ================= COMPONENTS ================= */

function Column({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      style={{
        background: '#f9f9f9',
        padding: '16px',
        borderRadius: '12px',
        minHeight: '300px',
        display: 'grid',
        gap: '12px',
      }}
    >
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function EmptyText({ text = 'No tasks' }: { text?: string }) {
  return (
    <p
      style={{
        color: '#999',
        fontSize: '14px',
        marginTop: '8px',
      }}
    >
      {text}
    </p>
  )
}

