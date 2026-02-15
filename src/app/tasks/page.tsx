'use client'

import { useState } from 'react'
import TaskCard from '../../components/task/TaskCard'
import { useTasks } from '../../context/TaskContext'
import Link from 'next/link'

export default function TaskBoardPage() {
  const { tasks, isDarkMode } = useTasks() // ดึงค่าธีมมาจาก Context
  const [searchTerm, setSearchTerm] = useState('')

  // กำหนดธีมสีให้สัมพันธ์กับค่า isDarkMode
  const theme = {
    bg: isDarkMode ? '#121212' : '#f8fafc',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#f3f4f6' : '#111827',
    border: isDarkMode ? '#333333' : '#e5e7eb',
    inputBg: isDarkMode ? '#2d2d2d' : '#ffffff',
    subText: isDarkMode ? '#9ca3af' : '#64748b'
  }

  const filteredTasks = tasks.filter((task) => {
    const searchLower = searchTerm.toLowerCase()
    return task.title.toLowerCase().includes(searchLower)
  })

  const todoTasks = filteredTasks.filter(t => t.status === 'todo')
  const doingTasks = filteredTasks.filter(t => t.status === 'doing')
  const doneTasks = filteredTasks.filter(t => t.status === 'done')

  return (
    <main
      style={{
        minHeight: '100vh',
        background: theme.bg,
        padding: '40px 24px',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header - เอาปุ่มโปรไฟล์ออกแล้ว */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: theme.text, marginBottom: '16px' }}>
              Task Board
            </h1>
            
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#9ca3af' }}>🔍</span>
              <input
                type="text"
                placeholder="ค้นหางานของคุณ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '10px 10px 10px 40px',
                  width: '350px',
                  borderRadius: '12px',
                  border: `1px solid ${theme.border}`,
                  background: theme.inputBg,
                  color: theme.text,
                  outline: 'none',
                  transition: '0.3s'
                }}
              />
            </div>
          </div>

          <div>
            <Link href="/tasks/create" style={primaryButtonStyle}>
              + สร้างงานใหม่
            </Link>
          </div>
        </header>

        {/* Board Section */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          <BoardColumn title="To Do" color="#64748b" count={todoTasks.length} theme={theme}>
            {todoTasks.map(task => <TaskCard key={task.id} task={task} />)}
          </BoardColumn>

          <BoardColumn title="Doing" color="#f59e0b" count={doingTasks.length} theme={theme}>
            {doingTasks.map(task => <TaskCard key={task.id} task={task} />)}
          </BoardColumn>

          <BoardColumn title="Done" color="#22c55e" count={doneTasks.length} theme={theme}>
            {doneTasks.map(task => <TaskCard key={task.id} task={task} />)}
          </BoardColumn>
        </section>
      </div>
    </main>
  )
}

function BoardColumn({ title, color, count, children, theme }: any) {
  return (
    <div style={{ 
      background: theme.card, 
      borderRadius: '20px', 
      padding: '24px', 
      minHeight: '600px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px', 
      border: `1px solid ${theme.border}`, 
      borderTop: `8px solid ${color}`,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: theme.text }}>{title}</h2>
        <span style={{ 
          background: color, 
          color: '#fff', 
          padding: '4px 14px', 
          borderRadius: '999px', 
          fontSize: '14px', 
          fontWeight: 800 
        }}>{count}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {count === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '100px', color: '#9ca3af', fontSize: '15px' }}>
            ไม่มีรายการงาน
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

const primaryButtonStyle = {
  padding: '14px 28px',
  background: '#2563eb',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '12px',
  fontSize: '15px',
  fontWeight: 700,
  boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
}