'use client'

import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { useTasks } from '../../context/TaskContext'

/* ---------- Types ---------- */
interface Task {
  id: string
  title: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'doing' | 'done'
  owner_id?: string
}

interface TaskCardProps {
  task: Task
  index: number
}

/* ---------- Component ---------- */
export default function TaskCard({ task, index }: TaskCardProps) {
  const {
    deleteTask,
    updateTask,
    joinTask,
    isDarkMode,
    currentUser
  } = useTasks()

  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  /* ---------- Priority Config ---------- */
  const getPriorityConfig = (priority?: string) => {
    switch (priority) {
      case 'high':
        return { bg: '#fee2e2', color: '#ef4444', label: '🔴 ด่วนมาก' }
      case 'medium':
        return { bg: '#fef3c7', color: '#f59e0b', label: '🟡 ปกติ' }
      case 'low':
        return { bg: '#dcfce7', color: '#22c55e', label: '🟢 รอได้' }
      default:
        return { bg: '#f3f4f6', color: '#6b7280', label: 'ทั่วไป' }
    }
  }

  const pConfig = getPriorityConfig(task.priority)

  /* ---------- Handlers ---------- */
  const handleUpdate = async () => {
    await updateTask({
      ...task,
      title: editedTitle,
      priority: task.priority ?? 'medium',
      status: task.status ?? 'todo'
    })
    setIsEditing(false)
  }

  const isOwner =
    currentUser && task.owner_id
      ? currentUser.id === task.owner_id
      : false

  /* ---------- Render ---------- */
  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              background: isDarkMode ? '#2d2d2d' : '#fff',
              color: isDarkMode ? '#fff' : '#111827',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '12px',
              boxShadow: snapshot.isDragging
                ? '0 15px 30px rgba(0,0,0,0.2)'
                : '0 4px 6px rgba(0,0,0,0.05)',
              border: isDarkMode ? '1px solid #444' : '1px solid #e5e7eb',
              transition: 'all 0.2s',
              opacity: snapshot.isDragging ? 0.9 : 1
            }}
          >
            {/* Priority */}
            <div
              style={{
                display: 'inline-flex',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: pConfig.bg,
                color: pConfig.color,
                marginBottom: '10px'
              }}
            >
              {pConfig.label}
            </div>

            {/* Title / Edit */}
            {isEditing ? (
              <div>
                <input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ddd'
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleUpdate} style={saveBtn}>
                    บันทึก
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={cancelBtnSmall}
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '15px',
                    fontWeight: 600
                  }}
                >
                  {task.title}
                </p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {isOwner && (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        style={editBtn}
                      >
                        ✏️ แก้ไข
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        style={delBtn}
                      >
                        🗑️ ลบ
                      </button>
                    </>
                  )}

                  {!isOwner && (
                    <button onClick={() => joinTask(task)} style={joinBtn}>
                      🙋‍♂️ Join
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </Draggable>

      {/* ---------- Delete Confirm ---------- */}
      {showDeleteConfirm && (
        <div style={modalOverlay}>
          <div
            style={{
              ...modalContent,
              background: isDarkMode ? '#1e1e1e' : '#fff',
              color: isDarkMode ? '#fff' : '#000'
            }}
          >
            <h3 style={{ marginTop: 0 }}>ยืนยันการลบ?</h3>
            <p>คุณแน่ใจหรือไม่ว่าต้องการลบงาน “{task.title}”</p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '20px'
              }}
            >
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={cancelBtnModal}
              >
                ยกเลิก
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                style={confirmDelBtn}
              >
                ใช่, ลบเลย
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ---------- Styles ---------- */
const editBtn = {
  background: 'rgba(245, 158, 11, 0.1)',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  color: '#f59e0b',
  fontWeight: 600,
  fontSize: '12px'
}

const delBtn = {
  background: 'rgba(239, 68, 68, 0.1)',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  color: '#ef4444',
  fontWeight: 600,
  fontSize: '12px'
}

const joinBtn = {
  background: 'rgba(59, 130, 246, 0.1)',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  color: '#3b82f6',
  fontWeight: 600,
  fontSize: '12px'
}

const saveBtn = {
  background: '#10b981',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '8px',
  color: '#fff',
  cursor: 'pointer'
}

const cancelBtnSmall = {
  background: '#6b7280',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '8px',
  color: '#fff',
  cursor: 'pointer'
}

const modalOverlay: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  backdropFilter: 'blur(5px)'
}

const modalContent: React.CSSProperties = {
  padding: '24px',
  borderRadius: '20px',
  width: '90%',
  maxWidth: '380px',
  textAlign: 'center'
}

const cancelBtnModal = {
  background: '#e5e7eb',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '10px',
  cursor: 'pointer',
  color: '#374151',
  fontWeight: 600
}

const confirmDelBtn = {
  background: '#ef4444',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '10px',
  cursor: 'pointer',
  color: '#fff',
  fontWeight: 600
}