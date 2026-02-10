'use client'

import { Task } from '../../types/task'

type TaskCardProps = {
  id: string | number 
  title: string
  description?: string
  assignee?: string
  status: 'todo' | 'doing' | 'done' | string // เพิ่ม string
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
  const statusLabel =
    status === 'todo'
      ? 'To Do'
      : status === 'doing'
      ? 'Doing'
      : status === 'done'
      ? 'Done'
      : status 

  const canMoveNext = status !== 'done'

  
  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.2s',
      }}
    >
      {/* ชื่องาน */}
      <h3
        style={{
          margin: 0,
          fontSize: '15px',
          fontWeight: 600,
          color: '#111827',
          lineHeight: 1.4,
        }}
      >
        {title}
      </h3>

      {/* รายละเอียด */}
      {description && (
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            color: '#6b7280',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}

      {/* ข้อมูลเพิ่มเติม */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          paddingTop: '8px',
          borderTop: '1px solid #f3f4f6',
        }}
      >
        {/* ผู้รับผิดชอบ */}
        {assignee && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>👤</span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#4f46e5',
              }}
            >
              {assignee}
            </span>
          </div>
        )}

        {/* วันกำหนดส่ง */}
        {dueDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>📅</span>
            <span
              style={{
                fontSize: '12px',
                color: '#6b7280',
              }}
            >
              {formatDate(dueDate)}
            </span>
          </div>
        )}

        {/* สถานะ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>
            {status === 'todo' ? '📝' : status === 'doing' ? '⚙️' : '✅'}
          </span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#6b7280',
            }}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {/* ปุ่มย้ายไปขั้นถัดไป */}
      {canMoveNext && (
        <button
          onClick={() => onNext(id)}
          style={{
            marginTop: '4px',
            padding: '10px 14px',
            borderRadius: '8px',
            border: 'none',
            background: '#4f46e5',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#4338ca'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#4f46e5'
          }}
        >
          ➜ ย้ายไปขั้นถัดไป
        </button>
      )}
    </div>
  )
}