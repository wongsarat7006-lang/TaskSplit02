'use client'

import { useState } from 'react'
import TaskCard from '../../components/task/TaskCard'
import { useTasks } from '../../context/TaskContext'
import Link from 'next/link'

export default function TaskBoardPage() {
  const { tasks, moveTaskNext, isDarkMode, toggleDarkMode } = useTasks()
  const [searchTerm, setSearchTerm] = useState('')

  // กำหนดธีมสี
  const theme = {
    bg: isDarkMode ? '#121212' : '#f8fafc',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#f3f4f6' : '#111827',
    border: isDarkMode ? '#333333' : '#e5e7eb',
    inputBg: isDarkMode ? '#2d2d2d' : '#ffffff'
  }

  const filteredTasks = tasks.filter((task) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      task.title.toLowerCase().includes(searchLower) ||
      (task.assignee && task.assignee.toLowerCase().includes(searchLower))
    )
  })

  const todoTasks = filteredTasks.filter(t => t.status === 'todo')
  const doingTasks = filteredTasks.filter(t => t.status === 'doing')
  const doneTasks = filteredTasks.filter(t => t.status === 'done')

  return (
    <main
      style={{
        minHeight: '100vh',
        background: theme.bg, // ใช้สีตามธีม
        padding: '40px 24px',
        transition: 'background 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '40px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: theme.text }}>
              Task Board
            </h1>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '20px' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#9ca3af' }}>🔍</span>
                <input
                  type="text"
                  placeholder="ค้นหางาน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '10px 10px 10px 40px',
                    width: '300px',
                    borderRadius: '10px',
                    border: `1px solid ${theme.border}`,
                    background: theme.inputBg,
                    color: theme.text,
                    outline: 'none',
                  }}
                />
              </div>

              {/* ปุ่มสลับโหมดมืด */}
              <button 
                onClick={toggleDarkMode}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: `1px solid ${theme.border}`,
                  background: theme.card,
                  cursor: 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/tasks/create" style={primaryButtonStyle}>+ สร้างงานใหม่</Link>
            <Link href="/profile" style={{ ...whiteButtonStyle, background: theme.card, color: theme.text, border: `1px solid ${theme.border}` }}>โปรไฟล์</Link>
          </div>
        </header>

        {/* Board Section */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
          }}
        >
          {/* To Do Column */}
          <BoardColumn title="To Do" color="#64748b" count={todoTasks.length} theme={theme}>
            {todoTasks.map(task => (
              <TaskCard key={task.id} {...task} onNext={moveTaskNext} />
            ))}
          </BoardColumn>

          {/* Doing Column */}
          <BoardColumn title="Doing" color="#f59e0b" count={doingTasks.length} theme={theme}>
            {doingTasks.map(task => (
              <TaskCard key={task.id} {...task} onNext={moveTaskNext} />
            ))}
          </BoardColumn>

          {/* Done Column */}
          <BoardColumn title="Done" color="#22c55e" count={doneTasks.length} theme={theme}>
            {doneTasks.map(task => (
              <TaskCard key={task.id} {...task} onNext={moveTaskNext} />
            ))}
          </BoardColumn>
        </section>
      </div>
    </main>
  )
}

/* === ส่วนของ Component ย่อย (คงความยาวเหมือนเดิม) === */

function BoardColumn({ title, color, count, children, theme }: any) {
  return (
    <div style={{ 
      background: theme.card, 
      borderRadius: '16px', 
      padding: '20px', 
      minHeight: '520px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px', 
      border: `1px solid ${theme.border}`, 
      borderTop: `6px solid ${color}`,
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: theme.text }}>{title}</h2>
        <span style={{ background: color, color: '#fff', padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700 }}>{count}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {count === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '80px', color: '#9ca3af', fontSize: '14px' }}>ไม่พบงานที่ค้นหา</div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

const primaryButtonStyle = {
  padding: '12px 24px',
  background: '#4f46e5',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 600,
}

const whiteButtonStyle = {
  padding: '12px 24px',
  textDecoration: 'none',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 600,
}