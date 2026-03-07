'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTasks } from '../../../../context/TaskContext'
import { supabase } from '../../../../lib/supabaseClient'

export default function EditTaskPage({ params }: { params: { id: string } }) {
  const {
    tasks,
    categories,
    allUsers,
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
    assignee: '',
    team_members: [] as string[],
    max_assignees: 1,
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

      const anyTask: any = taskToEdit

      setFormData({
        id: taskToEdit.id,
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        priority: taskToEdit.priority || 'medium',
        status: taskToEdit.status || 'todo',
        due_date: taskToEdit.due_date || '',
        category_id: taskToEdit.category_id || '',
        assignee: anyTask.assignee || anyTask.author_email || currentUser?.email || '',
        team_members: Array.isArray(anyTask.team_members) ? anyTask.team_members : [],
        max_assignees: anyTask.max_assignees || 1,
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

          {/* หัวข้องาน */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#ff6b00', marginBottom: 8, fontWeight: 'bold' }}>หัวข้องาน *</label>
            <input
              style={fieldStyle('title')}
              placeholder="ระบุชื่องาน..."
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              onFocus={() => setFocusedField('title')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          {/* ความสำคัญของงาน */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#ff6b00', marginBottom: 8, fontWeight: 'bold' }}>ความสำคัญของงาน</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { id: 'high', label: 'สำคัญมาก', color: '#ef4444' },
                { id: 'medium', label: 'ปานกลาง', color: '#f97316' },
                { id: 'low', label: 'ไม่เร่งด่วน', color: '#22c55e' },
              ].map(option => {
                const active = formData.priority === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: option.id as 'high' | 'medium' | 'low' })}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: 999,
                      border: active ? `1px solid ${option.color}` : `1px solid ${t.border}`,
                      background: active ? `${option.color}22` : 'transparent',
                      color: active ? option.color : t.subText,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* หมวดหมู่ */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#ff6b00', marginBottom: 8, fontWeight: 'bold' }}>หมวดหมู่</label>
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
          </div>

          {/* หัวหน้างาน */}
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <label style={{ display: 'block', fontSize: 13, color: '#ff6b00', marginBottom: 8, fontWeight: 'bold' }}>หัวหน้างาน (Lead Agent)</label>
            <select
              style={{ ...fieldStyle('assignee'), appearance: 'none', cursor: 'pointer' } as any}
              value={formData.assignee}
              onChange={e => setFormData({ ...formData, assignee: e.target.value })}
              onFocus={() => setFocusedField('assignee')}
              onBlur={() => setFocusedField(null)}
            >
              <option value="">เลือกจากรายชื่อ (Default: ตัวคุณเอง)</option>
              {allUsers?.map((user: any) => (
                <option key={user.id} value={user.email}>
                  {user.full_name || user.email}
                </option>
              ))}
            </select>
            <div style={{ position: 'absolute', right: 15, top: 38, color: '#ff6b00', pointerEvents: 'none' }}>▼</div>
          </div>

          {/* สมาชิกทีม */}
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <label style={{ display: 'block', fontSize: 13, color: '#ff6b00', marginBottom: 8, fontWeight: 'bold' }}>สมาชิกทีม (Team Members)</label>
            <select
              style={{ ...fieldStyle('team'), appearance: 'none', cursor: 'pointer' } as any}
              onChange={e => {
                const email = e.target.value
                if (email && !formData.team_members.includes(email)) {
                  setFormData({ ...formData, team_members: [...formData.team_members, email] })
                }
              }}
              onFocus={() => setFocusedField('team')}
              onBlur={() => setFocusedField(null)}
              value=""
            >
              <option value="">เลือกสมาชิกเพิ่ม...</option>
              {allUsers
                ?.filter(u => u.email !== currentUser?.email)
                .map((user: any) => (
                  <option key={user.id} value={user.email}>
                    {user.full_name || user.email}
                  </option>
                ))}
            </select>
            <div style={{ position: 'absolute', right: 15, top: 38, color: '#ff6b00', pointerEvents: 'none' }}>▼</div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {formData.team_members.map(email => (
                <span
                  key={email}
                  style={{
                    background: 'rgba(255,107,0,0.06)',
                    color: '#ff6b00',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    border: `1px solid ${t.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {email.split('@')[0]}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        team_members: formData.team_members.filter(m => m !== email),
                      })
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff4d4d',
                      cursor: 'pointer',
                      fontSize: 14,
                      lineHeight: 1,
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* จำนวนสูงสุด + กำหนดส่ง */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 16 }}>
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: 13, color: '#ff6b00', marginBottom: 8, fontWeight: 'bold' }}>จำนวนสมาชิกสูงสุด</label>
              <select
                style={{ ...fieldStyle('max'), appearance: 'none', cursor: 'pointer' } as any}
                value={formData.max_assignees}
                onChange={e => setFormData({ ...formData, max_assignees: parseInt(e.target.value, 10) || 1 })}
                onFocus={() => setFocusedField('max')}
                onBlur={() => setFocusedField(null)}
              >
                {[1, 2, 3, 4, 5, 10].map(n => (
                  <option key={n} value={n}>
                    {n} คน
                  </option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: 15, top: 38, color: '#ff6b00', pointerEvents: 'none' }}>▼</div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#ff6b00', marginBottom: 8, fontWeight: 'bold' }}>กำหนดส่ง (Deadline)</label>
              <input
                type="date"
                style={fieldStyle('date') as any}
                value={formData.due_date || ''}
                onChange={e => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>

          {/* รายละเอียด */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#ff6b00', marginBottom: 8, fontWeight: 'bold' }}>รายละเอียดงาน</label>
            <textarea
              style={{ ...fieldStyle('desc'), minHeight: 100, resize: 'none' } as any}
              placeholder="ระบุรายละเอียด..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* ปุ่มบันทึก/ยกเลิก */}
          <div style={{ display: 'flex', gap: 15, marginTop: 10 }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                flex: 1,
                padding: '16px',
                background: 'transparent',
                border: `1px solid ${t.border}`,
                borderRadius: 12,
                color: t.subText,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 2,
                padding: '16px',
                background: isSubmitting ? '#333' : '#ff6b00',
                border: 'none',
                borderRadius: 12,
                color: '#000',
                fontWeight: 900,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: isSubmitting ? 'none' : '0 0 20px rgba(255,107,0,0.3)',
              }}
            >
              {isSubmitting ? 'กำลังบันทึกการแก้ไข...' : 'บันทึกการแก้ไข'}
            </button>
          </div>
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