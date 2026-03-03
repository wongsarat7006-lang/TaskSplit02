'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useUser } from '../../context/UserContext'
import { useTasks } from '../../context/TaskContext'
import { supabase } from '../../lib/supabaseClient'

export default function ProfilePage() {
  const { user, updateUser, changePassword } = useUser()
  const { tasks, isDarkMode } = useTasks()

  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // รหัสผ่าน
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file || !user) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatar(data.publicUrl)
      
    } catch (error: any) {
      alert('Error uploading image: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    await updateUser({
      name,
      phone,
      bio,
      avatar,
    })
    setIsEditing(false)
    alert('บันทึกข้อมูลเรียบร้อยแล้ว')
  }

  const myTasks = tasks?.filter(task => {
    if (!user?.email) return false
    const isOwner = task.author_email === user.email || task.user_id === user.id
    const inTeam = task.team_members?.includes(user.email)
    return isOwner || inTeam
  }) || []

  const todoCount = myTasks.filter(t => t.status === 'todo').length
  const doingCount = myTasks.filter(t => t.status === 'doing').length
  const doneCount = myTasks.filter(t => t.status === 'done').length

  // ✅ เพิ่มฟังก์ชันเปลี่ยนรหัสผ่านเข้าไป
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert('กรุณากรอกรหัสผ่านใหม่ให้ครบถ้วน')
      return
    }
    if (newPassword !== confirmPassword) {
      alert('รหัสผ่านใหม่ไม่ตรงกัน')
      return
    }
    
    // เรียกใช้ฟังก์ชันจาก Context
    const success = await changePassword(currentPassword, newPassword)
    
    if (success) {
      alert('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว')
      setShowPasswordChange(false)
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } else {
      alert('เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง')
    }
  }

  const t = {
    bg: isDarkMode ? '#0a0a0a' : '#fafaf8',
    card: isDarkMode ? '#0f0f0f' : '#ffffff',
    text: isDarkMode ? '#f0ede8' : '#111110',
    subText: isDarkMode ? '#6a6a62' : '#7a7a72',
    border: 'rgba(255,107,0,0.25)',
    accent: '#ff6b00',
  }

  return (
    <main style={{ minHeight: '100vh', background: t.bg, color: t.text, padding: '48px 20px', fontFamily: "'Sarabun', sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: t.accent, letterSpacing: '0.3em', marginBottom: 6 }}>// USER_PROFILE</div>
            <h1 style={{ fontSize: 48, fontWeight: 900, margin: 0 }}>MY <span style={{ color: t.accent }}>PROFILE</span></h1>
            <p style={{ margin: 0, fontSize: 14, color: t.subText }}>จัดการข้อมูลส่วนตัวและติดตามสถานะงานของคุณ</p>
          </div>
          <Link href="/tasks" style={{ background: t.accent, padding: '12px 24px', borderRadius: 999, color: '#000', fontWeight: 800, fontSize: 13, textDecoration: 'none', boxShadow: '0 0 24px rgba(255,107,0,0.35)' }}>GO TO BOARD</Link>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: t.card, padding: 24, borderRadius: 16, border: `1px solid ${t.border}`, boxShadow: '0 18px 45px rgba(0,0,0,0.35)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 120, height: 120, margin: '0 auto 16px', borderRadius: 24, overflow: 'hidden', background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {avatar ? (
                    <img src={avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" />
                  ) : (
                    <span style={{ fontSize: 40, fontWeight: 900, color: '#000' }}>{name?.[0] || 'U'}</span>
                  )}
                  {uploading && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>Uploading...</div>}
                </div>

                {isEditing && (
                  <>
                    <button onClick={() => fileInputRef.current?.click()} style={{ padding: '8px 14px', borderRadius: 999, border: `1px solid ${t.border}`, background: 'transparent', color: t.text, fontSize: 12, cursor: 'pointer', marginBottom: 8 }}>
                      {uploading ? 'กำลังอัปโหลด...' : 'เปลี่ยนรูปโปรไฟล์'}
                    </button>
                    <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                  </>
                )}
                <h2 style={{ margin: '8px 0 2px', fontSize: 20 }}>{name || 'ไม่ระบุชื่อ'}</h2>
                <p style={{ margin: 0, fontSize: 13, color: t.subText }}>{email}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              <Stat label="TO DO" value={todoCount} t={t} />
              <Stat label="DOING" value={doingCount} t={t} />
              <Stat label="DONE" value={doneCount} t={t} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: t.card, padding: 28, borderRadius: 16, border: `1px solid ${t.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 18 }}>ข้อมูลส่วนตัว</h3>
                <button 
                   onClick={isEditing ? handleSave : () => setIsEditing(true)} 
                   disabled={uploading}
                   style={{ padding: '8px 18px', borderRadius: 999, border: 'none', background: isEditing ? t.accent : 'rgba(255,255,255,0.06)', color: isEditing ? '#000' : t.subText, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                >
                  {isEditing ? 'SAVE' : 'EDIT'}
                </button>
              </div>
              <Field label="ชื่อผู้ใช้" value={name} onChange={setName} disabled={!isEditing} t={t} />
              <Field label="Email (ใช้ล็อกอิน)" value={email} disabled t={t} />
              <Field label="เบอร์โทร" value={phone} onChange={setPhone} disabled={!isEditing} t={t} />
              <Field label="Bio" value={bio} onChange={setBio} disabled={!isEditing} multiline t={t} />
            </div>

            <div style={{ background: t.card, padding: 24, borderRadius: 16, border: `1px solid ${t.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 16 }}>ความปลอดภัยบัญชี</h3>
                <button onClick={() => setShowPasswordChange(!showPasswordChange)} style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${t.border}`, background: 'transparent', color: t.subText, fontSize: 12, cursor: 'pointer' }}>CHANGE PASSWORD</button>
              </div>
              {showPasswordChange && (
                <div style={{ marginTop: 8 }}>
                  <Field label="รหัสผ่านเดิม" value={currentPassword} onChange={setCurrentPassword} type="password" t={t} />
                  <Field label="รหัสผ่านใหม่" value={newPassword} onChange={setNewPassword} type="password" t={t} />
                  <Field label="ยืนยันรหัสผ่านใหม่" value={confirmPassword} onChange={setConfirmPassword} type="password" t={t} />
                  {/* ✅ ปุ่ม CONFIRM ของคุณ เชื่อมฟังก์ชันแล้ว */}
                  <button onClick={handleChangePassword} style={{ marginTop: 8, padding: '10px 18px', borderRadius: 999, border: 'none', background: t.accent, color: '#000', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>CONFIRM</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function Field({ label, value, onChange, disabled, type = 'text', multiline, t }: any) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: t.text }}>{label}</label>
      {multiline ? (
        <textarea value={value} disabled={disabled} onChange={e => onChange?.(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.15)', color: 'inherit', fontSize: 13, resize: 'vertical', minHeight: 72 }} />
      ) : (
        <input type={type} value={value} disabled={disabled} onChange={e => onChange?.(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: disabled ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.18)', color: 'inherit', fontSize: 13 }} />
      )}
    </div>
  )
}

function Stat({ label, value, t }: any) {
  return (
    <div style={{ padding: 16, background: 'rgba(0,0,0,0.4)', borderRadius: 14, textAlign: 'center', border: `1px solid ${t.border}` }}>
      <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 4, color: t.text }}>{value}</div>
      <div style={{ fontSize: 12, letterSpacing: 1, color: t.subText }}>{label}</div>
    </div>
  )
}