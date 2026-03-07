'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTasks } from '../../../../context/TaskContext'

export default function EditTaskPage({ params }: { params: { id: string } }) {
  const {
    tasks,
    allUsers,
    updateTask,
    isDarkMode,
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

  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // โปรไฟล์หัวหน้างาน (ใช้ assignee จากข้อมูลงาน)
  const ownerProfile = allUsers?.find((u: any) => u.email === formData.assignee)
  const ownerDisplayName = ownerProfile?.full_name || formData.assignee || ''

  // ช่องเลือกสมาชิกทีมตามจำนวน max_assignees
  const memberSlots = Array.from(
    { length: formData.max_assignees || 0 },
    (_, idx) => formData.team_members[idx] || ''
  )
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

  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  // -------------------- LOAD DATA --------------------
  useEffect(() => {
    const loadData = async () => {
      const taskToEdit = tasks.find(t => t.id === taskId)
      if (!taskToEdit) return
      if (taskToEdit.user_id && currentUser?.id && taskToEdit.user_id !== currentUser.id) {
        alert('มีสิทธิ์แก้ไขได้เฉพาะผู้สร้างงานเท่านั้น')
        router.replace('/tasks')
        return
      }

      const anyTask: any = taskToEdit
      const allTeam: string[] = Array.isArray(anyTask.team_members) ? anyTask.team_members : []
      const ownerEmail: string =
        anyTask.assignee ||
        anyTask.author_email ||
        currentUser?.email ||
        ''
      const nonOwnerMembers = allTeam.filter(email => email !== ownerEmail)

      setFormData({
        id: taskToEdit.id,
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        priority: taskToEdit.priority || 'medium',
        status: taskToEdit.status || 'todo',
        due_date: taskToEdit.due_date || '',
        category_id: taskToEdit.category_id || '',
        assignee: ownerEmail,
        team_members: nonOwnerMembers,
        max_assignees: anyTask.max_assignees || (nonOwnerMembers.length || 1),
      })

      setIsLoaded(true)
    }

    if (taskId && tasks.length > 0) loadData()
  }, [taskId, tasks, currentUser])

  // -------------------- SUBMIT --------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) return alert('กรุณาระบุหัวข้องาน')
    if (formData.due_date && formData.due_date < todayStr) return alert('ไม่สามารถเลือกวันสิ้นสุดงานเป็นวันในอดีตได้')

    setIsSubmitting(true)
    try {
      // รวมหัวหน้างานกลับเข้า team_members สำหรับบันทึกจริง
      const ownerEmail = formData.assignee
      const uniqueMembers = Array.from(
        new Set([ownerEmail, ...memberSlots.filter(Boolean)])
      )
      const nonOwnerMembers = uniqueMembers.filter(email => email !== ownerEmail)

      await updateTask({
        ...formData,
        team_members: uniqueMembers,
        // current_people: นับเฉพาะสมาชิกทีมที่ไม่ใช่หัวหน้างาน
        current_people: nonOwnerMembers.length,
      } as any)
      alert('บันทึกการแก้ไขสำเร็จ')
      router.push('/tasks')
    } catch (err: any) {
      console.error('[EditTaskPage] updateTask error', err)
      alert(err?.message || 'ไม่สามารถบันทึกการแก้ไขได้')
    } finally {
      setIsSubmitting(false)
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

          {/* หัวหน้างาน (ล็อกเป็นผู้สร้างงาน) */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#ff6b00', marginBottom: 8, fontWeight: 'bold' }}>
              หัวหน้างาน (Lead Agent)
            </label>
            <input
              style={fieldStyle('assignee')}
              value={ownerDisplayName}
              readOnly
            />
            <div style={{ marginTop: 6, fontSize: 11, color: t.subText }}>
              หัวหน้างานจะเป็นผู้สร้างงาน (email เดิมของงาน) โดยอัตโนมัติ
            </div>
          </div>

          {/* จำนวนสมาชิกสูงสุด */}
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <label style={{ display: 'block', fontSize: 13, color: '#ff6b00', marginBottom: 8, fontWeight: 'bold' }}>จำนวนสมาชิกสูงสุด</label>
            <select
              style={{ ...fieldStyle('max'), appearance: 'none', cursor: 'pointer' } as any}
              value={formData.max_assignees}
              onChange={e => {
                const newMax = parseInt(e.target.value, 10) || 1
                setFormData({
                  ...formData,
                  max_assignees: newMax,
                  team_members: memberSlots.slice(0, newMax),
                })
              }}
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

          {/* สมาชิกทีม */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#ff6b00', marginBottom: 8, fontWeight: 'bold' }}>สมาชิกทีม (Team Members)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {memberSlots.map((value, index) => {
                const usedInOtherSlots = memberSlots.filter((v, i) => i !== index && v)
                const availableUsers = allUsers
                  ?.filter((user: any) =>
                    user?.email &&
                    user.email !== formData.assignee &&
                    !usedInOtherSlots.includes(user.email)
                  )
                return (
                  <div key={index} style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: 12, color: t.subText, marginBottom: 6 }}>
                      สมาชิกคนที่ {index + 1}
                    </label>
                    <select
                      style={{ ...fieldStyle(`team-${index}`), appearance: 'none', cursor: 'pointer' } as any}
                      value={value}
                      onChange={e => {
                        const email = e.target.value
                        const updated = [...memberSlots]
                        updated[index] = email
                        setFormData({ ...formData, team_members: updated })
                      }}
                      onFocus={() => setFocusedField(`team-${index}`)}
                      onBlur={() => setFocusedField(null)}
                    >
                      <option value="">เลือกสมาชิก...</option>
                      {availableUsers?.map((user: any) => (
                        <option key={user.id} value={user.email}>
                          {user.full_name || user.email}
                        </option>
                      ))}
                    </select>
                    <div style={{ position: 'absolute', right: 15, top: 38, color: '#ff6b00', pointerEvents: 'none' }}>▼</div>
                  </div>
                )
              })}
              <div style={{ fontSize: 11, color: t.subText }}>
                เลือกสมาชิกได้สูงสุด {formData.max_assignees} คน (ไม่รวมหัวหน้างาน)
              </div>
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
                min={todayStr}
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

      </div>
    </main>
  )
}