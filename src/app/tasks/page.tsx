'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTasks } from '../../context/TaskContext'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

export default function TasksPage() {
  const router = useRouter()

  const { tasks, reorderTasks, deleteTask, isDarkMode } = useTasks()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [hasMounted, setHasMounted] = useState(false)

  // 🔐 LOGIN GUARD (ทำงานแน่นอน)
  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.replace("/login")
      return
    }

    setHasMounted(true)
  }, [router])


  const t = {
    bg:        isDarkMode ? '#0a0a0a' : '#fafaf8',
    card:      isDarkMode ? '#0f0f0f' : '#ffffff',
    cardHover: isDarkMode ? '#131313' : '#fff8f4',
    text:      isDarkMode ? '#f0ede8' : '#111110',
    subText:   isDarkMode ? '#6a6a62' : '#7a7a72',
    border:    isDarkMode ? 'rgba(255,107,0,0.12)' : 'rgba(255,107,0,0.18)',
    borderStr: isDarkMode ? 'rgba(255,107,0,0.35)' : 'rgba(255,107,0,0.45)',
    grid:      isDarkMode ? 'rgba(255,107,0,0.035)' : 'rgba(255,107,0,0.06)',
    inputBg:   isDarkMode ? '#0a0a0a' : '#ffffff',
    dragOver:  isDarkMode ? 'rgba(255,107,0,0.06)' : 'rgba(255,107,0,0.04)',
    statBg:    isDarkMode ? '#0f0f0f' : '#ffffff',
    colBorder: isDarkMode ? 'rgba(255,107,0,0.12)' : 'rgba(255,107,0,0.2)',
  }

  const thaiFont = "'Sarabun', sans-serif"
  const engFont  = "'Bebas Neue', 'Impact', sans-serif"
  const monoFont = "'Courier New', monospace"

  const totalTasks = tasks?.length || 0
  const doneTasks  = tasks?.filter(t => t.status === 'done').length || 0
  const doingTasks = tasks?.filter(t => t.status === 'doing').length || 0
  const todoTasks  = tasks?.filter(t => t.status === 'todo').length || 0
  const progressPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    return matchesSearch && matchesPriority
  }) || []

  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    reorderTasks(destination, source, draggableId)
  }, [reorderTasks])

  const columns = [
    { id: 'todo',  label: 'TO DO',       title: 'รายการใหม่', count: todoTasks },
    { id: 'doing', label: 'IN PROGRESS', title: 'กำลังทำ',    count: doingTasks },
    { id: 'done',  label: 'DONE',        title: 'เสร็จสิ้น',  count: doneTasks },
  ]

 if (!hasMounted) return null
 
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main style={{ minHeight: '100vh', background: t.bg, color: t.text, fontFamily: thaiFont, position: 'relative', overflow: 'hidden', transition: 'background 0.3s ease' }}>

        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        <div style={{ position: 'fixed', top: '-200px', right: '-200px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '40px 32px' }}>

          {/* Header */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
            <div>
              <div style={{ fontFamily: monoFont, fontSize: '11px', color: '#ff6b00', letterSpacing: '0.2em', marginBottom: '8px' }}>// TASK BOARD</div>
              <h1 style={{ fontFamily: engFont, fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 900, lineHeight: 0.95, margin: 0, letterSpacing: '-1px', textTransform: 'uppercase' }}>
                <span style={{ color: t.text }}>MY </span>
                <span style={{ color: '#ff6b00', textShadow: '0 0 30px rgba(255,107,0,0.3)' }}>TASKS</span>
              </h1>
              <p style={{ fontFamily: thaiFont, color: t.subText, marginTop: '8px', fontSize: '15px' }}>
                วันนี้คุณมี {totalTasks - doneTasks} งานที่ต้องจัดการ
              </p>
            </div>
            <Link href="/tasks/create" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#ff6b00', color: '#0a0a0a', padding: '13px 28px', borderRadius: '4px',
              textDecoration: 'none', fontFamily: thaiFont, fontSize: '15px', fontWeight: 700,
              boxShadow: '0 0 30px rgba(255,107,0,0.3)', transition: 'all 0.2s ease', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#ff8533'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#ff6b00'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
            >+ สร้างงานใหม่</Link>
          </header>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', marginBottom: '28px', background: t.borderStr, borderRadius: '8px', overflow: 'hidden' }}>
            {[
              { label: 'ทั้งหมด',     value: totalTasks, color: t.text },
              { label: 'รายการใหม่',  value: todoTasks,  color: t.subText },
              { label: 'กำลังทำ',     value: doingTasks, color: '#ffaa44' },
              { label: 'เสร็จแล้ว',   value: doneTasks,  color: '#ff6b00' },
            ].map((s, i) => (
              <div key={i} style={{ background: t.statBg, padding: '20px 24px', textAlign: 'center', transition: 'background 0.3s ease' }}>
                <div style={{ fontFamily: engFont, fontSize: '44px', fontWeight: 900, color: s.color, lineHeight: 1, textShadow: s.color === '#ff6b00' ? '0 0 20px rgba(255,107,0,0.3)' : 'none' }}>{s.value}</div>
                <div style={{ fontFamily: thaiFont, fontSize: '13px', color: t.subText, marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div style={{ background: t.card, padding: '20px 28px', borderRadius: '8px', border: `1px solid ${t.border}`, marginBottom: '28px', transition: 'background 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontFamily: thaiFont, fontSize: '14px', color: t.subText, fontWeight: 500 }}>ความคืบหน้าภาพรวม</span>
              <span style={{ fontFamily: engFont, fontSize: '28px', fontWeight: 900, color: '#ff6b00' }}>{progressPercentage}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #ff6b00, #ff9944)', boxShadow: '0 0 12px rgba(255,107,0,0.4)', transition: 'width 0.8s ease' }} />
            </div>
          </div>

          {/* Search & Filter */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            <input
              placeholder="ค้นหางาน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, padding: '13px 18px', background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: '6px', outline: 'none', fontFamily: thaiFont, fontSize: '14px', color: t.text, boxSizing: 'border-box', transition: 'border-color 0.2s ease' }}
              onFocus={e => (e.target.style.borderColor = '#ff6b00')}
              onBlur={e => (e.target.style.borderColor = t.border)}
            />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{ padding: '13px 18px', background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: '6px', outline: 'none', fontFamily: thaiFont, fontSize: '14px', color: t.text, cursor: 'pointer', width: '200px' }}
            >
              <option value="all">ความสำคัญ: ทั้งหมด</option>
              <option value="high">สูง (High)</option>
              <option value="medium">ปกติ (Medium)</option>
              <option value="low">ต่ำ (Low)</option>
            </select>
          </div>

          {/* Kanban */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {columns.map((col, colIndex) => (
              <Droppable key={col.id} droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps} ref={provided.innerRef}
                    style={{ background: snapshot.isDraggingOver ? t.dragOver : 'transparent', border: snapshot.isDraggingOver ? '2px dashed #ff6b00' : `2px dashed ${t.colBorder}`, borderRadius: '10px', padding: '20px', minHeight: '600px', transition: 'all 0.2s ease' }}
                  >
                    <div style={{ marginBottom: '24px', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: colIndex === 0 ? `linear-gradient(90deg, ${isDarkMode ? '#555' : '#aaa'}, transparent)` : colIndex === 1 ? 'linear-gradient(90deg, #ffaa44, transparent)' : 'linear-gradient(90deg, #ff6b00, transparent)' }} />
                      <div style={{ paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontFamily: monoFont, fontSize: '10px', color: t.subText, letterSpacing: '0.2em', marginBottom: '4px' }}>{col.label}</div>
                          <h2 style={{ fontFamily: thaiFont, fontSize: '20px', fontWeight: 700, color: t.text, margin: 0 }}>{col.title}</h2>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: colIndex === 2 ? '#ff6b00' : t.dragOver, border: `1px solid ${t.borderStr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: engFont, fontSize: '22px', fontWeight: 900, color: colIndex === 2 ? '#0a0a0a' : '#ff6b00' }}>
                          {filteredTasks.filter(task => task.status === col.id).length}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {filteredTasks.filter(task => task.status === col.id).length === 0 ? (
                        <div style={{ padding: '48px 20px', borderRadius: '8px', border: `1px dashed ${t.colBorder}`, textAlign: 'center', color: t.subText }}>
                          <div style={{ fontFamily: monoFont, fontSize: '24px', marginBottom: '8px', opacity: 0.3 }}>□</div>
                          <p style={{ fontFamily: thaiFont, fontSize: '14px', margin: 0, opacity: 0.5 }}>ยังไม่มีงาน</p>
                        </div>
                      ) : (
                        filteredTasks.filter(task => task.status === col.id).map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                style={{ ...provided.draggableProps.style, opacity: snapshot.isDragging ? 0.92 : 1, transform: snapshot.isDragging ? provided.draggableProps.style?.transform + ' rotate(1.5deg) scale(1.02)' : provided.draggableProps.style?.transform }}
                              >
                                <TaskCard task={task} t={t} thaiFont={thaiFont} monoFont={monoFont} onDelete={() => { if (confirm('ต้องการลบงานนี้ใช่หรือไม่?')) deleteTask(task.id) }} />
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sarabun:wght@400;500;600;700&display=swap');
          ::placeholder { color: ${isDarkMode ? '#3a3a32' : '#c0bdb8'} !important; }
          select option { background: ${isDarkMode ? '#0f0f0f' : '#ffffff'}; color: ${isDarkMode ? '#f0ede8' : '#111110'}; }
        `}</style>
      </main>
    </DragDropContext>
  )
}

function TaskCard({ task, t, thaiFont, monoFont, onDelete }: any) {
  const priorityConfig: Record<string, { color: string; label: string }> = {
    high:   { color: '#ef4444', label: 'สูง' },
    medium: { color: '#ffaa44', label: 'ปกติ' },
    low:    { color: '#22c55e', label: 'ต่ำ' },
  }
  const p = priorityConfig[task.priority] || priorityConfig.low

  return (
    <div
      style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '18px', position: 'relative', overflow: 'hidden', cursor: 'grab', transition: 'border-color 0.2s ease, background 0.2s ease' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,107,0,0.35)'; (e.currentTarget as HTMLElement).style.background = t.cardHover }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = t.border; (e.currentTarget as HTMLElement).style.background = t.card }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: p.color, boxShadow: `0 0 8px ${p.color}60` }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontFamily: thaiFont, fontSize: '12px', fontWeight: 600, color: p.color, background: `${p.color}15`, border: `1px solid ${p.color}30`, padding: '3px 10px', borderRadius: '3px' }}>
          {p.label}
        </span>
        <div style={{ display: 'flex', gap: '10px', opacity: 0.5 }}>
          <Link href={`/tasks/edit/${task.id}`} style={{ textDecoration: 'none', fontSize: '14px' }}>✏️</Link>
          <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: 0 }}>🗑️</button>
        </div>
      </div>

      <h3 style={{ fontFamily: thaiFont, fontSize: '15px', fontWeight: 700, color: t.text, margin: '0 0 8px 0', lineHeight: 1.4 }}>{task.title}</h3>
      <p style={{ fontFamily: thaiFont, fontSize: '13px', color: t.subText, margin: '0 0 14px 0', lineHeight: 1.6 }}>
        {task.description || 'ไม่มีรายละเอียด'}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: 'linear-gradient(135deg, #ff6b00, #cc4400)', color: '#fff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {task.assignee ? task.assignee[0].toUpperCase() : 'U'}
          </div>
          <span style={{ fontFamily: thaiFont, fontSize: '12px', color: t.subText }}>{task.assignee || 'ไม่ระบุ'}</span>
        </div>
        {task.dueDate && (
          <span style={{ fontFamily: monoFont, fontSize: '11px', color: 'rgba(255,107,0,0.5)' }}>{task.dueDate}</span>
        )}
      </div>
    </div>
  )
}
