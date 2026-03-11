'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTasks } from '../../../context/TaskContext'

export default function CreateTaskPage() {
  const { addTask, allUsers, currentUser } = useTasks() 
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    assignee: '', 
    team_members: [] as string[], 
    max_assignees: 1, 
    dueDate: '',
  })
  
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentProfile = allUsers?.find((u: any) => u.email === currentUser?.email)
  const ownerDisplayName = currentProfile?.full_name || currentUser?.email || ''

  const me = allUsers?.find((u: any) => u.id === currentUser?.id)
  const isAdmin = me?.role === 'admin'

  const t = {
    bg: '#0a0a0a',
    card: '#0f0f0f',
    accent: '#ff6b00',
    text: '#f0ede8',
    subText: '#6a6a62',
    border: 'rgba(255, 107, 0, 0.2)',
    inputBg: '#0d0d0d'
  }

  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const fieldStyle = (name: string) => ({
    width: '100%', 
    padding: '12px 16px',
    background: t.inputBg,
    border: `1px solid ${focusedField === name ? t.accent : t.border}`,
    borderRadius: '8px', 
    outline: 'none',
    fontFamily: "'Sarabun', sans-serif", 
    fontSize: '14px', 
    color: t.text,
    transition: 'all 0.2s ease',
  })

  useEffect(() => {
    if (currentUser && !isAdmin) {
      alert('อนุญาตให้สร้างงานได้เฉพาะหัวหน้างาน / แอดมิน เท่านั้น')
      router.replace('/tasks')
    }
  }, [currentUser, isAdmin, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title) return alert('กรุณาระบุหัวข้องาน')
    if (!currentUser || !currentUser.id) return alert('ระบบตรวจไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่อีกครั้ง')
    if (isSubmitting) return
    if (formData.dueDate && formData.dueDate < todayStr) return alert('ไม่สามารถเลือกวันสิ้นสุดงานเป็นวันในอดีตได้')

    setIsSubmitting(true)

    const expectedSlots = formData.max_assignees || 0
    const memberInputs = (formData.team_members || []).slice(0, expectedSlots).map(m => String(m ?? '').trim()).filter(Boolean)
    if (memberInputs.length !== expectedSlots) {
      setIsSubmitting(false)
      return alert(`กรุณาเลือกสมาชิกให้ครบ ${expectedSlots} คน`)
    }
    const uniqueInputs = Array.from(new Set(memberInputs.map(m => m.toLowerCase())))
    if (uniqueInputs.length !== memberInputs.length) {
      setIsSubmitting(false)
      return alert('มีสมาชิกซ้ำ กรุณาตรวจสอบอีกครั้ง')
    }

    const finalTeam = Array.from(new Set([currentUser.email, ...memberInputs]))

    const taskPayload = {
      title: formData.title,
      description: formData.description || '',
      priority: formData.priority,
      status: 'todo',
      user_id: currentUser.id,
      assignee: currentUser.email,
      due_date: formData.dueDate || null, 
      max_assignees: formData.max_assignees,
      team_members: finalTeam,
    }

    try {
      console.log("Sending Payload:", taskPayload)
      await addTask(taskPayload)
      alert('สร้างงานสำเร็จ!')
      router.push('/') 
    } catch (error: any) {
      console.error("Create Task Error:", error)
      alert("ไม่สามารถสร้างงานได้: " + (error.message || "Unknown Error"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: t.bg, color: t.text, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '550px', background: t.card, border: `1px solid ${t.border}`, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <div style={{ height: '3px', background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)` }} />

        <div style={{ padding: '40px' }}>
          <header style={{ marginBottom: '30px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: t.accent, letterSpacing: '3px' }}>// TASK_CREATION_UNIT</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', margin: '5px 0 0 0', letterSpacing: '1px' }}>NEW <span style={{ color: t.accent }}>TASK</span></h1>
          </header>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* หัวข้องาน */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px', fontWeight: 'bold' }}>หัวข้องาน *</label>
              <input 
                style={fieldStyle('title') as any} 
                placeholder="ระบุชื่องาน..." 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                onFocus={() => setFocusedField('title')} 
                onBlur={() => setFocusedField(null)} 
              />
            </div>

            {/* ความสำคัญของงาน */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px', fontWeight: 'bold' }}>ความสำคัญของงาน</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'high',   label: 'สำคัญมาก',   color: '#ef4444' },
                  { id: 'medium', label: 'ปานกลาง',    color: '#f97316' },
                  { id: 'low',    label: 'ไม่เร่งด่วน', color: '#22c55e' },
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

            {/* หัวหน้างาน (ล็อกเป็นผู้สร้างงาน) */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px', fontWeight: 'bold' }}>
                หัวหน้างาน (Lead Agent)
              </label>
              <input
                style={fieldStyle('assignee') as any}
                value={ownerDisplayName}
                readOnly
              />
              <div style={{ marginTop: 6, fontSize: 11, color: t.subText }}>
                หัวหน้างานจะเป็นอีเมลของผู้สร้างงานโดยอัตโนมัติ
              </div>
            </div>

            {/* จำนวนสมาชิกในทีม และ กำหนดส่ง */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px', fontWeight: 'bold' }}>
                  จำนวนสมาชิกในทีม (ไม่รวมคุณ)
                </label>
                <select 
                  style={{ ...fieldStyle('max'), appearance: 'none', cursor: 'pointer' } as any} 
                  value={formData.max_assignees}
                  onChange={(e) => {
                    const nextMax = Math.max(0, parseInt(e.target.value))
                    setFormData(prev => {
                      const prevMembers = Array.isArray(prev.team_members) ? prev.team_members : []
                      const trimmed = prevMembers.map(m => String(m ?? '').trim()).slice(0, nextMax)
                      const padded = [...trimmed, ...Array.from({ length: Math.max(0, nextMax - trimmed.length) }, () => '')]
                      return { ...prev, max_assignees: nextMax, team_members: padded }
                    })
                  }}
                  onFocus={() => setFocusedField('max')}
                  onBlur={() => setFocusedField(null)}
                >
                  {[1, 2, 3, 4, 5, 9].map(n => (
                    <option key={n} value={n} style={{ background: t.card }}>{n} คน</option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '15px', top: '38px', color: t.accent, pointerEvents: 'none' }}>▼</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px', fontWeight: 'bold' }}>กำหนดส่ง (Deadline)</label>
                <input 
                  type="date" 
                  min={todayStr}
                  style={{ ...fieldStyle('date'), colorScheme: 'dark' } as any} 
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
            </div>

            {/* สมาชิกทีมตามจำนวนที่เลือก */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px', fontWeight: 'bold' }}>
                สมาชิกทีม ({formData.max_assignees} คน)
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Array.from({ length: formData.max_assignees }).map((_, idx) => {
                  const selectedInOtherSlots = new Set(
                    (formData.team_members || []).filter((_, i) => i !== idx).map(m => String(m ?? '').trim()).filter(Boolean)
                  )
                  const availableUsers = (allUsers || []).filter((u: any) => 
                    u.email && 
                    u.email !== currentUser?.email && 
                    !selectedInOtherSlots.has(u.email)
                  )
                  return (
                    <div key={idx} style={{ position: 'relative' }}>
                      <select
                        style={{ ...fieldStyle(`team_${idx}`), appearance: 'none', cursor: 'pointer' } as any}
                        value={formData.team_members[idx] ?? ''}
                        onChange={(e) => {
                          const value = e.target.value
                          setFormData(prev => {
                            const next = Array.isArray(prev.team_members) ? [...prev.team_members] : []
                            next[idx] = value
                            return { ...prev, team_members: next }
                          })
                        }}
                        onFocus={() => setFocusedField(`team_${idx}`)}
                        onBlur={() => setFocusedField(null)}
                      >
                        <option value="" style={{ background: t.card }}>— เลือกสมาชิกคนที่ {idx + 1} —</option>
                        {availableUsers.length === 0 ? (
                          <option value="" disabled style={{ background: t.card }}>ไม่มีสมาชิกอื่นในระบบ</option>
                        ) : (
                          availableUsers.map((user: any) => (
                            <option key={user.id} value={user.email} style={{ background: t.card }}>
                              {(user.full_name || user.email || 'ไม่มีชื่อ').trim() || user.id}
                            </option>
                          ))
                        )}
                      </select>
                      <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: t.accent, pointerEvents: 'none' }}>▼</div>
                    </div>
                  )
                })}
              </div>

              <div style={{ marginTop: '10px', fontSize: '12px', color: t.subText }}>
                ระบบจะใส่คุณเป็นสมาชิกอัตโนมัติ สมาชิกที่เลือกแล้วจะไม่แสดงในช่องถัดไป
              </div>
            </div>

            {/* รายละเอียดงาน */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px', fontWeight: 'bold' }}>รายละเอียดงาน</label>
              <textarea 
                style={{ ...fieldStyle('desc'), minHeight: '100px', resize: 'none' } as any} 
                placeholder="ระบุรายละเอียด..." 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => router.back()} 
                style={{ flex: 1, padding: '16px', background: 'transparent', border: `1px solid ${t.border}`, borderRadius: '12px', color: t.subText, cursor: 'pointer', fontWeight: 600 }}
              >
                ยกเลิก
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ 
                  flex: 2, padding: '16px', 
                  background: isSubmitting ? '#333' : t.accent, 
                  border: 'none', borderRadius: '12px', color: '#000', 
                  fontWeight: 900, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: isSubmitting ? 'none' : `0 0 20px ${t.accent}33` 
                }}
              >
                {isSubmitting ? 'กำลังเชื่อมต่อระบบ...' : '+ ยืนยันการสร้างงาน'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}