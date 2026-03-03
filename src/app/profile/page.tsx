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

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setPhone(user.phone || '')
      setBio(user.bio || '')
      setAvatar(user.avatar || null)
    }
  }, [user])

  // ⭐ ใช้ email ที่ล็อกอินจริง
  const myTasks =
   tasks?.filter(task => task.author_email === user?.email) || []

  const todoCount = myTasks.filter(t => t.status === 'todo').length
  const doingCount = myTasks.filter(t => t.status === 'doing').length
  const doneCount = myTasks.filter(t => t.status === 'done').length
  const total = myTasks.length
  const donePercent = total > 0 ? Math.round((doneCount / total) * 100) : 0

  const handleSave = () => {
    updateUser({
      name,
      phone,
      bio,
      avatar,
    })
    setIsEditing(false)
    alert('บันทึกข้อมูลเรียบร้อยแล้ว')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAvatar(URL.createObjectURL(file))
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('รหัสผ่านใหม่ไม่ตรงกัน')
      return
    }

    const success = await changePassword(currentPassword, newPassword)
    if (success) {
      alert('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว')
      setShowPasswordChange(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      alert('รหัสผ่านปัจจุบันไม่ถูกต้อง')
    }
  }

  const t = {
    bg: isDarkMode ? '#0a0a0a' : '#fafaf8',
    card: isDarkMode ? '#0f0f0f' : '#ffffff',
    text: isDarkMode ? '#f0ede8' : '#111110',
    subText: isDarkMode ? '#6a6a62' : '#7a7a72',
    border: 'rgba(255,107,0,0.25)',
    inputBg: isDarkMode ? '#0d0d0d' : '#ffffff',
    accent: '#ff6b00',
    danger: '#ef4444',
  }

  return (
    <main style={{ minHeight: '100vh', background: t.bg, color: t.text, padding: '48px 20px', fontFamily: "'Sarabun', sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: t.accent, letterSpacing: '0.3em', marginBottom: 6 }}>
              // USER_PROFILE
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 900, margin: 0 }}>
              MY <span style={{ color: t.accent }}>PROFILE</span>
            </h1>
            <p style={{ marginTop: 6, color: t.subText, fontSize: 13 }}>
              จัดการข้อมูลส่วนตัวและติดตามสถานะงานของคุณ
            </p>
          </div>
          <Link
            href="/tasks"
            style={{
              background: t.accent,
              padding: '12px 24px',
              borderRadius: 999,
              color: '#000',
              fontWeight: 800,
              fontSize: 13,
              textDecoration: 'none',
              boxShadow: '0 0 24px rgba(255,107,0,0.35)',
              letterSpacing: 1,
            }}
          >
            GO TO BOARD
          </Link>
        </header>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'flex-start' }}>
          {/* Left: Avatar & Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Avatar */}
            <div
              style={{
                background: t.card,
                padding: 24,
                borderRadius: 16,
                border: `1px solid ${t.border}`,
                boxShadow: '0 18px 45px rgba(0,0,0,0.35)',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 120,
                    height: 120,
                    margin: '0 auto 16px',
                    borderRadius: 24,
                    overflow: 'hidden',
                    background: t.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {avatar ? (
                    <img src={avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 40, fontWeight: 900, color: '#000' }}>
                      {name?.[0] || 'U'}
                    </span>
                  )}
                </div>

                {isEditing && (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 999,
                        border: `1px solid ${t.border}`,
                        background: 'transparent',
                        color: t.subText,
                        fontSize: 12,
                        cursor: 'pointer',
                        marginBottom: 8,
                      }}
                    >
                      เปลี่ยนรูปโปรไฟล์
                    </button>
                    <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} />
                  </>
                )}

                <h2 style={{ margin: '8px 0 2px', fontSize: 20 }}>{name || 'ไม่ระบุชื่อ'}</h2>
                <p style={{ margin: 0, fontSize: 13, color: t.subText }}>{email}</p>
              </div>
            </div>

            {/* Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3,1fr)',
                gap: 10,
              }}
            >
              <Stat label="TO DO" value={todoCount} />
              <Stat label="DOING" value={doingCount} />
              <Stat label="DONE" value={doneCount} />
            </div>
          </div>

          {/* Right: Info & Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Info */}
            <div
              style={{
                background: t.card,
                padding: 28,
                borderRadius: 16,
                border: `1px solid ${t.border}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 18 }}>ข้อมูลส่วนตัว</h3>
                <button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 999,
                    border: 'none',
                    background: isEditing ? t.accent : 'rgba(255,255,255,0.06)',
                    color: isEditing ? '#000' : t.subText,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {isEditing ? 'SAVE' : 'EDIT'}
                </button>
              </div>

              <Field label="ชื่อผู้ใช้" value={name} onChange={setName} disabled={!isEditing} />
              <Field label="Email (ใช้ล็อกอิน)" value={email} disabled />
              <Field label="เบอร์โทร" value={phone} onChange={setPhone} disabled={!isEditing} />
              <Field label="Bio" value={bio} onChange={setBio} disabled={!isEditing} multiline />
            </div>

            {/* Password */}
            <div
              style={{
                background: t.card,
                padding: 24,
                borderRadius: 16,
                border: `1px solid ${t.border}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 16 }}>ความปลอดภัยบัญชี</h3>
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: `1px solid ${t.border}`,
                    background: 'transparent',
                    color: t.subText,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  CHANGE PASSWORD
                </button>
              </div>

              {showPasswordChange && (
                <div style={{ marginTop: 8 }}>
                  <Field label="รหัสผ่านเดิม" value={currentPassword} onChange={setCurrentPassword} type="password" />
                  <Field label="รหัสผ่านใหม่" value={newPassword} onChange={setNewPassword} type="password" />
                  <Field label="ยืนยันรหัสผ่านใหม่" value={confirmPassword} onChange={setConfirmPassword} type="password" />
                  <button
                    onClick={handleChangePassword}
                    style={{
                      marginTop: 8,
                      padding: '10px 18px',
                      borderRadius: 999,
                      border: 'none',
                      background: t.accent,
                      color: '#000',
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    CONFIRM
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function Field({ label, value, onChange, disabled, type = 'text', multiline }: any) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          disabled={disabled}
          onChange={e => onChange?.(e.target.value)}
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.15)',
            color: 'inherit',
            fontSize: 13,
            resize: 'vertical',
            minHeight: 72,
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          disabled={disabled}
          onChange={e => onChange?.(e.target.value)}
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.08)',
            background: disabled ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.18)',
            color: 'inherit',
            fontSize: 13,
          }}
        />
      )}
    </div>
  )
}

function Stat({ label, value }: any) {
  return (
    <div
      style={{
        padding: 16,
        background: 'rgba(0,0,0,0.4)',
        borderRadius: 14,
        textAlign: 'center',
        border: '1px solid rgba(255,107,0,0.25)',
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, letterSpacing: 1 }}>{label}</div>
    </div>
  )
}