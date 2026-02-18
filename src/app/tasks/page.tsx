'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useTasks } from '../../context/TaskContext'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

export default function TasksPage() {
  const { tasks, reorderTasks, deleteTask, isDarkMode } = useTasks()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [hasMounted, setHasMounted] = useState(false) // แก้ปัญหา hydration

  const theme = {
    bg: isDarkMode ? '#121212' : '#f8fafc',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#f3f4f6' : '#1e293b',
    subText: isDarkMode ? '#94a3b8' : '#64748b',
    border: isDarkMode ? '#333' : '#e2e8f0',
    inputBg: isDarkMode ? '#2d2d2d' : '#ffffff',
    hoverBg: isDarkMode ? '#282828' : '#f0f4f8',
    dragOverBg: isDarkMode ? '#2a3a4a' : '#e0e7ff', // สีพื้นหลังตอนลากทับ
    placeholderBg: isDarkMode ? '#444' : '#f0f0f0' // สี placeholder
  }

  // แก้ปัญหา hydration: ให้ component เรนเดอร์บน client-side เท่านั้น
  useEffect(() => {
    setHasMounted(true)
  }, [])

  const totalTasks = tasks?.length || 0
  const doneTasks = tasks?.filter(t => t.status === 'done').length || 0
  const progressPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    return matchesSearch && matchesPriority
  }) || []

  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result
    reorderTasks(destination, source, draggableId)
  }, [reorderTasks])

  const columns = [
    { id: 'todo', title: 'รายการใหม่', icon: '📝', color: '#64748b' },
    { id: 'doing', title: 'กำลังทำ', icon: '⚙️', color: '#f59e0b' },
    { id: 'done', title: 'เสร็จสิ้น', icon: '✅', color: '#22c55e' }
  ]

  if (!hasMounted) {
    return null; // หรือจะแสดง Loading Spinner ตรงนี้ก็ได้
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main style={{ minHeight: '100vh', background: theme.bg, padding: '40px 24px', transition: '0.3s' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header ส่วนหัว */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: theme.text, margin: 0 }}>Task Board</h1>
              <p style={{ color: theme.subText, marginTop: '4px' }}>จัดการโปรเจกต์และติดตามสถานะงานของคุณ</p>
            </div>
            <Link href="/tasks/create" style={createBtnStyle}>
              + สร้างงานใหม่
            </Link>
          </header>

          {/* Progress Overview Section */}
          <div style={{ 
            background: theme.card, 
            padding: '24px', 
            borderRadius: '16px', 
            marginBottom: '32px', 
            border: `1px solid ${theme.border}`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, color: theme.text, fontSize: '18px' }}>ความคืบหน้าโครงการ</h3>
                <p style={{ margin: 0, color: theme.subText, fontSize: '14px' }}>
                  ทำเสร็จแล้ว {doneTasks} จากทั้งหมด {totalTasks} งาน
                </p>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#2563eb' }}>
                {progressPercentage}%
              </div>
            </div>
            <div style={{ 
              width: '100%', 
              height: '12px', 
              background: isDarkMode ? '#333' : '#e2e8f0', 
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${progressPercentage}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #2563eb, #3b82f6)', 
                borderRadius: '10px',
                transition: 'width 0.8s ease-in-out'
              }} />
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div style={{ 
            display: 'flex', gap: '16px', marginBottom: '32px', 
            padding: '20px', background: theme.card, borderRadius: '16px',
            border: `1px solid ${theme.border}`, boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.subText }}>🔍</span>
              <input 
                placeholder="ค้นหาชื่องาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px',
                  border: `1px solid ${theme.border}`, background: theme.inputBg,
                  color: theme.text, outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{ 
                padding: '0 16px', borderRadius: '10px', border: `1px solid ${theme.border}`,
                background: theme.inputBg, color: theme.text, outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="all">ระดับความสำคัญ: ทั้งหมด</option>
              <option value="high">🔴 ด่วนมาก</option>
              <option value="medium">🟡 ปกติ</option>
              <option value="low">🟢 รอได้</option>
            </select>
          </div>

          {/* Board Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {columns.map(col => (
              <Droppable key={col.id} droppableId={col.id}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ 
                      background: snapshot.isDraggingOver ? theme.dragOverBg : 'transparent',
                      padding: '12px', borderRadius: '16px', minHeight: '300px', transition: 'background 0.2s ease-in-out',
                      border: snapshot.isDraggingOver ? `1px dashed ${theme.subText}` : 'none'
                    }}
                  >
                    {/* Column Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingLeft: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{col.icon}</span>
                      <h2 style={{ fontSize: '18px', fontWeight: 700, color: theme.text, margin: 0 }}>{col.title}</h2>
                      <span style={{ 
                        background: isDarkMode ? '#333' : '#e2e8f0', color: theme.subText,
                        padding: '2px 8px', borderRadius: '12px', fontSize: '12px'
                      }}>
                        {filteredTasks.filter(t => t.status === col.id).length}
                      </span>
                    </div>

                    {/* Task List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {filteredTasks
                        .filter(t => t.status === col.id)
                        .map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  marginBottom: '16px', // ระยะห่างระหว่าง Card
                                  opacity: snapshot.isDragging ? 0.8 : 1,
                                  transition: 'background 0.2s',
                                  background: snapshot.isDragging ? theme.hoverBg : theme.card, // สีตอนลาก Card
                                  borderRadius: '14px',
                                  boxShadow: snapshot.isDragging ? '0 8px 20px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                                  border: snapshot.isDragging ? `2px solid #2563eb` : `1px solid ${theme.border}`,
                                  cursor: 'grab', // แสดง cursor เป็นรูปมือจับ
                                  display: 'flex', // ให้ TaskCard สามารถขยายเต็มพื้นที่
                                  flexDirection: 'column'
                                }}
                              >
                                <TaskCard 
                                  task={task} 
                                  theme={theme} 
                                  // เนื่องจากเราใช้ Drag & Drop แล้ว ปุ่ม moveTaskNext จะไม่จำเป็นแล้ว
                                  // ถ้าต้องการปุ่มจริงๆ ให้เพิ่ม onClick เข้าไปใน TaskCard เอง
                                  onDelete={() => { if(confirm('ยืนยันการลบงานนี้?')) deleteTask(task.id) }}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder} {/* ตัวplaceholder สำหรับการลาก */}
                      {filteredTasks.filter(t => t.status === col.id).length === 0 && (
                        <div style={{ 
                          textAlign: 'center', color: theme.subText, fontSize: '14px', 
                          padding: '20px', background: theme.card, borderRadius: '14px',
                          border: `1px dashed ${theme.border}`, marginTop: '16px'
                        }}>
                          ไม่มีงานในคอลัมน์นี้
                        </div>
                      )}
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

/* --- Components ย่อย (TaskCard) --- */

function TaskCard({ task, theme, onDelete }: any) {
  const priorityColor = task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#22c55e'
  
  return (
    <div style={{ 
      padding: '20px', // ให้ padding อยู่ใน TaskCard แทนที่จะเป็น div ด้านนอก
      flexGrow: 1 // ทำให้ TaskCard ขยายเต็มพื้นที่ของ Draggable div
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ 
          fontSize: '11px', fontWeight: 700, color: priorityColor, 
          background: `${priorityColor}15`, padding: '4px 10px', borderRadius: '20px',
          textTransform: 'uppercase'
        }}>
          {task.priority}
        </span>
        <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, color: theme.subText }}>🗑️</button>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: 600, color: theme.text, margin: '0 0 8px 0' }}>{task.title}</h3>
      <p style={{ fontSize: '14px', color: theme.subText, margin: '0 0 16px 0', lineHeight: '1.5' }}>{task.description || 'ไม่มีรายละเอียด'}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: `1px solid ${theme.border}50` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: 28, height: 28, borderRadius: '50%', background: '#2563eb', color: '#fff', 
            fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 600
          }}>
            {task.assignee ? task.assignee[0].toUpperCase() : 'U'}
          </div>
          <span style={{ fontSize: '12px', color: theme.subText }}>{task.dueDate || 'No date'}</span>
        </div>
        
        {/* ปุ่ม moveTaskNext ถูกนำออกไปแล้วเพราะใช้ Drag & Drop แทน */}
      </div>
    </div>
  )
}

/* --- Styles --- */
const createBtnStyle = {
  padding: '12px 24px', background: '#2563eb', color: '#fff',
  borderRadius: '12px', fontWeight: 700, textDecoration: 'none',
  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
  transition: 'transform 0.2s',
  border: 'none', // ให้ไม่มี border
  cursor: 'pointer'
}