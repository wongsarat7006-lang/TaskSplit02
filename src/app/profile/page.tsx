'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useUser } from '../../context/UserContext'
import { useTasks } from '../../context/TaskContext'

export default function ProfilePage() {
  const { user, updateUser, changePassword } = useUser()
  const { tasks, isDarkMode } = useTasks() 
  
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  
  // ข้อมูลโปรไฟล์
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  
  // --- 1. เพิ่ม State สำหรับรหัสผ่านที่หายไปกลับมา ---
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const theme = {
    bg: isDarkMode ? '#121212' : '#f8fafc',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#111827',
    subText: isDarkMode ? '#9ca3af' : '#6b7280',
    border: isDarkMode ? '#333333' : '#e5e7eb',
    inputBg: isDarkMode ? '#2d2d2d' : '#ffffff'
  }

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setBio(user.bio || '')
      setPhone(user.phone || '')
    }
  }, [user])

  const myTasks = tasks.filter(t => t.assignee === user?.name)
  const todoCount = myTasks.filter(t => t.status === 'todo').length
  const doingCount = myTasks.filter(t => t.status === 'doing').length
  const doneCount = myTasks.filter(t => t.status === 'done').length

  const handleSave = () => {
    updateUser({ name, email, phone, bio })
    setIsEditing(false)
    alert('บันทึกข้อมูลเรียบร้อยแล้ว')
  }

  // --- 2. ฟังก์ชันจัดการเปลี่ยนรหัสผ่าน ---
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('รหัสผ่านใหม่ไม่ตรงกัน'); return
    }
    if (newPassword.length < 6) {
      alert('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'); return
    }
    
    const success = await changePassword(currentPassword, newPassword)
    if (success) {
      alert('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว')
      setShowPasswordChange(false)
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } else {
      alert('รหัสผ่านปัจจุบันไม่ถูกต้อง')
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: theme.bg, padding: '40px 24px', transition: 'all 0.3s' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: theme.text }}>Profile Settings</h1>
            <p style={{ fontSize: '15px', color: theme.subText, margin: '6px 0 0 0' }}>จัดการข้อมูลส่วนตัวและดูภาพรวมงานของคุณ</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/tasks" style={{...secondaryButtonStyle, background: isDarkMode ? '#4f46e5' : '#1e1e1f'}}>บอร์ดงาน</Link>
            <Link href="/" style={{...whiteButtonStyle, background: theme.card, color: theme.text, border: `1px solid ${theme.border}`}}>หน้าแรก</Link>
          </div>
        </header>

        {/* สถิติงาน */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <StatCard label="งานที่ต้องทำ" count={todoCount} color="#64748b" icon="📝" theme={theme} />
          <StatCard label="กำลังดำเนินการ" count={doingCount} color="#f59e0b" icon="⚙️" theme={theme} />
          <StatCard label="เสร็จสิ้นแล้ว" count={doneCount} color="#22c55e" icon="✅" theme={theme} />
        </section>

        {/* ข้อมูลส่วนตัว */}
        <div style={{ ...cardStyle, background: theme.card, border: `1px solid ${theme.border}` }}>
          <div style={{ ...cardHeaderStyle, borderBottom: `1px solid ${theme.border}` }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: theme.text }}>👤 ข้อมูลส่วนตัว</h2>
            <button 
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              style={{ ...primaryButtonStyle, background: isEditing ? '#10b981' : (isDarkMode ? '#4f46e5' : '#2b2b2b') }}
            >
              {isEditing ? '✓ บันทึก' : '✏️ แก้ไข'}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <InputGroup label="ชื่อผู้ใช้" value={name} onChange={setName} disabled={!isEditing} theme={theme} />
            <InputGroup label="อีเมล" value={email} onChange={setEmail} disabled={!isEditing} theme={theme} />
            <InputGroup label="เบอร์โทรศัพท์" value={phone} onChange={setPhone} disabled={!isEditing} theme={theme} />
          </div>
        </div>

        {/* --- 3. ส่วนความปลอดภัยที่หายไป กลับมาแล้ว --- */}
        <div style={{ ...cardStyle, background: theme.card, border: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: theme.text }}>🔒 ความปลอดภัย</h2>
              <p style={{ fontSize: '14px', color: theme.subText }}>จัดการรหัสผ่านและความปลอดภัย</p>
            </div>
            <button 
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              style={{ ...primaryButtonStyle, background: showPasswordChange ? '#6b7280' : '#dc2626' }}
            >
              {showPasswordChange ? '✕ ยกเลิก' : '🔑 เปลี่ยนรหัสผ่าน'}
            </button>
          </div>

          {showPasswordChange && (
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <InputGroup label="รหัสผ่านปัจจุบัน" value={currentPassword} onChange={setCurrentPassword} type="password" theme={theme} />
              <InputGroup label="รหัสผ่านใหม่" value={newPassword} onChange={setNewPassword} type="password" theme={theme} />
              <InputGroup label="ยืนยันรหัสผ่านใหม่" value={confirmPassword} onChange={setConfirmPassword} type="password" theme={theme} />
              <button onClick={handleChangePassword} style={{ ...primaryButtonStyle, background: '#4f46e5', marginTop: '8px' }}>
                ✓ ยืนยันเปลี่ยนรหัสผ่าน
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

/* ===== Sub-Components (StatCard & InputGroup เหมือนเดิม) ===== */
function StatCard({ label, count, color, icon, theme }: any) {
  return (
    <div style={{ background: theme.card, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '32px', fontWeight: 800, color: color }}>{count}</div>
      <div style={{ fontSize: '14px', color: theme.subText, fontWeight: 600 }}>{label}</div>
    </div>
  )
}

function InputGroup({ label, value, onChange, disabled, type, theme }: any) {
  return (
    <div style={{ width: '100%' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: theme.text, marginBottom: '8px' }}>{label}</label>
      <input
        type={type || 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', background: disabled ? theme.bg : theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }}
      />
    </div>
  )
}

const cardStyle: React.CSSProperties = { borderRadius: '16px', padding: '32px', marginBottom: '24px' }
const cardHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '20px' }
const primaryButtonStyle: React.CSSProperties = { padding: '10px 20px', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }
const secondaryButtonStyle: React.CSSProperties = { padding: '12px 24px', color: '#fff', textDecoration: 'none', borderRadius: '10px', fontWeight: 600 }
const whiteButtonStyle: React.CSSProperties = { padding: '12px 24px', textDecoration: 'none', borderRadius: '10px', fontWeight: 600 }