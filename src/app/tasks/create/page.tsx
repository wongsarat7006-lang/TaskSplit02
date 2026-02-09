'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateTaskPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignee, setAssignee] = useState('A,B,C')
  const [status, setStatus] = useState('todo')
  const [dueDate, setDueDate] = useState('2025-04-02')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      alert('กรุณากรอกชื่องาน')
      return
    }

    const newTask = {
      title,
      description,
      assignee,
      status,
      dueDate,
    }

    console.log('งานใหม่:', newTask)
    alert(`สร้างงาน "${title}" สำเร็จ!`)

    // รีเซ็ตฟอร์ม
    setTitle('')
    setDescription('')
    setAssignee('A,B,C')
    setStatus('todo')
    setDueDate('2025-04-02')
    
    router.push('/tasks')
  }

  function handleCancel() {
    router.push('/tasks')
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* ส่วนหัว */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 700,
                margin: 0,
                color: '#1a1a1a',
              }}
            >
              ✨ สร้างงานใหม่
            </h1>
            <p
              style={{
                fontSize: '15px',
                color: '#78716c',
                margin: '6px 0 0 0',
              }}
            >
              เพิ่มงานใหม่เข้าสู่ระบบ
            </p>
          </div>

          <Link
            href="/tasks"
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#1a1a1a',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              border: '2px solid rgba(0,0,0,0.1)',
            }}
          >
            ← กลับ
          </Link>
        </div>

        {/* ฟอร์มสร้างงาน */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              background: '#e5e7eb',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '32px',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                margin: 0,
                color: '#1a1a1a',
              }}
            >
              Create Task
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ชื่องาน */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  marginBottom: '8px',
                }}
              >
                Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="กรอกชื่องาน"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* รายละเอียด */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  marginBottom: '8px',
                }}
              >
                Description:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="กรอกรายละเอียด"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* ผู้รับผิดชอบ */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  marginBottom: '8px',
                }}
              >
                Assignee:
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                <option value="A,B,C">A,B,C</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            {/* สถานะ */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  marginBottom: '8px',
                }}
              >
                Status:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* วันที่กำหนดส่ง */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  marginBottom: '8px',
                }}
              >
                Due Date:
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* ปุ่มบันทึกและยกเลิก */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '12px 32px',
                  background: '#9ca3af',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '12px 32px',
                  background: '#6b7280',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}