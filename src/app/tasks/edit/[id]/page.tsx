'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTasks } from '../../../../context/TaskContext'

export default function EditTaskPage() {
  const { tasks, updateTask, isDarkMode } = useTasks()
  const router = useRouter()
  const params = useParams()

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'todo' as 'todo' | 'doing' | 'done',
    assignee: '',
    dueDate: ''
  })

  useEffect(() => {
    const taskToEdit = tasks.find(t => t.id === params.id)
    if (taskToEdit) {
      setFormData({
        id: taskToEdit.id,
        title: taskToEdit.title,
        description: taskToEdit.description || '', // กัน Error แดงถ้าไม่มีค่า
        priority: taskToEdit.priority,
        status: taskToEdit.status,
        assignee: taskToEdit.assignee || '',
        dueDate: taskToEdit.dueDate || ''
      })
    } else {
      router.push('/tasks')
    }
  }, [params.id, tasks, router])

  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8fafc',
    card: isDarkMode ? '#1e293b' : '#ffffff',
    text: isDarkMode ? '#f3f4f6' : '#1e293b',
    border: isDarkMode ? '#334155' : '#e2e8f0',
    input: isDarkMode ? '#0f172a' : '#f1f5f9',
    accent: '#6366f1'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateTask(formData)
    router.push('/tasks')
  }

  return (
    <main style={{ minHeight: '100vh', background: theme.bg, padding: '60px 20px', color: theme.text }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: theme.card, padding: '40px', borderRadius: '24px', border: `1px solid ${theme.border}` }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '32px' }}>✏️ แก้ไขงาน</h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>หัวข้องาน</label>
            <input 
              style={{ ...inputStyle, background: theme.input, color: theme.text, border: `1px solid ${theme.border}` }}
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>สถานะ</label>
              <select 
                style={{ ...inputStyle, background: theme.input, color: theme.text, border: `1px solid ${theme.border}` }}
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
              >
                <option value="todo">📝 ต้องทำ</option>
                <option value="doing">⚙️ กำลังทำ</option>
                <option value="done">✅ เสร็จสิ้น</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>ความสำคัญ</label>
              <select 
                style={{ ...inputStyle, background: theme.input, color: theme.text, border: `1px solid ${theme.border}` }}
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
              >
                <option value="high">🔴 สูง</option>
                <option value="medium">🟡 ปกติ</option>
                <option value="low">🟢 ต่ำ</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>ผู้รับผิดชอบ</label>
            <input 
              style={{ ...inputStyle, background: theme.input, color: theme.text, border: `1px solid ${theme.border}` }}
              value={formData.assignee}
              onChange={(e) => setFormData({...formData, assignee: e.target.value})}
            />
          </div>

          <button type="submit" style={{ ...btnBase, background: theme.accent, color: '#fff', marginTop: '10px' }}>อัปเดตข้อมูล</button>
        </form>
      </div>
    </main>
  )
}

const labelStyle = { display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '12px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const }
const btnBase = { padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '16px' }