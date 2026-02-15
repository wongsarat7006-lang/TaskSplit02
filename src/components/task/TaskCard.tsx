'use client'
import { useState } from 'react'
import { useTasks } from '../../context/TaskContext'

export default function TaskCard({ task }: { task: any }) {
  const { moveTaskNext, deleteTask, updateTask, isDarkMode } = useTasks()
  
  // สถานะสำหรับการแก้ไข
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)

  const handleUpdate = () => {
    if (editedTitle.trim() === '') return
    updateTask({ ...task, title: editedTitle })
    setIsEditing(false)
  }

  const cardStyle: React.CSSProperties = {
    background: isDarkMode ? '#2d2d2d' : '#ffffff', // ปรับตามโหมดมืด
    color: isDarkMode ? '#f3f4f6' : '#111827',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: isDarkMode ? '1px solid #444' : '1px solid #e5e7eb',
    transition: 'all 0.2s ease'
  }

  // --- โหมดแก้ไข (แสดงช่อง Input) ---
  if (isEditing) {
    return (
      <div style={cardStyle}>
        <input 
          autoFocus
          value={editedTitle} 
          onChange={(e) => setEditedTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
          style={{ 
            width: '100%', 
            padding: '8px', 
            marginBottom: '10px', 
            borderRadius: '6px', 
            border: '2px solid #3b82f6',
            background: isDarkMode ? '#1a1a1a' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
            outline: 'none'
          }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleUpdate} style={{ ...btnSmall, background: '#10b981' }}>บันทึก</button>
          <button onClick={() => { setIsEditing(false); setEditedTitle(task.title); }} style={{ ...btnSmall, background: '#6b7280' }}>ยกเลิก</button>
        </div>
      </div>
    )
  }

  // --- โหมดปกติ ---
  return (
    <div style={cardStyle}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>{task.title}</h4>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button onClick={() => setIsEditing(true)} style={{ ...btnSmall, background: '#f59e0b' }}>
          ✏️ แก้ไข
        </button>
        {task.status !== 'done' && (
          <button onClick={() => moveTaskNext(task.id)} style={{ ...btnSmall, background: '#3b82f6' }}>
            ➡️ ถัดไป
          </button>
        )}
        <button onClick={() => deleteTask(task.id)} style={{ ...btnSmall, background: '#ef4444' }}>
          🗑️ ลบ
        </button>
      </div>
    </div>
  )
}

const btnSmall: React.CSSProperties = {
  border: 'none',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'opacity 0.2s'
}