'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTasks } from '../../context/TaskContext'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

export default function TasksPage() {
  const router = useRouter()
  const { tasks, categories, reorderTasks, deleteTask, isDarkMode, getTaskTimeStatus } = useTasks()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [hasMounted, setHasMounted] = useState(false)

  // 🔐 LOGIN GUARD
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.replace("/login")
      return
    }
    setHasMounted(true)
  }, [router])

  const t = {
    bg:         isDarkMode ? '#0a0a0a' : '#fafaf8',
    card:       isDarkMode ? '#0f0f0f' : '#ffffff',
    cardHover:  isDarkMode ? '#131313' : '#fff8f4',
    text:       isDarkMode ? '#f0ede8' : '#111110',
    subText:    isDarkMode ? '#6a6a62' : '#7a7a72',
    border:     isDarkMode ? 'rgba(255,107,0,0.12)' : 'rgba(255,107,0,0.18)',
    borderStr:  isDarkMode ? 'rgba(255,107,0,0.35)' : 'rgba(255,107,0,0.45)',
    grid:       isDarkMode ? 'rgba(255,107,0,0.035)' : 'rgba(255,107,0,0.06)',
    inputBg:    isDarkMode ? '#0a0a0a' : '#ffffff',
    dragOver:   isDarkMode ? 'rgba(255,107,0,0.06)' : 'rgba(255,107,0,0.04)',
    statBg:     isDarkMode ? '#0f0f0f' : '#ffffff',
    colBorder:  isDarkMode ? 'rgba(255,107,0,0.12)' : 'rgba(255,107,0,0.2)',
  }

  const thaiFont = "'Sarabun', sans-serif"
  const engFont  = "'Bebas Neue', 'Impact', sans-serif"
  const monoFont = "'Courier New', monospace"

  // 📊 Stats Calculation
  const totalTasks = tasks?.length || 0
  const doneTasks  = tasks?.filter(t => t.status === 'done').length || 0
  const doingTasks = tasks?.filter(t => t.status === 'doing').length || 0
  const todoTasks  = tasks?.filter(t => t.status === 'todo').length || 0

  // 🔍 Filtering Logic
  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchesCategory = filterCategory === 'all' || task.category_id === filterCategory
    return matchesSearch && matchesPriority && matchesCategory
  }) || []

  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    reorderTasks(destination, source, draggableId)
  }, [reorderTasks])

  const columns = [
    { id: 'todo',  label: 'TO DO',       title: 'รายการใหม่' },
    { id: 'doing', label: 'IN PROGRESS', title: 'กำลังทำ' },
    { id: 'done',  label: 'DONE',         title: 'เสร็จสิ้น' },
  ]

  if (!hasMounted) return null

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main style={{ minHeight: '100vh', background: t.bg, color: t.text, fontFamily: thaiFont, position: 'relative', overflow: 'hidden', transition: 'background 0.3s ease' }}>
        
        {/* BG Decor */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '40px 32px' }}>
          
          {/* Header */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
            <div>
              <div style={{ fontFamily: monoFont, fontSize: '11px', color: '#ff6b00', letterSpacing: '0.2em', marginBottom: '8px' }}>// TASK BOARD</div>
              <h1 style={{ fontFamily: engFont, fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 900, lineHeight: 0.95, margin: 0, letterSpacing: '-1px', textTransform: 'uppercase' }}>
                <span style={{ color: t.text }}>MY </span>
                <span style={{ color: '#ff6b00', textShadow: '0 0 30px rgba(255,107,0,0.3)' }}>TASKS</span>
              </h1>
            </div>

            {/* ✅ ส่วนที่เพิ่ม: Group ของปุ่ม Action */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/tasks/analytics" style={{ 
                border: `1px solid #ff6b00`, 
                color: '#ff6b00', 
                padding: '13px 24px', 
                borderRadius: '4px', 
                textDecoration: 'none', 
                fontWeight: 700, 
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}>
                📊 ANALYTICS
              </Link>
              <Link href="/tasks/create" style={{ 
                background: '#ff6b00', 
                color: '#0a0a0a', 
                padding: '13px 28px', 
                borderRadius: '4px', 
                textDecoration: 'none', 
                fontWeight: 700, 
                boxShadow: '0 0 30px rgba(255,107,0,0.3)' 
              }}>
                + สร้างงานใหม่
              </Link>
            </div>
          </header>

          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', marginBottom: '28px', background: t.borderStr, borderRadius: '8px', overflow: 'hidden' }}>
            {[
              { label: 'ทั้งหมด', value: totalTasks, color: t.text },
              { label: 'รายการใหม่', value: todoTasks, color: t.subText },
              { label: 'กำลังทำ', value: doingTasks, color: '#ffaa44' },
              { label: 'เสร็จแล้ว', value: doneTasks, color: '#ff6b00' },
            ].map((s, i) => (
              <div key={i} style={{ background: t.statBg, padding: '20px 24px', textAlign: 'center' }}>
                <div style={{ fontFamily: engFont, fontSize: '44px', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: t.subText, marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            <input 
              placeholder="ค้นหางาน..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={{ flex: 2, padding: '13px 18px', background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: '6px', color: t.text, outline: 'none' }} 
            />
            
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ flex: 1, padding: '13px 18px', background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: '6px', color: t.text, cursor: 'pointer' }}
            >
              <option value="all">ทุกหมวดหมู่</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <select 
              value={filterPriority} 
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{ flex: 1, padding: '13px 18px', background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: '6px', color: t.text, cursor: 'pointer' }}
            >
              <option value="all">ทุกความสำคัญ</option>
              <option value="high">สูง (High)</option>
              <option value="medium">ปกติ (Medium)</option>
              <option value="low">ต่ำ (Low)</option>
            </select>
          </div>

          {/* Kanban Board */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {columns.map((col, colIndex) => (
              <Droppable key={col.id} droppableId={col.id}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps} ref={provided.innerRef}
                    style={{ background: snapshot.isDraggingOver ? t.dragOver : 'transparent', border: `2px dashed ${snapshot.isDraggingOver ? '#ff6b00' : t.colBorder}`, borderRadius: '10px', padding: '20px', minHeight: '600px', transition: 'all 0.2s ease' }}
                  >
                    <div style={{ marginBottom: '24px', borderBottom: `2px solid ${colIndex === 0 ? '#555' : colIndex === 1 ? '#ffaa44' : '#ff6b00'}`, paddingBottom: '10px' }}>
                       <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{col.title}</h2>
                       <span style={{ fontSize: '10px', color: t.subText, fontFamily: monoFont }}>{col.label}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {filteredTasks.filter(task => task.status === col.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                              style={{ ...provided.draggableProps.style, opacity: snapshot.isDragging ? 0.8 : 1 }}
                            >
                              <TaskCard 
                                task={task} 
                                t={t} 
                                getTaskTimeStatus={getTaskTimeStatus} 
                                onDelete={() => { if(confirm('ลบงานนี้?')) deleteTask(task.id) }} 
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </main>
    </DragDropContext>
  )
}

function TaskCard({ task, t, onDelete, getTaskTimeStatus }: any) {
  const priorityConfig: any = {
    high:   { color: '#ef4444', label: 'สูง' },
    medium: { color: '#ffaa44', label: 'ปกติ' },
    low:    { color: '#22c55e', label: 'ต่ำ' },
  }
  const p = priorityConfig[task.priority] || priorityConfig.medium
  const timeStatus = task.status !== 'done' ? getTaskTimeStatus(task.dueDate) : null

  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '16px', position: 'relative', transition: 'all 0.2s' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: p.color }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: p.color, background: `${p.color}15`, padding: '2px 8px', borderRadius: '4px', border: `1px solid ${p.color}30` }}>
            {p.label}
          </span>
          
          {timeStatus && timeStatus.label !== 'NO DEADLINE' && (
            <span style={{ 
              fontSize: '10px', 
              fontWeight: 800, 
              color: '#fff', 
              background: timeStatus.color, 
              padding: '2px 8px', 
              borderRadius: '4px',
              boxShadow: `0 0 10px ${timeStatus.color}40`
            }}>
              {timeStatus.label}
            </span>
          )}

          {task.categories && (
            <span style={{ fontSize: '10px', fontWeight: 700, color: task.categories.color, background: `${task.categories.color}15`, padding: '2px 8px', borderRadius: '4px', border: `1px solid ${task.categories.color}30` }}>
              {task.categories.name}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginLeft: '10px' }}>
          <Link href={`/tasks/edit/${task.id}`} style={{ textDecoration: 'none', fontSize: '14px' }}>✏️</Link>
          <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '14px' }}>🗑️</button>
        </div>
      </div>

      <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: t.text }}>{task.title}</h3>
      <p style={{ fontSize: '13px', color: t.subText, margin: '0 0 12px 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {task.description || '...'}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${t.border}`, paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ff6b00', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            {task.assignee ? task.assignee[0].toUpperCase() : '?'}
          </div>
          <span style={{ fontSize: '12px', color: t.subText }}>{task.assignee || 'N/A'}</span>
        </div>
        {task.dueDate && (
          <span style={{ 
            fontSize: '10px', 
            color: timeStatus?.label === 'OVERDUE' ? '#ff4d4d' : '#ff6b00', 
            opacity: 0.8,
            fontFamily: "'Courier New', monospace" 
          }}>
            {new Date(task.dueDate).toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })}
          </span>
        )}
      </div>
    </div>
  )
}