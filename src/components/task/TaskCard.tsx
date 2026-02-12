'use client'

import { useTasks } from '../../context/TaskContext'

type TaskCardProps = {
  id: any
  title: string
  description?: string
  assignee?: string
  status: 'todo' | 'doing' | 'done' | string
  dueDate?: string
  onNext: (id: any) => void
}

export default function TaskCard({
  id,
  title,
  description,
  assignee,
  status,
  dueDate,
  onNext,
}: TaskCardProps) {
  const { deleteTask } = useTasks()

  // --- Logic การคำนวณวันคงเหลือ ---
  const getDueStatus = () => {
    if (!dueDate || status === 'done') return { label: null, color: null, isUrgent: false }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const targetDate = new Date(dueDate)
    targetDate.setHours(0, 0, 0, 0)
    
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { label: '🔴 เลยกำหนดส่งแล้ว!', color: '#ef4444', isUrgent: true }
    if (diffDays <= 2) return { label: `🟠 อีก ${diffDays} วันจะถึงกำหนด`, color: '#f59e0b', isUrgent: true }
    return { label: `📅 กำหนดส่ง: ${formatDate(dueDate)}`, color: '#6b7280', isUrgent: false }
  }

  const dueInfo = getDueStatus()

  const handleDelete = () => {
    if (window.confirm(`คุณต้องการลบงาน "${title}" ใช่หรือไม่?`)) {
      deleteTask(id)
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '16px',
        border: dueInfo.isUrgent ? `2px solid ${dueInfo.color}` : '1px solid #e5e7eb', // ใส่กรอบสีถ้าด่วน
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: dueInfo.isUrgent ? `0 4px 12px ${dueInfo.color}33` : '0 1px 3px rgba(0,0,0,0.05)',
        position: 'relative',
        transition: 'transform 0.2s',
      }}
    >
      {/* Badge แจ้งเตือนด่วน */}
      {dueInfo.isUrgent && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '12px',
          background: dueInfo.color || '',
          color: '#fff',
          fontSize: '10px',
          fontWeight: 800,
          padding: '2px 8px',
          borderRadius: '4px',
          textTransform: 'uppercase'
        }}>
          URGENT
        </div>
      )}

      <button onClick={handleDelete} style={deleteButtonStyle} title="ลบงาน">✕</button>

      <h3 style={{ margin: 0, marginRight: '20px', fontSize: '15px', fontWeight: 600, color: '#111827' }}>
        {title}
      </h3>

      {description && <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{description}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
        {assignee && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px' }}>👤</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#4f46e5' }}>{assignee}</span>
          </div>
        )}

        {/* แสดงผล Due Date Alert */}
        {dueDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: dueInfo.color || '#6b7280', fontWeight: dueInfo.isUrgent ? 700 : 400 }}>
              {dueInfo.label}
            </span>
          </div>
        )}
      </div>

      {status !== 'done' && (
        <button onClick={() => onNext(id)} style={nextButtonStyle}>
          ➜ ย้ายไปขั้นถัดไป
        </button>
      )}
    </div>
  )
}

const deleteButtonStyle: React.CSSProperties = {
  position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none',
  color: '#9ca3af', cursor: 'pointer', fontSize: '18px', padding: '4px'
}

const nextButtonStyle: React.CSSProperties = {
  marginTop: '4px', padding: '10px 14px', borderRadius: '8px', border: 'none',
  background: '#4f46e5', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
}