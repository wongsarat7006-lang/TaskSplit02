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
    tasks?.filter(task => task.userEmail === user?.email) || []

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
    <main style={{ minHeight: '100vh', background: t.bg, color: t.text, padding: '60px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 900 }}>
            MY <span style={{ color: t.accent }}>PROFILE</span>
          </h1>
          <Link href="/tasks" style={{ background: t.accent, padding: '12px 24px', borderRadius: '8px', color: '#000', fontWeight: 700 }}>
            GO TO BOARD
          </Link>
        </header>

        {/* Avatar */}
        <div style={{ background: t.card, padding: '30px', borderRadius: '16px', marginBottom: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 120, height: 120, margin: '0 auto 16px', borderRadius: 16, overflow: 'hidden', background: t.accent }}>
              {avatar ? (
                <img src={avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ fontSize: 48, fontWeight: 900, color: '#000', lineHeight: '120px' }}>
                  {name?.[0] || 'U'}
                </div>
              )}
            </div>

            {isEditing && (
              <>
                <button onClick={() => fileInputRef.current?.click()}>เปลี่ยนรูป</button>
                <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} />
              </>
            )}

            <h2>{name}</h2>
            <p>{email}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
          <Stat label="TO DO" value={todoCount} />
          <Stat label="DOING" value={doingCount} />
          <Stat label="DONE" value={doneCount} />
        </div>

        {/* Info */}
        <div style={{ background: t.card, padding: '30px', borderRadius: '16px', marginBottom: '24px' }}>
          <button onClick={isEditing ? handleSave : () => setIsEditing(true)}>
            {isEditing ? 'SAVE' : 'EDIT'}
          </button>

          <Field label="ชื่อผู้ใช้" value={name} onChange={setName} disabled={!isEditing} />
          <Field label="Email (ใช้ล็อกอิน)" value={email} disabled />
          <Field label="เบอร์โทร" value={phone} onChange={setPhone} disabled={!isEditing} />
          <Field label="Bio" value={bio} onChange={setBio} disabled={!isEditing} />
        </div>

        {/* Password */}
        <div style={{ background: t.card, padding: '30px', borderRadius: '16px' }}>
          <button onClick={() => setShowPasswordChange(!showPasswordChange)}>
            CHANGE PASSWORD
          </button>

          {showPasswordChange && (
            <>
              <Field label="รหัสผ่านเดิม" value={currentPassword} onChange={setCurrentPassword} type="password" />
              <Field label="รหัสผ่านใหม่" value={newPassword} onChange={setNewPassword} type="password" />
              <Field label="ยืนยันรหัสผ่านใหม่" value={confirmPassword} onChange={setConfirmPassword} type="password" />
              <button onClick={handleChangePassword}>CONFIRM</button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

function Field({ label, value, onChange, disabled, type = 'text' }: any) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={e => onChange?.(e.target.value)}
        style={{ width: '100%', padding: 12 }}
      />
    </div>
  )
}

function Stat({ label, value }: any) {
  return (
    <div style={{ padding: 20, background: '#111', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 32, fontWeight: 900 }}>{value}</div>
      <div>{label}</div>
    </div>
  )
}