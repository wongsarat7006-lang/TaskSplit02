'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTasks } from '../../../../context/TaskContext'
import { supabase } from '../../../../lib/supabase'

export default function EditTaskPage() {
  const { tasks, categories, updateTask, isDarkMode, fetchComments, addComment } = useTasks()
  const router = useRouter()
  const params = useParams()

  // --- STATES ---
  const [formData, setFormData] = useState({
    id: '', title: '', description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'todo' as 'todo' | 'doing' | 'done',
    assignee: '', dueDate: '',
    category_id: ''
  })
  
  const [comments, setComments] = useState<any[]>([])
  const [taskLogs, setTaskLogs] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- THEME CONFIG ---
  const t = {
    bg:         isDarkMode ? '#0a0a0a' : '#fafaf8',
    card:       isDarkMode ? '#0f0f0f' : '#ffffff',
    text:       isDarkMode ? '#f0ede8' : '#111110',
    subText:    isDarkMode ? '#5a5a52' : '#8a8a82',
    border:     isDarkMode ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.2)',
    inputBg:    isDarkMode ? '#0a0a0a' : '#fafaf8',
    grid:       isDarkMode ? 'rgba(255,107,0,0.035)' : 'rgba(255,107,0,0.06)',
  }

  const thaiFont = "'Sarabun', sans-serif"
  const engFont  = "'Bebas Neue', 'Impact', sans-serif"
  const monoFont = "'Courier New', monospace"

  // --- EFFECTS ---
  useEffect(() => {
    const loadData = async () => {
      const taskToEdit = tasks.find(task => task.id === params.id)
      if (taskToEdit) {
        setFormData({
          id: taskToEdit.id,
          title: taskToEdit.title,
          description: taskToEdit.description || '',
          priority: taskToEdit.priority,
          status: taskToEdit.status,
          assignee: taskToEdit.assignee || '',
          dueDate: taskToEdit.dueDate || '',
          category_id: taskToEdit.category_id || ''
        })
        
        // ดึง Comments และ Logs ขนานกัน
        const [commentData, logData] = await Promise.all([
          fetchComments(taskToEdit.id),
          supabase.from('task_logs').select('*').eq('task_id', taskToEdit.id).order('changed_at', { ascending: false })
        ])
        
        setComments(commentData)
        if (logData.data) setTaskLogs(logData.data)
      }
    }
    loadData()
  }, [params.id, tasks])

  // --- HANDLERS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await updateTask(formData)
      router.push('/tasks')
    } catch (err) {
      alert("ไม่สามารถบันทึกการแก้ไขได้")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendComment = async () => {
    if (!newComment.trim()) return
    setIsCommenting(true)
    const author = formData.assignee || 'Anonymous'
    const { data, error } = await addComment(formData.id, newComment, author)
    if (!error && data) {
      setComments([...comments, data])
      setNewComment('')
    }
    setIsCommenting(false)
  }

  const fieldStyle = (name: string) => ({
    width: '100%', padding: '13px 16px',
    background: t.inputBg,
    border: `1px solid ${focusedField === name ? 'rgba(255,107,0,0.6)' : t.border}`,
    borderRadius: '6px', outline: 'none',
    fontFamily: thaiFont, fontSize: '14px', color: t.text,
    boxSizing: 'border-box' as const,
    transition: 'all 0.2s ease',
  })

  return (
    <main style={{ minHeight: '100vh', background: t.bg, color: t.text, fontFamily: thaiFont, padding: '60px 24px' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* --- 1. FORM SECTION --- */}
        <section style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: monoFont, fontSize: '11px', color: '#ff6b00', letterSpacing: '0.2em' }}>// TASK EDITING</div>
            <h1 style={{ fontFamily: engFont, fontSize: '52px', margin: '5px 0 0 0', textTransform: 'uppercase' }}>UPDATE <span style={{ color: '#ffaa44' }}>DETAILS</span></h1>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#ff6b00', marginBottom: '8px' }}>หัวข้องาน *</label>
              <input style={fieldStyle('title')} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} onFocus={() => setFocusedField('title')} onBlur={() => setFocusedField(null)} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#ff6b00', marginBottom: '8px' }}>หมวดหมู่</label>
                <select style={fieldStyle('category')} value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                  <option value="">-- เลือกหมวดหมู่ --</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#ff6b00', marginBottom: '8px' }}>ความสำคัญ</label>
                <select style={fieldStyle('priority')} value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value as any })}>
                  <option value="low">ต่ำ (Low)</option>
                  <option value="medium">ปกติ (Medium)</option>
                  <option value="high">สูง (High)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button type="button" onClick={() => router.back()} style={{ flex: 1, padding: '14px', background: 'transparent', border: `1px solid ${t.border}`, borderRadius: '6px', color: t.subText, cursor: 'pointer', fontWeight: 600 }}>ยกเลิก</button>
              <button type="submit" disabled={isSubmitting} style={{ flex: 2, padding: '14px', background: '#ffaa44', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', color: '#000' }}>
                {isSubmitting ? 'กำลังบันทึก...' : '✓ บันทึกการแก้ไข'}
              </button>
            </div>
          </form>
        </section>

        {/* --- 2. DISCUSSION (COMMENTS) SECTION --- */}
        <section style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <div style={{ width: '4px', height: '20px', background: '#3b82f6' }} />
            <h3 style={{ fontFamily: engFont, fontSize: '24px', margin: 0, letterSpacing: '1px' }}>DISCUSSION</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
            {comments.length === 0 ? (
              <p style={{ color: t.subText, fontSize: '13px', textAlign: 'center', padding: '20px', border: `1px dashed ${t.border}`, borderRadius: '8px' }}>ยังไม่มีการพูดคุยในงานนี้</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} style={{ padding: '12px 16px', background: isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderRadius: '8px', border: `1px solid ${t.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '12px', color: '#3b82f6' }}>{c.author_name?.toUpperCase()}</span>
                    <span style={{ fontSize: '10px', color: t.subText }}>{new Date(c.created_at).toLocaleString('th-TH')}</span>
                  </div>
                  <div style={{ fontSize: '14px', color: t.text, lineHeight: '1.4' }}>{c.content}</div>
                </div>
              ))
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input style={{ ...fieldStyle('comment'), flex: 1 }} placeholder="พิมพ์ข้อความ..." value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendComment()} />
            <button onClick={handleSendComment} disabled={isCommenting || !newComment.trim()} style={{ padding: '0 20px', background: '#3b82f6', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
              {isCommenting ? '...' : 'ส่ง'}
            </button>
          </div>
        </section>

        {/* --- 3. ACTIVITY HISTORY (LOGS) SECTION --- */}
        <section style={{ padding: '0 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <h3 style={{ fontFamily: engFont, fontSize: '18px', margin: 0, color: t.subText, letterSpacing: '1px' }}>ACTIVITY HISTORY</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {taskLogs.length === 0 ? (
              <p style={{ fontSize: '12px', color: t.subText }}>ยังไม่มีประวัติการบันทึก</p>
            ) : (
              taskLogs.map((log) => (
                <div key={log.id} style={{ fontSize: '12px', color: t.subText, display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: isDarkMode ? '#111' : '#f0f0f0', borderRadius: '4px' }}>
                  <span>
                    <strong style={{ color: '#ff6b00' }}>{log.action.toUpperCase()}</strong> {log.field ? `(${log.field})` : ''} 
                    {log.new_value && ` ➔ ${log.new_value}`}
                  </span>
                  <span style={{ fontSize: '10px', opacity: 0.6 }}>{new Date(log.changed_at).toLocaleString('th-TH')}</span>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sarabun:wght@400;500;600;700&display=swap');`}</style>
    </main>
  )
}