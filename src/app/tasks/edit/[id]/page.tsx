'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTasks } from '../../../../context/TaskContext'
import { supabase } from '../../../../lib/supabaseClient'

export default function EditTaskPage({ params }: { params: { id: string } }) {
  const {
    tasks,
    categories,
    updateTask,
    isDarkMode,
    fetchComments,
    addComment,
    currentUser,
  } = useTasks()

  const router = useRouter()
  const taskId = params.id

  // -------------------- STATE --------------------
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'todo' as 'todo' | 'doing' | 'done',
    due_date: '',
    category_id: '',
  })

  const [comments, setComments] = useState<any[]>([])
  const [taskLogs, setTaskLogs] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // -------------------- THEME --------------------
  const t = {
    bg: isDarkMode ? '#0a0a0a' : '#fafaf8',
    card: isDarkMode ? '#0f0f0f' : '#ffffff',
    text: isDarkMode ? '#f0ede8' : '#111110',
    subText: isDarkMode ? '#5a5a52' : '#8a8a82',
    border: isDarkMode ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.2)',
    inputBg: isDarkMode ? '#0a0a0a' : '#fafaf8',
  }

  const thaiFont = "'Sarabun', sans-serif"
  const engFont = "'Bebas Neue', Impact, sans-serif"

  // -------------------- LOAD DATA --------------------
  useEffect(() => {
    const loadData = async () => {
      const taskToEdit = tasks.find(t => t.id === taskId)
      if (!taskToEdit) return

      setFormData({
        id: taskToEdit.id,
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        priority: taskToEdit.priority || 'medium',
        status: taskToEdit.status || 'todo',
        due_date: taskToEdit.due_date || '',
        category_id: taskToEdit.category_id || '',
      })

      try {
        const [commentData, logData] = await Promise.all([
          fetchComments(taskToEdit.id),
          supabase
            .from('task_logs')
            .select('*')
            .eq('task_id', taskToEdit.id)
            .order('created_at', { ascending: false }),
        ])

        setComments(commentData || [])
        if (logData.data) setTaskLogs(logData.data)
        setIsLoaded(true)
      } catch (err) {
        console.error(err)
      }
    }

    if (taskId && tasks.length > 0) loadData()
  }, [taskId, tasks, fetchComments])

  // -------------------- SUBMIT --------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) return alert('กรุณาระบุหัวข้องาน')

    setIsSubmitting(true)
    try {
      await updateTask(formData as any)
      alert('บันทึกการแก้ไขสำเร็จ')
      router.push('/tasks')
    } catch (err: any) {
      console.error('[EditTaskPage] updateTask error', err)
      alert(err?.message || 'ไม่สามารถบันทึกการแก้ไขได้')
    } finally {
      setIsSubmitting(false)
    }
  }

  // -------------------- COMMENT --------------------
  const handleSendComment = async () => {
    if (!newComment.trim()) return
    setIsCommenting(true)

    try {
      const author = currentUser?.email || 'User'
      const { data, error } = await addComment(formData.id, newComment, author)

      if (!error && data) {
        setComments(prev => [...prev, data])
        setNewComment('')
      }
    } finally {
      setIsCommenting(false)
    }
  }

  const fieldStyle = (name: string) => ({
    width: '100%',
    padding: '13px 16px',
    background: t.inputBg,
    border: `1px solid ${focusedField === name ? '#ff6b00' : t.border}`,
    borderRadius: '8px',
    outline: 'none',
    fontFamily: thaiFont,
    fontSize: '14px',
    color: t.text,
  })

  if (!isLoaded && tasks.length > 0) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: t.bg,
          color: t.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: engFont,
          fontSize: '24px',
        }}
      >
        LOADING...
      </div>
    )
  }

  // -------------------- UI --------------------
  return (
    <main style={{ minHeight: '100vh', background: t.bg, color: t.text, padding: '60px 24px', fontFamily: thaiFont }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} style={{ background: t.card, padding: '40px', borderRadius: '16px' }}>
          <h1 style={{ fontFamily: engFont, fontSize: '42px', marginBottom: '30px' }}>
            EDIT <span style={{ color: '#ff6b00' }}>TASK</span>
          </h1>

          <label>หัวข้องาน *</label>
          <input
            style={fieldStyle('title')}
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />

          <label style={{ marginTop: '16px' }}>รายละเอียด</label>
          <textarea
            style={{ ...fieldStyle('desc'), minHeight: '120px' }}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />

          <label style={{ marginTop: '16px' }}>หมวดหมู่</label>
          <select
            style={fieldStyle('category')}
            value={formData.category_id}
            onChange={e => setFormData({ ...formData, category_id: e.target.value })}
          >
            <option value="">-- เลือกหมวดหมู่ --</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: '30px',
              width: '100%',
              padding: '16px',
              background: '#ff6b00',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
          </button>
        </form>

        {/* COMMENTS */}
        <div style={{ marginTop: '40px' }}>
          <h3>DISCUSSION</h3>
          {comments.map((c, i) => (
            <div key={i} style={{ padding: '10px', borderBottom: `1px solid ${t.border}` }}>
              <strong>{c.author_name}</strong>
              <div>{c.content}</div>
            </div>
          ))}

          <input
            style={{ ...fieldStyle('comment'), marginTop: '10px' }}
            placeholder="เขียนคอมเมนต์..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <button onClick={handleSendComment} style={{ marginTop: '10px' }}>
            SEND
          </button>
        </div>

        {/* HISTORY / CHANGE LOGS */}
        <div style={{ marginTop: '40px' }}>
          <h3>HISTORY</h3>
          {taskLogs.length === 0 && (
            <div style={{ color: t.subText, fontSize: 13 }}>
              ยังไม่มีบันทึกการแก้ไขงานนี้
            </div>
          )}

          {taskLogs.map((log, index) => (
            <div
              key={index}
              style={{
                padding: '10px 0',
                borderBottom: `1px dashed ${t.border}`,
                fontSize: 13,
              }}
            >
              <div style={{ fontWeight: 600 }}>
                ฟิลด์ <span style={{ color: '#ff6b00' }}>{log.field}</span>{' '}
                ถูกแก้ไข
              </div>
              <div style={{ color: t.subText }}>
                จาก: <span style={{ textDecoration: 'line-through' }}>{log.old_value ?? '-'}</span>{' '}
                เป็น: <span>{log.new_value ?? '-'}</span>
              </div>
              {log.changed_at && (
                <div style={{ color: t.subText, fontSize: 12, marginTop: 2 }}>
                  เวลา:{' '}
                  {new Date(log.changed_at).toLocaleString('th-TH', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}