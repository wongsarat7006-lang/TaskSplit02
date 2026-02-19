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
    bg:        isDarkMode ? '#0a0a0a' : '#fafaf8',
    card:      isDarkMode ? '#0f0f0f' : '#ffffff',
    text:      isDarkMode ? '#f0ede8' : '#111110',
    subText:   isDarkMode ? '#6a6a62' : '#7a7a72',
    border:    isDarkMode ? 'rgba(255,107,0,0.12)' : 'rgba(255,107,0,0.18)',
    borderStr: isDarkMode ? 'rgba(255,107,0,0.35)' : 'rgba(255,107,0,0.45)',
    inputBg:   isDarkMode ? '#0a0a0a' : '#fafaf8',
    grid:      isDarkMode ? 'rgba(255,107,0,0.035)' : 'rgba(255,107,0,0.06)',
    disabledBg:isDarkMode ? '#0d0d0d' : '#f0ede8',
    statBg:    isDarkMode ? '#0f0f0f' : '#ffffff',
  }

  const thaiFont = "'Sarabun', sans-serif"
  const engFont  = "'Bebas Neue', 'Impact', sans-serif"
  const monoFont = "'Courier New', monospace"

  useEffect(() => {
    if (user) {
      setName(user.name); setEmail(user.email)
      setPhone(user.phone || ''); setBio(user.bio || '')
      setAvatar(user.avatar || null)
    }
  }, [user])

  const myTasks = tasks?.filter(task => task.assignee === user?.name) || []
  const todoCount  = myTasks.filter(task => task.status === 'todo').length
  const doingCount = myTasks.filter(task => task.status === 'doing').length
  const doneCount  = myTasks.filter(task => task.status === 'done').length
  const total      = myTasks.length
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
    width: '100%', padding: '13px 16px',
    background: disabled ? t.disabledBg : t.inputBg,
    border: `1px solid ${focusedField === key ? 'rgba(255,107,0,0.6)' : t.border}`,
    borderRadius: '6px', outline: 'none',
    fontFamily: thaiFont, fontSize: '14px', color: disabled ? t.subText : t.text,
    boxSizing: 'border-box' as const,
    transition: 'all 0.2s ease',
    cursor: disabled ? 'not-allowed' : 'text',
    boxShadow: focusedField === key ? '0 0 12px rgba(255,107,0,0.08)' : 'none',
  })

  return (
    <main style={{ minHeight: '100vh', background: t.bg, color: t.text, fontFamily: thaiFont, position: 'relative', overflow: 'hidden', transition: 'background 0.3s ease', padding: '40px 32px' }}>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div style={{ position: 'fixed', top: '-200px', right: '-200px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <div style={{ fontFamily: monoFont, fontSize: '11px', color: '#ff6b00', letterSpacing: '0.2em', marginBottom: '8px' }}>// USER PROFILE</div>
            <h1 style={{ fontFamily: engFont, fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, lineHeight: 0.95, margin: 0, textTransform: 'uppercase', letterSpacing: '-1px' }}>
              <span style={{ color: t.text }}>MY </span>
              <span style={{ color: '#ff6b00', textShadow: '0 0 30px rgba(255,107,0,0.3)' }}>PROFILE</span>
            </h1>
            <p style={{ fontFamily: thaiFont, fontSize: '14px', color: t.subText, marginTop: '8px' }}>จัดการข้อมูลส่วนตัวและดูภาพรวมงาน</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/tasks" style={{ display: 'inline-flex', alignItems: 'center', background: '#ff6b00', color: '#0a0a0a', padding: '12px 24px', borderRadius: '4px', textDecoration: 'none', fontFamily: thaiFont, fontSize: '14px', fontWeight: 700, boxShadow: '0 0 20px rgba(255,107,0,0.25)', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#ff8533'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#ff6b00'}
            >บอร์ดงาน</Link>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', background: 'transparent', color: t.subText, padding: '12px 24px', borderRadius: '4px', textDecoration: 'none', fontFamily: thaiFont, fontSize: '14px', fontWeight: 600, border: `1px solid ${t.border}`, transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = t.borderStr; (e.currentTarget as HTMLElement).style.color = t.text }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = t.border; (e.currentTarget as HTMLElement).style.color = t.subText }}
            >หน้าแรก</Link>
          </div>
        </header>

        {/* Top Row: Avatar + Stats */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>

          {/* Avatar Card */}
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '220px', flexShrink: 0, position: 'relative', overflow: 'hidden', transition: 'background 0.3s ease' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #ff6b00, transparent)' }} />

            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: `2px solid ${t.borderStr}`, boxShadow: '0 0 20px rgba(255,107,0,0.15)', background: isDarkMode ? '#1a1a1a' : '#f0ede8' }}>
                {avatar ? (
                  <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ff6b00, #cc4400)', color: '#fff', fontFamily: engFont, fontSize: '40px', fontWeight: 900 }}>
                    {name ? name[0].toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              {isEditing && (
                <button onClick={() => fileInputRef.current?.click()} style={{ position: 'absolute', bottom: '-6px', right: '-6px', background: '#ff6b00', color: '#0a0a0a', border: 'none', borderRadius: '4px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', boxShadow: '0 0 12px rgba(255,107,0,0.4)' }}>📷</button>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden accept="image/*" />
            </div>

            <h3 style={{ fontFamily: thaiFont, color: t.text, margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, textAlign: 'center' }}>{name || 'User'}</h3>
            <p style={{ fontFamily: thaiFont, color: t.subText, fontSize: '12px', margin: 0, textAlign: 'center' }}>{email}</p>

            {/* Progress */}
            <div style={{ width: '100%', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontFamily: thaiFont, fontSize: '12px', color: t.subText }}>ความสำเร็จ</span>
                <span style={{ fontFamily: engFont, fontSize: '18px', fontWeight: 900, color: '#ff6b00' }}>{donePercent}%</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${donePercent}%`, height: '100%', background: 'linear-gradient(90deg, #ff6b00, #ff9944)', boxShadow: '0 0 8px rgba(255,107,0,0.4)', transition: 'width 0.8s ease' }} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', flex: 1, background: t.borderStr, borderRadius: '10px', overflow: 'hidden', alignSelf: 'stretch' }}>
            {[
              { label: 'งานที่ต้องทำ', count: todoCount, color: t.subText,  eng: 'TO DO' },
              { label: 'กำลังทำ',      count: doingCount,color: '#ffaa44',  eng: 'IN PROGRESS' },
              { label: 'สำเร็จแล้ว',   count: doneCount, color: '#ff6b00',  eng: 'DONE' },
            ].map((s, i) => (
              <div key={i} style={{ background: t.statBg, padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'background 0.3s ease' }}>
                <div style={{ fontFamily: engFont, fontSize: '52px', fontWeight: 900, color: s.color, lineHeight: 1, textShadow: s.color === '#ff6b00' ? '0 0 20px rgba(255,107,0,0.3)' : 'none' }}>{s.count}</div>
                <div style={{ fontFamily: monoFont, fontSize: '10px', color: t.subText, letterSpacing: '0.15em', marginTop: '6px' }}>{s.eng}</div>
                <div style={{ fontFamily: thaiFont, fontSize: '13px', color: s.color, marginTop: '2px', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Info */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '32px', marginBottom: '16px', position: 'relative', overflow: 'hidden', transition: 'background 0.3s ease' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #ff6b00, transparent)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <div style={{ fontFamily: monoFont, fontSize: '10px', color: '#ff6b00', letterSpacing: '0.2em', marginBottom: '4px' }}>// PERSONAL INFO</div>
              <h2 style={{ fontFamily: thaiFont, fontSize: '22px', fontWeight: 700, margin: 0, color: t.text }}>ข้อมูลส่วนตัว</h2>
            </div>
            <button onClick={isEditing ? handleSave : () => setIsEditing(true)}
              style={{ padding: '11px 28px', background: isEditing ? '#22c55e' : '#ff6b00', color: '#0a0a0a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: thaiFont, fontSize: '15px', fontWeight: 700, boxShadow: isEditing ? '0 0 20px rgba(34,197,94,0.25)' : '0 0 20px rgba(255,107,0,0.25)', transition: 'all 0.2s ease' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
            >{isEditing ? '✓ บันทึก' : '✏ แก้ไข'}</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FieldGroup label="ชื่อผู้ใช้" value={name} onChange={setName} disabled={!isEditing} fieldStyle={fieldStyle} setFocusedField={setFocusedField} fieldKey="name" thaiFont={thaiFont} />
            <FieldGroup label="อีเมล" value={email} onChange={setEmail} disabled={!isEditing} fieldStyle={fieldStyle} setFocusedField={setFocusedField} fieldKey="email" thaiFont={thaiFont} />
            <FieldGroup label="เบอร์โทรศัพท์" value={phone} onChange={setPhone} disabled={!isEditing} fieldStyle={fieldStyle} setFocusedField={setFocusedField} fieldKey="phone" thaiFont={thaiFont} />
          </div>
        </div>

        {/* Security */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '32px', position: 'relative', overflow: 'hidden', transition: 'background 0.3s ease' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #ef4444, transparent)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: monoFont, fontSize: '10px', color: '#ef4444', letterSpacing: '0.2em', marginBottom: '4px' }}>// SECURITY</div>
              <h2 style={{ fontFamily: thaiFont, fontSize: '22px', fontWeight: 700, margin: 0, color: t.text }}>ความปลอดภัย</h2>
            </div>
            <button onClick={() => setShowPasswordChange(!showPasswordChange)}
              style={{ padding: '11px 28px', background: showPasswordChange ? 'transparent' : '#ef4444', color: showPasswordChange ? t.subText : '#fff', border: showPasswordChange ? `1px solid ${t.border}` : 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: thaiFont, fontSize: '15px', fontWeight: 700, transition: 'all 0.2s ease' }}
            >{showPasswordChange ? '✕ ยกเลิก' : '🔑 เปลี่ยนรหัสผ่าน'}</button>
          </div>

          {showPasswordChange && (
            <div style={{ marginTop: '28px', paddingTop: '28px', borderTop: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <FieldGroup label="รหัสผ่านปัจจุบัน" value={currentPassword} onChange={setCurrentPassword} type="password" fieldStyle={fieldStyle} setFocusedField={setFocusedField} fieldKey="cur" thaiFont={thaiFont} />
                <FieldGroup label="รหัสผ่านใหม่" value={newPassword} onChange={setNewPassword} type="password" fieldStyle={fieldStyle} setFocusedField={setFocusedField} fieldKey="new" thaiFont={thaiFont} />
                <FieldGroup label="ยืนยันรหัสผ่านใหม่" value={confirmPassword} onChange={setConfirmPassword} type="password" fieldStyle={fieldStyle} setFocusedField={setFocusedField} fieldKey="conf" thaiFont={thaiFont} />
              </div>
              <button onClick={handleChangePassword}
                style={{ padding: '13px 32px', background: '#ff6b00', color: '#0a0a0a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: thaiFont, fontSize: '15px', fontWeight: 700, width: 'fit-content', boxShadow: '0 0 20px rgba(255,107,0,0.25)', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#ff8533'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#ff6b00'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
              >ยืนยันเปลี่ยนรหัสผ่าน</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sarabun:wght@400;500;600;700&display=swap');
        ::placeholder { color: ${isDarkMode ? '#2a2a22' : '#c0bdb8'} !important; }
      `}</style>
    </main>
  )
}

function FieldGroup({ label, value, onChange, disabled = false, type, fieldStyle, setFocusedField, fieldKey, thaiFont }: any) {
  return (
    <div style={{ width: '100%' }}>
      <label style={{ display: 'block', fontFamily: thaiFont, fontSize: '13px', fontWeight: 600, color: '#ff6b00', marginBottom: '8px' }}>{label}</label>
      <input type={type || 'text'} value={value} onChange={e => onChange(e.target.value)} disabled={disabled} onFocus={() => setFocusedField(fieldKey)} onBlur={() => setFocusedField(null)} style={fieldStyle(fieldKey, disabled)} />
    </div>
  )
}