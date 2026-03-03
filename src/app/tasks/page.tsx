'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'
import { useTasks, Task } from '../../context/TaskContext'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

export default function TasksPage() {
  const router = useRouter()
  const { tasks, categories, deleteTask, updateTask, isDarkMode } = useTasks()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/login'); return }
      setHasMounted(true)
    }
    checkSession()
  }, [router])

  if (!hasMounted) return null

  const t = {
    bg:      isDarkMode ? '#0a0a0a' : '#f4f4f0',
    card:    isDarkMode ? '#141414' : '#ffffff',
    col:     isDarkMode ? '#0d0d0d' : '#f9f9f7',
    text:    isDarkMode ? '#f0ede8' : '#111111',
    subText: isDarkMode ? '#666660' : '#888880',
    accent:  '#ff6b00',
    border:  isDarkMode ? 'rgba(255,107,0,0.18)' : 'rgba(255,107,0,0.22)',
    colBg:   isDarkMode ? '#111111' : '#f0efe9',
  }

  const priorityColor: Record<string, string> = {
    high: '#ff4444', medium: '#ff6b00', low: '#44cc88',
  }
  const priorityLabel: Record<string, string> = {
    high: 'สูง', medium: 'กลาง', low: 'ต่ำ'
  }

  const filteredTasks = tasks.filter(task => {
    const matchText     = task.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchCategory = filterCategory === 'all' || task.category_id === filterCategory
    return matchText && matchPriority && matchCategory
  })

  const columns: { id: Task['status']; label: string; emoji: string }[] = [
    { id: 'todo',  label: 'TO DO',  emoji: '📋' },
    { id: 'doing', label: 'DOING',  emoji: '⚡' },
    { id: 'done',  label: 'DONE',   emoji: '✅' },
  ]

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    // ไม่มีปลายทาง (ลากแล้วปล่อยนอกคอลัมน์)
    if (!destination) return

    // ตำแหน่งเดิมเป๊ะ ๆ ไม่ต้องทำอะไร
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // หา task จาก id
    const task = tasks.find(t => t.id === draggableId)
    if (!task) return

    const fromStatus = source.droppableId as Task['status']
    const toStatus   = destination.droppableId as Task['status']

    // ย้ายข้ามคอลัมน์เท่านั้นที่ต้องยืนยัน
    if (fromStatus === toStatus) return

    let message = `ยืนยันย้ายงาน "${task.title}" ใช่หรือไม่?`

    // ข้อความเฉพาะกรณี
    if (fromStatus === 'todo' && toStatus === 'doing') {
      message = `ต้องการเริ่มทำงานนี้ใช่ไหม?\n\n"${task.title}"`
    } else if (fromStatus === 'doing' && toStatus === 'done') {
      message = `ยืนยันว่าทำงานนี้เสร็จแล้วใช่ไหม?\n\n"${task.title}"`
    } else if (fromStatus === 'todo' && toStatus === 'done') {
      message = `ต้องการข้ามไปเป็น "เสร็จแล้ว" ทันทีสำหรับงานนี้ใช่ไหม?\n\n"${task.title}"`
    }

    const ok = confirm(message)
    if (!ok) return

    // อัปเดตสถานะงาน
    updateTask({
      ...task,
      status: toStatus,
    })
  }

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px',
    background: t.card,
    border: `1px solid ${t.border}`,
    borderRadius: 8,
    color: t.text,
    fontSize: 13,
    outline: 'none',
    fontFamily: "'Sarabun', sans-serif",
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main style={{ minHeight: '100vh', background: t.bg, padding: '32px 40px', fontFamily: "'Sarabun', sans-serif" }}>

        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: t.accent, letterSpacing: 3, marginBottom: 4 }}>// TASK_BOARD</div>
            <h1 style={{ color: t.text, margin: 0, fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: 2 }}>
              MY <span style={{ color: t.accent }}>TASKS</span>
            </h1>
          </div>
          <Link href="/tasks/create" style={{
            padding: '12px 24px',
            background: t.accent,
            color: '#000',
            borderRadius: 10,
            fontWeight: 900,
            fontSize: 14,
            textDecoration: 'none',
            boxShadow: `0 0 20px ${t.accent}44`,
            letterSpacing: 1,
          }}>
            + สร้างภารกิจ
          </Link>
        </header>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
          <input
            style={{ ...inputStyle, flex: 1, minWidth: 200 }}
            placeholder="🔍 ค้นหางาน..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select style={inputStyle as any} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="all">📁 ทุกหมวด</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select style={inputStyle as any} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            <option value="all">🎯 ทุกระดับ</option>
            <option value="high">🔴 สูง</option>
            <option value="medium">🟠 กลาง</option>
            <option value="low">🟢 ต่ำ</option>
          </select>
        </div>

        {/* Board */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {columns.map(col => {
            const colTasks = filteredTasks.filter(tk => tk.status === col.id)
            return (
              <Droppable key={col.id} droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      background: snapshot.isDraggingOver
                        ? isDarkMode ? '#1a1a0a' : '#fff8f0'
                        : t.colBg,
                      border: `1.5px dashed ${snapshot.isDraggingOver ? t.accent : t.border}`,
                      borderRadius: 14,
                      padding: 16,
                      minHeight: 520,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Column Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{col.emoji}</span>
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: t.text, letterSpacing: 2 }}>
                          {col.label}
                        </span>
                      </div>
                      <span style={{
                        background: `${t.accent}22`,
                        color: t.accent,
                        borderRadius: 20,
                        padding: '2px 10px',
                        fontSize: 12,
                        fontWeight: 700,
                      }}>
                        {colTasks.length}
                      </span>
                    </div>

                    {/* Cards */}
                    {colTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard
                              task={task}
                              t={t}
                              priorityColor={priorityColor}
                              priorityLabel={priorityLabel}
                              isDragging={snapshot.isDragging}
                              onDelete={() => { if (confirm('ลบงานนี้?')) deleteTask(task.id) }}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {colTasks.length === 0 && (
                      <div style={{ textAlign: 'center', color: t.subText, fontSize: 13, marginTop: 60, opacity: 0.5 }}>
                        ไม่มีงานในขั้นตอนนี้
                      </div>
                    )}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )
          })}
        </div>

      </main>
    </DragDropContext>
  )
}

