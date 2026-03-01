'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTasks } from '../../../context/TaskContext'

export default function CreateTaskPage() {
  const { addTask, allUsers } = useTasks() 
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '', // ✅ หัวหน้างาน (ผู้รับผิดชอบหลัก)
    team_members: [] as string[], // ✅ รายชื่อสมาชิกในทีมเพิ่มเติม
    max_assignees: 1, 
    dueDate: '',
  })
  
  const [focusedField, setFocusedField] = useState<string | null>(null)

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
    await addTask(formData)
    router.push('/')
  }

  return (
    <main style={{ minHeight: '100vh', background: t.bg, color: t.text, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '550px', background: t.card, border: `1px solid ${t.border}`, borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ height: '3px', background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)` }} />

        <div style={{ padding: '40px' }}>
          <header style={{ marginBottom: '30px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: t.accent, letterSpacing: '3px' }}>// ASSIGNMENT CONFIG</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', margin: '5px 0 0 0' }}>NEW <span style={{ color: t.accent }}>TASK</span></h1>
          </header>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* แถวที่ 1: หัวข้องาน */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px' }}>หัวข้องาน *</label>
              <input 
                style={fieldStyle('title')} 
                placeholder="ชื่อกิจกรรม" 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                onFocus={() => setFocusedField('title')} 
                onBlur={() => setFocusedField(null)} 
              />
            </div>

            {/* ✅ แถวที่ 2: หัวหน้างาน / ผู้รับผิดชอบหลัก (แยกแถวเดี่ยว) */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px' }}>หัวหน้างาน / ผู้รับผิดชอบหลัก</label>
              <select 
                style={{ ...fieldStyle('assignee'), appearance: 'none', cursor: 'pointer' }}
                value={formData.assignee}
                onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                onFocus={() => setFocusedField('assignee')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="" disabled>รายชื่อผู้รับผิดชอบหลัก</option>
                {allUsers?.map((user: any) => (
                  <option key={user.id} value={user.full_name || user.email} style={{ background: t.card }}>
                    {user.full_name || user.email}
                  </option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: '15px', top: '38px', color: t.accent, pointerEvents: 'none', fontSize: '10px' }}>▼</div>
            </div>

            {/* ✅ แถวที่ 3: สมาชิกในทีม (แยกแถวเดี่ยว - สามารถเลือกเพื่อนเพิ่มได้) */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px' }}>สมาชิกในทีม (Team Members)</label>
              <select 
                style={{ ...fieldStyle('team'), appearance: 'none', cursor: 'pointer' }}
                onChange={(e) => {
                    const val = e.target.value;
                    if (val && !formData.team_members.includes(val)) {
                        setFormData({...formData, team_members: [...formData.team_members, val]})
                    }
                }}
                onFocus={() => setFocusedField('team')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="">รายชื่อสมาชิก</option>
                {allUsers?.map((user: any) => (
                  <option key={user.id} value={user.full_name || user.email} style={{ background: t.card }}>
                    {user.full_name || user.email}
                  </option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: '15px', top: '38px', color: t.accent, pointerEvents: 'none', fontSize: '10px' }}>▼</div>
              
              {/* แสดงรายชื่อสมาชิกที่ถูกเลือก */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                {formData.team_members.map(member => (
                  <span key={member} style={{ background: '#1a1a1a', color: t.accent, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', border: `1px solid ${t.border}` }}>
                    {member} <button type="button" onClick={() => setFormData({...formData, team_members: formData.team_members.filter(m => m !== member)})} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', marginLeft: '5px' }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* แถวที่ 4: แถวคู่ - จำนวนสมาชิกที่เปิดรับ และ กำหนดส่ง */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px' }}>จำนวนคนรวม (Max)</label>
                <select 
                  style={{ ...fieldStyle('max'), appearance: 'none', cursor: 'pointer' }} 
                  value={formData.max_assignees}
                  onChange={(e) => setFormData({...formData, max_assignees: parseInt(e.target.value)})}
                  onFocus={() => setFocusedField('max')}
                  onBlur={() => setFocusedField(null)}
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n} style={{ background: t.card }}>{n} คน</option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '15px', top: '38px', color: t.accent, pointerEvents: 'none', fontSize: '10px' }}>▼</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px' }}>กำหนดส่ง</label>
                <input 
                  type="date" 
                  style={{ ...fieldStyle('date'), colorScheme: 'dark' }} 
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
            </div>

            {/* รายละเอียด */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: t.accent, marginBottom: '8px' }}>รายละเอียด</label>
              <textarea 
                style={{ ...fieldStyle('desc'), minHeight: '80px', resize: 'none' }} 
                placeholder="ใส่รายละเอียดงาน..." 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {/* ปุ่ม Action */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button type="button" onClick={() => router.back()} style={{ flex: 1, padding: '14px', background: 'transparent', border: `1px solid ${t.border}`, borderRadius: '8px', color: t.subText, cursor: 'pointer' }}>ยกเลิก</button>
              <button type="submit" style={{ flex: 2, padding: '14px', background: t.accent, border: 'none', borderRadius: '8px', color: '#000', fontWeight: 800, cursor: 'pointer' }}>
                + สร้างงานใหม่
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}