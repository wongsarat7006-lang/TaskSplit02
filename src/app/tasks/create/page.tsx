'use client'

import React, { useState } from 'react'
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

  const t = {
    bg: '#0a0a0a',
    card: '#0f0f0f',
    accent: '#ff6b00',
    text: '#f0ede8',
    subText: '#6a6a62',
    border: 'rgba(255, 107, 0, 0.2)',
    inputBg: '#0d0d0d'
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title) return alert('กรุณาระบุหัวข้องาน')
    if (!currentUser || !currentUser.id) return alert('ระบบตรวจไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่อีกครั้ง')
    if (isSubmitting) return

    setIsSubmitting(true)

    const finalTeam = Array.from(new Set([currentUser.email, ...formData.team_members]))

    // ✅ ลบ author_email ออก เพราะไม่มีคอลัมน์นี้ใน Supabase
    const taskPayload = {
      title: formData.title,
      description: formData.description || '',
      priority: formData.priority,
      status: 'todo',
      user_id: currentUser.id,
      assignee: formData.assignee || currentUser.email,
      due_date: formData.dueDate || null, 
      max_assignees: formData.max_assignees,
      team_members: finalTeam,
      current_people: finalTeam.length
    }

    try {
      console.log("Sending Payload:", taskPayload)
      await addTask(taskPayload)
      alert('สร้างภารกิจสำเร็จ!')
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
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: t.accent, letterSpacing: '3px' }}>// MISSION_CREATION_UNIT</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', margin: '5px 0 0 0', letterSpacing: '1px' }}>NEW <span style={{ color: t.accent }}>TASK</span></h1>
          </header>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* หัวข้องาน */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px', fontWeight: 'bold' }}>หัวข้องาน *</label>
              <input 
                style={fieldStyle('title') as any} 
                placeholder="ระบุชื่อภารกิจ..." 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                onFocus={() => setFocusedField('title')} 
                onBlur={() => setFocusedField(null)} 
              />
            </div>

            {/* หัวหน้างาน */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px', fontWeight: 'bold' }}>หัวหน้างาน (Lead Agent)</label>
              <select 
                style={{ ...fieldStyle('assignee'), appearance: 'none', cursor: 'pointer' } as any}
                value={formData.assignee}
                onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                onFocus={() => setFocusedField('assignee')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="">เลือกจากรายชื่อ (Default: ตัวคุณเอง)</option>
                {allUsers?.map((user: any) => (
                  <option key={user.id} value={user.email} style={{ background: t.card }}>
                    {user.full_name || user.email}
                  </option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: '15px', top: '38px', color: t.accent, pointerEvents: 'none' }}>▼</div>
            </div>

            {/* เพิ่มสมาชิกทีม */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px', fontWeight: 'bold' }}>เพิ่มสมาชิกทีม (Team Members)</label>
              <select 
                style={{ ...fieldStyle('team'), appearance: 'none', cursor: 'pointer' } as any}
                onChange={(e) => {
                  const email = e.target.value;
                  if (email && !formData.team_members.includes(email)) {
                    setFormData({...formData, team_members: [...formData.team_members, email]})
                  }
                }}
                onFocus={() => setFocusedField('team')}
                onBlur={() => setFocusedField(null)}
                value=""
              >
                <option value="">เลือกสมาชิกเพิ่ม...</option>
                {allUsers?.filter(u => u.email !== currentUser?.email).map((user: any) => (
                  <option key={user.id} value={user.email} style={{ background: t.card }}>
                    {user.full_name || user.email}
                  </option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: '15px', top: '38px', color: t.accent, pointerEvents: 'none' }}>▼</div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                {formData.team_members.map(email => (
                  <span key={email} style={{ background: 'rgba(255,107,0,0.1)', color: t.accent, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {email.split('@')[0]} 
                    <button type="button" onClick={() => setFormData({...formData, team_members: formData.team_members.filter(m => m !== email)})} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: 0 }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* จำนวนสูงสุด และ กำหนดส่ง */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px', fontWeight: 'bold' }}>จำนวนสมาชิกสูงสุด</label>
                <select 
                  style={{ ...fieldStyle('max'), appearance: 'none', cursor: 'pointer' } as any} 
                  value={formData.max_assignees}
                  onChange={(e) => setFormData({...formData, max_assignees: parseInt(e.target.value)})}
                  onFocus={() => setFocusedField('max')}
                  onBlur={() => setFocusedField(null)}
                >
                  {[1, 2, 3, 4, 5, 10].map(n => (
                    <option key={n} value={n} style={{ background: t.card }}>{n} คน</option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '15px', top: '38px', color: t.accent, pointerEvents: 'none' }}>▼</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px', fontWeight: 'bold' }}>กำหนดส่ง (Deadline)</label>
                <input 
                  type="date" 
                  style={{ ...fieldStyle('date'), colorScheme: 'dark' } as any} 
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px', fontWeight: 'bold' }}>รายละเอียดภารกิจ</label>
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
                {isSubmitting ? 'กำลังเชื่อมต่อระบบ...' : '+ ยืนยันการสร้างภารกิจ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}