function TaskCard({
  task, t, priorityColor, priorityLabel, isDragging, onDelete
}: {
  task: Task
  t: any
  priorityColor: Record<string, string>
  priorityLabel: Record<string, string>
  isDragging: boolean
  onDelete: () => void
}) {
  const pColor = priorityColor[task.priority] || '#888'

  return (
    <div style={{
      background: t.card,
      border: `1px solid ${isDragging ? '#ff6b00' : t.border}`,
      borderLeft: `3px solid ${pColor}`,
      borderRadius: 10,
      padding: '14px 16px',
      marginBottom: 12,
      boxShadow: isDragging
        ? '0 8px 30px rgba(255,107,0,0.25)'
        : '0 2px 8px rgba(0,0,0,0.08)',
      transform: isDragging ? 'rotate(1deg)' : 'none',
      transition: 'all 0.15s ease',
      cursor: 'grab',
    }}>

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          color: pColor,
          background: `${pColor}18`,
          padding: '2px 8px',
          borderRadius: 20,
          letterSpacing: 1,
        }}>
          {priorityLabel[task.priority] || task.priority}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <Link href={`/tasks/edit/${task.id}`} style={{
            fontSize: 13, padding: '3px 8px',
            background: 'rgba(255,107,0,0.1)',
            borderRadius: 6, textDecoration: 'none',
            color: '#ff6b00',
          }}>✏️</Link>
          <button onClick={onDelete} style={{
            fontSize: 13, padding: '3px 8px',
            background: 'rgba(255,60,60,0.1)',
            border: 'none', borderRadius: 6,
            cursor: 'pointer', color: '#ff4444',
          }}>🗑️</button>
        </div>
      </div>

      {/* Title */}
      <div style={{ fontWeight: 700, fontSize: 14, color: t.text, marginBottom: 6, lineHeight: 1.4 }}>
        {task.title}
      </div>

      {/* Description */}
      {task.description && (
        <div style={{
          fontSize: 12, color: t.subText, marginBottom: 8, lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        } as any}>
          {task.description}
        </div>
      )}

      {/* Category tag */}
      {task.categories && (
        <span style={{
          fontSize: 10, padding: '2px 8px',
          background: `${task.categories.color || '#ff6b00'}22`,
          color: task.categories.color || '#ff6b00',
          borderRadius: 20, marginBottom: 8, display: 'inline-block',
          border: `1px solid ${task.categories.color || '#ff6b00'}44`,
        }}>
          {task.categories.name}
        </span>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        {task.due_date ? (
          <span style={{ fontSize: 11, color: t.subText }}>
            📅 {new Date(task.due_date).toLocaleDateString('th-TH')}
          </span>
        ) : <span />}

        {task.team_members && task.team_members.length > 0 && (
          <span style={{ fontSize: 11, color: t.subText }}>
            👥 {task.current_people || 1}/{task.max_assignees || 1}
          </span>
        )}
      </div>
    </div>
  )
}