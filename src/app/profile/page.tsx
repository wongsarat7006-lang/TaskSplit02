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
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const t = {
    bg: isDarkMode ? '#0a0a0a' : '#fafaf8',
    card: isDarkMode ? '#0f0f0f' : '#ffffff',
    text: isDarkMode ? '#f0ede8' : '#111110',
    subText: isDarkMode ? '#6a6a62' : '#7a7a72',
    border: isDarkMode ? 'rgba(255,107,0,0.12)' : 'rgba(255,107,0,0.18)',
    borderStr: isDarkMode ? 'rgba(255,107,0,0.35)' : 'rgba(255,107,0,0.45)',
    inputBg: isDarkMode ? '#0d0d0d' : '#ffffff',
    accent: '#ff6b00',
    danger: '#ef4444'
  }

  const thaiFont = "'Sarabun', sans-serif"
  const engFont = "'Bebas Neue', sans-serif"
  const monoFont = "'Courier New', monospace"

  useEffect(() => {
    if (user) {
      setName(user.name); setEmail(user.email)
      setPhone(user.phone || ''); setBio(user.bio || '')
      setAvatar(user.avatar || null)
    }
  }, [user])

  const myTasks = tasks?.filter(task => task.assignee === user?.name) || []
  const todoCount = myTasks.filter(task => task.status === 'todo').length
  const doingCount = myTasks.filter(task => task.status === 'doing').length
  const doneCount = myTasks.filter(task => task.status === 'done').length
  const total = myTasks.length
  const donePercent = total > 0 ? Math.round((doneCount / total) * 100) : 0

  const handleSave = () => {
    updateUser({ name, email, phone, bio, avatar })
    setIsEditing(false)
    alert('บันทึกข้อมูลเรียบร้อยแล้ว')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAvatar(URL.createObjectURL(file))
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) { alert('รหัสผ่านใหม่ไม่ตรงกัน'); return }
    const success = await changePassword(currentPassword, newPassword)
    if (success) {
      alert('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว')
      setShowPasswordChange(false)
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } else { alert('รหัสผ่านปัจจุบันไม่ถูกต้อง') }
  }

  const fieldStyle = (key: string, disabled = false) => ({
    width: '100%', padding: '15px 18px',
    background: disabled ? (isDarkMode ? '#080808' : '#f5f5f5') : t.inputBg,
    border: `1px solid ${focusedField === key ? t.accent : t.border}`,
    borderRadius: '10px', outline: 'none',
    fontFamily: thaiFont, fontSize: '15px', color: disabled ? t.subText : t.text,
    transition: 'all 0.25s ease',
    boxShadow: focusedField === key ? `0 0 15px rgba(255,107,0,0.15)` : 'none'
  })

  return (
    <main style={{ minHeight: '100vh', background: t.bg, color: t.text, fontFamily: thaiFont, padding: '60px 20px', position: 'relative' }}>
      
      {/* Background Decor */}
      <div style={{ position: 'fixed', inset: 0, opacity: 0.4, backgroundImage: `radial-gradient(${t.border} 1px, transparent 1px)`, backgroundSize: '40px 40px', zIndex: 0 }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Header Section */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <div style={{ fontFamily: monoFont, fontSize: '12px', color: t.accent, letterSpacing: '3px', marginBottom: '8px' }}>// SYSTEM_PROFILE</div>
            <h1 style={{ fontFamily: engFont, fontSize: '72px', fontWeight: 900, lineHeight: 0.8, margin: 0, letterSpacing: '-2px' }}>
              MY <span style={{ color: t.accent }}>PROFILE</span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/tasks" style={{ background: t.accent, color: '#000', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: `0 0 25px rgba(255,107,0,0.3)` }}>GO TO BOARD</Link>
          </div>
        </header>

        {/* Top Row: Avatar Card & Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Avatar Card */}
          <div style={{ background: t.card, borderRadius: '20px', padding: '40px 30px', border: `1px solid ${t.border}`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: `linear-gradient(90deg, ${t.accent}, transparent)` }} />
            
            <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 24px' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden', border: `2px solid ${t.accent}`, padding: '4px', background: t.card }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '18px', overflow: 'hidden', background: '#1a1a1a' }}>
                  {avatar ? (
                    <img src={avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px', fontWeight: 900, background: t.accent, color: '#000' }}>
                      {name?.[0] || 'U'}
                    </div>
                  )}
                </div>
              </div>
              {isEditing && (
                <button onClick={() => fileInputRef.current?.click()} style={{ position: 'absolute', bottom: '0', right: '0', background: t.accent, border: 'none', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>📷</button>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden accept="image/*" />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0' }}>{name}</h2>
            <p style={{ color: t.subText, fontSize: '14px', marginBottom: '30px' }}>{email}</p>

            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: t.subText }}>PROGRESS</span>
                <span style={{ color: t.accent, fontWeight: 900 }}>{donePercent}%</span>
              </div>
              <div style={{ height: '6px', background: isDarkMode ? '#1a1a1a' : '#eee', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${donePercent}%`, height: '100%', background: t.accent, boxShadow: `0 0 10px ${t.accent}`, transition: 'width 1s ease' }} />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: t.border, borderRadius: '20px', overflow: 'hidden', border: `1px solid ${t.border}` }}>
            {[
              { label: 'TO DO', sub: 'งานที่ต้องทำ', count: todoCount, color: t.subText },
              { label: 'IN PROGRESS', sub: 'กำลังทำ', count: doingCount, color: '#ffaa44' },
              { label: 'DONE', sub: 'สำเร็จแล้ว', count: doneCount, color: t.accent },
            ].map((s, i) => (
              <div key={i} style={{ background: t.card, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontFamily: engFont, fontSize: '80px', lineHeight: 1, color: s.color, fontWeight: 900 }}>{s.count}</div>
                <div style={{ fontFamily: monoFont, fontSize: '11px', letterSpacing: '2px', color: t.subText, margin: '12px 0 4px' }}>{s.label}</div>
                <div style={{ fontSize: '15px', color: s.color }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div style={{ background: t.card, borderRadius: '20px', padding: '40px', border: `1px solid ${t.border}`, marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
              <div style={{ fontFamily: monoFont, fontSize: '11px', color: t.accent, letterSpacing: '2px' }}>// BASIC_INFO</div>
              <h3 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>ข้อมูลส่วนตัว</h3>
            </div>
            <button onClick={isEditing ? handleSave : () => setIsEditing(true)} 
                    style={{ background: isEditing ? '#22c55e' : t.accent, color: '#000', border: 'none', padding: '12px 32px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', transition: '0.2s' }}>
              {isEditing ? '✓ SAVE CHANGES' : '✏ EDIT PROFILE'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <FieldGroup label="ชื่อผู้ใช้งาน" value={name} onChange={setName} disabled={!isEditing} fieldKey="n" setFocusedField={setFocusedField} fieldStyle={fieldStyle} thaiFont={thaiFont} />
            <FieldGroup label="อีเมลติดต่อ" value={email} onChange={setEmail} disabled={!isEditing} fieldKey="e" setFocusedField={setFocusedField} fieldStyle={fieldStyle} thaiFont={thaiFont} />
            <FieldGroup label="เบอร์โทรศัพท์" value={phone} onChange={setPhone} disabled={!isEditing} fieldKey="p" setFocusedField={setFocusedField} fieldStyle={fieldStyle} thaiFont={thaiFont} />
          </div>
        </div>

        {/* Security Card */}
        <div style={{ background: t.card, borderRadius: '20px', padding: '40px', border: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: monoFont, fontSize: '11px', color: t.danger, letterSpacing: '2px' }}>// SECURITY_SETTING</div>
              <h3 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>ความปลอดภัย</h3>
            </div>
            <button onClick={() => setShowPasswordChange(!showPasswordChange)} 
                    style={{ background: 'transparent', color: showPasswordChange ? t.subText : t.danger, border: `1px solid ${showPasswordChange ? t.border : t.danger}`, padding: '12px 24px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
              {showPasswordChange ? 'CANCEL' : 'CHANGE PASSWORD'}
            </button>
          </div>

          {showPasswordChange && (
            <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: `1px solid ${t.border}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                <FieldGroup label="รหัสผ่านเดิม" value={currentPassword} onChange={setCurrentPassword} type="password" fieldKey="cp" setFocusedField={setFocusedField} fieldStyle={fieldStyle} thaiFont={thaiFont} />
                <FieldGroup label="รหัสผ่านใหม่" value={newPassword} onChange={setNewPassword} type="password" fieldKey="np" setFocusedField={setFocusedField} fieldStyle={fieldStyle} thaiFont={thaiFont} />
                <FieldGroup label="ยืนยันรหัสผ่านใหม่" value={confirmPassword} onChange={setConfirmPassword} type="password" fieldKey="confp" setFocusedField={setFocusedField} fieldStyle={fieldStyle} thaiFont={thaiFont} />
              </div>
              <button onClick={handleChangePassword} style={{ background: t.accent, color: '#000', border: 'none', padding: '14px 32px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                CONFIRM NEW PASSWORD
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sarabun:wght@300;400;600;700&display=swap');
      `}</style>
    </main>
  )
}

function FieldGroup({ label, value, onChange, disabled, type, fieldKey, setFocusedField, fieldStyle, thaiFont }: any) {
  return (
    <div style={{ width: '100%' }}>
      <label style={{ display: 'block', color: '#ff6b00', fontSize: '13px', fontWeight: 700, marginBottom: '10px', letterSpacing: '1px' }}>{label.toUpperCase()}</label>
      <input 
        type={type || 'text'} 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        disabled={disabled}
        onFocus={() => setFocusedField(fieldKey)}
        onBlur={() => setFocusedField(null)}
        style={fieldStyle(fieldKey, disabled)}
      />
    </div>
  )
}