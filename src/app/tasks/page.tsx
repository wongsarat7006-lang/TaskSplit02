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
        background: 'linear-gradient(to bottom, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
        padding: '32px 24px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* ส่วนหัว */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 700,
                margin: 0,
                color: '#1a1a1a',
              }}
            >
              📋 บอร์ดงาน
            </h1>
            <p
              style={{
                fontSize: '15px',
                color: '#78716c',
                margin: '6px 0 0 0',
              }}
            >
              จัดการและติดตามงานทั้งหมดของคุณ
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              href="/tasks/create"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
              }}
            >
              + สร้างงานใหม่
            </Link>
            <Link
              href="/"
              style={{
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#1a1a1a',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                border: '2px solid rgba(0,0,0,0.1)',
              }}
            >
              หน้าแรก
            </Link>
          </div>
        </div>

        {/* คอลัมน์งานทั้งหมด */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {/* คอลัมน์ต้องทำ */}
          <section style={columnStyle}>
            <div style={columnHeaderStyle}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>
                📝 ต้องทำ
              </h2>
              <span style={badgeStyle}>
                {todoTasks.length}
              </span>
            </div>
            <div style={taskListStyle}>
              {todoTasks.length === 0 ? (
                <div style={emptyStateStyle}>ไม่มีงานในขณะนี้</div>
              ) : (
                todoTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    status={task.status}
                    onNext={moveTaskNext}
                  />
                ))
              )}
            </div>
          </section>

          {/* คอลัมน์กำลังทำ */}
          <section style={columnStyle}>
            <div style={columnHeaderStyle}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>
                ⚙️ กำลังทำ
              </h2>
              <span style={badgeStyle}>
                {doingTasks.length}
              </span>
            </div>
            <div style={taskListStyle}>
              {doingTasks.length === 0 ? (
                <div style={emptyStateStyle}>ไม่มีงานในขณะนี้</div>
              ) : (
                doingTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    status={task.status}
                    onNext={moveTaskNext}
                  />
                ))
              )}
            </div>
          </section>

          {/* คอลัมน์เสร็จแล้ว */}
          <section style={columnStyle}>
            <div style={columnHeaderStyle}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>
                ✅ เสร็จแล้ว
              </h2>
              <span style={badgeStyle}>
                {doneTasks.length}
              </span>
            </div>
            <div style={taskListStyle}>
              {doneTasks.length === 0 ? (
                <div style={emptyStateStyle}>ไม่มีงานในขณะนี้</div>
              ) : (
                doneTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    status={task.status}
                    onNext={moveTaskNext}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

// สไตล์คอลัมน์งาน
const columnStyle = {
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid rgba(0,0,0,0.05)',
  minHeight: '500px',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '16px',
}

// สไตล์ส่วนหัวคอลัมน์
const columnHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '16px',
  borderBottom: '2px solid #f3f4f6',
}

// สไตล์แบดจ์นับจำนวน
const badgeStyle = {
  background: 'rgba(124, 58, 237, 0.1)',
  color: '#7c3aed',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '13px',
  fontWeight: 700,
}

// สไตล์รายการงาน
const taskListStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px',
  flex: 1,
}

// สไตล์เมื่อไม่มีงาน
const emptyStateStyle = {
  textAlign: 'center' as const,
  padding: '60px 20px',
  color: '#9ca3af',
  fontSize: '14px',
}