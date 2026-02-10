'use client'

import TaskCard from '../../components/TaskCard'
import { useTasks } from '../../context/TaskContext'
import Link from 'next/link'

export default function TaskBoardPage() {
  const { tasks, moveTaskNext } = useTasks()

  const todoTasks = tasks.filter(t => t.status === 'todo')
  const doingTasks = tasks.filter(t => t.status === 'doing')
  const doneTasks = tasks.filter(t => t.status === 'done')

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '40px 24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 800,
                margin: 0,
                color: '#111827',
              }}
            >
              Task Board
            </h1>
            <p
              style={{
                fontSize: '15px',
                color: '#6b7280',
                marginTop: '6px',
              }}
            >
              ภาพรวมงานทั้งหมดในระบบ
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              href="/tasks/create"
              style={{
                padding: '12px 24px',
                background: '#4f46e5',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              + สร้างงานใหม่
            </Link>

            <Link
              href="/"
              style={{
                padding: '12px 24px',
                background: '#ffffff',
                color: '#111827',
                textDecoration: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                border: '1px solid #e5e7eb',
              }}
            >
              หน้าแรก
            </Link>
          </div>
        </header>

        {/* Board */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
          }}
        >
          <BoardColumn title="To Do" color="#64748b" count={todoTasks.length}>
            {todoTasks.map(task => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                status={task.status}
                onNext={moveTaskNext}
              />
            ))}
          </BoardColumn>

          <BoardColumn title="Doing" color="#f59e0b" count={doingTasks.length}>
            {doingTasks.map(task => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                status={task.status}
                onNext={moveTaskNext}
              />
            ))}
          </BoardColumn>

          <BoardColumn title="Done" color="#22c55e" count={doneTasks.length}>
            {doneTasks.map(task => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                status={task.status}
                onNext={moveTaskNext}
              />
            ))}
          </BoardColumn>
        </section>
      </div>
    </main>
  )
}

/* ===== Column ===== */
function BoardColumn({
  title,
  color,
  count,
  children,
}: {
  title: string
  color: string
  count: number
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        minHeight: '520px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: '1px solid #e5e7eb',
        borderTop: `6px solid ${color}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 700,
            color: '#111827',
          }}
        >
          {title}
        </h2>
        <span
          style={{
            background: color,
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          {count}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {count === 0 ? (
          <div
            style={{
              textAlign: 'center',
              marginTop: '80px',
              color: '#9ca3af',
              fontSize: '14px',
            }}
          >
            ไม่มีงานในสถานะนี้
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
