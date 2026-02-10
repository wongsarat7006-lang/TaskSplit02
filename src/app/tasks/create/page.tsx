'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTasks } from '../../../context/TaskContext'

export default function CreateTaskPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignee, setAssignee] = useState('A')
  const [status, setStatus] = useState<'todo' | 'doing' | 'done'>('todo')
  const [dueDate, setDueDate] = useState('')
  
  const { addTask } = useTasks()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      alert('กรุณากรอกชื่องาน')
      return
    }

    addTask({
      title,
      description,
      assignee,
      status,
      dueDate,
    })

    alert(`สร้างงาน "${title}" สำเร็จ!`)
    router.push('/tasks')
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f1f5f9',
        padding: '32px 24px',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header พร้อมปุ่มกลับ */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: 6,
                margin: 0,
              }}
            >
              Create Task
            </h1>
            <p style={{ color: '#64748b', margin: '6px 0 0 0', fontSize: 15 }}>
              เพิ่มงานใหม่เข้าสู่ระบบจัดการงาน
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Link
              href="/tasks"
              style={{
                padding: '10px 20px',
                background: '#ffffff',
                color: '#0f172a',
                textDecoration: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                border: '1px solid #e2e8f0',
              }}
            >
              ← บอร์ดงาน
            </Link>
            <Link
              href="/"
              style={{
                padding: '10px 20px',
                background: '#ffffff',
                color: '#0f172a',
                textDecoration: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                border: '1px solid #e2e8f0',
              }}
            >
              หน้าแรก
            </Link>
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: 40,
            boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
            border: '1px solid #e2e8f0',
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <Field label="Title">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น ออกแบบหน้า Task Board"
                style={inputStyle}
              />
            </Field>

            {/* Description */}
            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="รายละเอียดของงาน"
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </Field>

            {/* Assignee */}
            <Field label="Assignee">
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                style={inputStyle}
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </Field>

            {/* Status */}
            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'todo' | 'doing' | 'done')}
                style={inputStyle}
              >
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select>
            </Field>

            {/* Due Date */}
            <Field label="Due Date">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={inputStyle}
              />
            </Field>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 12,
                marginTop: 32,
              }}
            >
              <Link
                href="/tasks"
                style={{
                  padding: '12px 28px',
                  borderRadius: 8,
                  background: '#e5e7eb',
                  color: '#334155',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                style={{
                  padding: '12px 32px',
                  borderRadius: 8,
                  background: '#4f46e5',
                  color: '#fff',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Save Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

/* ---------- helper ---------- */

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          display: 'block',
          fontSize: 14,
          fontWeight: 600,
          color: '#334155',
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  fontSize: 15,
  boxSizing: 'border-box' as const,
}