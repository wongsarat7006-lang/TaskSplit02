'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useUser } from '../../context/UserContext'
import { useTasks } from '../../context/TaskContext'

export default function ProfilePage() {
  const { user, updateUser, changePassword } = useUser()
  const { tasks, isDarkMode } = useTasks() 
  
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null) // State สำหรับรูปภาพ

  const fileInputRef = useRef<HTMLInputElement>(null)

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
      setPhone(user.phone || '')
      setBio(user.bio || '')
      setAvatar(user.avatar || null)
    }
  }, [user])

  const myTasks = tasks?.filter(t => t.assignee === user?.name) || []
  const todoCount = myTasks.filter(t => t.status === 'todo').length
  const doingCount = myTasks.filter(t => t.status === 'doing').length
  const doneCount = myTasks.filter(t => t.status === 'done').length

  const handleSave = () => {
    // เพิ่มการบันทึกรูปภาพเข้าไปในฟังก์ชันอัปเดต
    updateUser({ name, email, phone, bio, avatar })
    setIsEditing(false)
    alert('บันทึกข้อมูลเรียบร้อยแล้ว')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setAvatar(imageUrl)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) { alert('รหัสผ่านใหม่ไม่ตรงกัน'); return }
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
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: theme.text }}>Profile Settings</h1>
            <p style={{ fontSize: '15px', color: theme.subText, margin: '6px 0 0 0' }}>จัดการข้อมูลส่วนตัวและดูภาพรวมงาน</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/tasks" style={{...btnBase, background: isDarkMode ? '#4f46e5' : '#111827', color: '#fff'}}>บอร์ดงาน</Link>
            <Link href="/" style={{...btnBase, background: theme.card, color: theme.text, border: `1px solid ${theme.border}`}}>หน้าแรก</Link>
          </div>
        </header>

        {/* ส่วนรูปโปรไฟล์และสถิติ */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
            {/* Avatar Card */}
            <div style={{ 
                background: theme.card, 
                padding: '32px', 
                borderRadius: '16px', 
                border: `1px solid ${theme.border}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '250px'
            }}>
                <div style={{ position: 'relative' }}>
                    <div style={{ 
                        width: '120px', 
                        height: '120px', 
                        borderRadius: '50%', 
                        overflow: 'hidden', 
                        background: '#e5e7eb',
                        border: `4px solid ${isDarkMode ? '#333' : '#fff'}`,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                        {avatar ? (
                            <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>👤</div>
                        )}
                    </div>
                    {isEditing && (
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            style={{ 
                                position: 'absolute', bottom: 0, right: 0, 
                                background: '#2563eb', color: '#fff', border: 'none', 
                                borderRadius: '50%', width: '32px', height: '32px', 
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}
                        >
                            📷
                        </button>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden accept="image/*" />
                </div>
                <h3 style={{ color: theme.text, marginTop: '16px', marginBottom: '4px' }}>{name || 'User'}</h3>
                <p style={{ color: theme.subText, fontSize: '14px', margin: 0 }}>{email}</p>
            </div>

            {/* Stats Grid */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', flex: 1 }}>
                <StatCard label="งานที่ต้องทำ" count={todoCount} color="#64748b" icon="📝" theme={theme} />
                <StatCard label="กำลังทำ" count={doingCount} color="#f59e0b" icon="⚙️" theme={theme} />
                <StatCard label="สำเร็จแล้ว" count={doneCount} color="#22c55e" icon="✅" theme={theme} />
            </section>
        </div>

        <div style={{ background: theme.card, borderRadius: '16px', padding: '32px', marginBottom: '24px', border: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: theme.text }}>👤 ข้อมูลส่วนตัว</h2>
            <button onClick={isEditing ? handleSave : () => setIsEditing(true)} style={{ ...btnBase, background: isEditing ? '#10b981' : (isDarkMode ? '#4f46e5' : '#111827'), color: '#fff', border: 'none' }}>
              {isEditing ? '✓ บันทึก' : '✏️ แก้ไข'}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <InputGroup label="ชื่อผู้ใช้" value={name} onChange={setName} disabled={!isEditing} theme={theme} />
            <InputGroup label="อีเมล" value={email} onChange={setEmail} disabled={!isEditing} theme={theme} />
            <InputGroup label="เบอร์โทรศัพท์" value={phone} onChange={setPhone} disabled={!isEditing} theme={theme} />
          </div>
        </div>

        <div style={{ background: theme.card, borderRadius: '16px', padding: '32px', border: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: theme.text }}>🔒 ความปลอดภัย</h2>
            <button onClick={() => setShowPasswordChange(!showPasswordChange)} style={{ ...btnBase, background: showPasswordChange ? '#6b7280' : '#dc2626', color: '#fff', border: 'none' }}>
              {showPasswordChange ? '✕ ยกเลิก' : '🔑 เปลี่ยนรหัสผ่าน'}
            </button>
          </div>
          {showPasswordChange && (
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <InputGroup label="รหัสผ่านปัจจุบัน" value={currentPassword} onChange={setCurrentPassword} type="password" theme={theme} />
              <InputGroup label="รหัสผ่านใหม่" value={newPassword} onChange={setNewPassword} type="password" theme={theme} />
              <InputGroup label="ยืนยันรหัสผ่านใหม่" value={confirmPassword} onChange={setConfirmPassword} type="password" theme={theme} />
              <button onClick={handleChangePassword} style={{ ...btnBase, background: '#4f46e5', color: '#fff', border: 'none', width: 'fit-content' }}>ยืนยันเปลี่ยนรหัสผ่าน</button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

/* --- Helpers --- */
function StatCard({ label, count, color, icon, theme }: any) {
  return (
    <div style={{ background: theme.card, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.border}`, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
      <input type={type || 'text'} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', background: disabled ? theme.bg : theme.inputBg, color: theme.text, border: `1px solid ${theme.border}`, boxSizing: 'border-box' }} />
    </div>
  )
}

const btnBase = { padding: '10px 20px', borderRadius: '10px', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }