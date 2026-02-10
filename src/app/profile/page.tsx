// src/app/profile/page.tsx
'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useUser } from '../../context/UserContext'

export default function ProfilePage() {
  const { user, updateUser, changePassword } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  
  // ข้อมูลโปรไฟล์
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  
  // โหลดข้อมูล user เมื่อ component mount
  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setBio(user.bio || '')
      setPhone(user.phone || '')
    }
  }, [user])
  
  // ข้อมูลรหัสผ่าน
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSave = () => {
    updateUser({ name, email, phone, bio })
    setIsEditing(false)
    alert('บันทึกข้อมูลเรียบร้อยแล้ว')
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('รหัสผ่านใหม่ไม่ตรงกัน')
      return
    }
    
    if (newPassword.length < 6) {
      alert('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
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

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* ส่วนหัว */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 800,
                margin: 0,
                color: '#111827',
              }}
            >
              Profile Settings
            </h1>
            <p
              style={{
                fontSize: '15px',
                color: '#6b7280',
                margin: '6px 0 0 0',
              }}
            >
              จัดการข้อมูลส่วนตัวและความปลอดภัยของบัญชี
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              href="/tasks"
              style={{
                padding: '12px 24px',
                background: '#4f46e5',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              บอร์ดงาน
            </Link>
            <Link
              href="/"
              style={{
                padding: '12px 24px',
                background: '#ffffff',
                color: '#111827',
                textDecoration: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                border: '1px solid #e5e7eb',
              }}
            >
              หน้าแรก
            </Link>
          </div>
        </div>

        {/* การ์ดโปรไฟล์ */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            marginBottom: '24px',
          }}
        >
          {/* ส่วนหัวการ์ด */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
              paddingBottom: '20px',
              borderBottom: '1px solid #f3f4f6',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  margin: 0,
                  color: '#111827',
                }}
              >
                👤 ข้อมูลส่วนตัว
              </h2>
              <p
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '4px 0 0 0',
                }}
              >
                จัดการข้อมูลโปรไฟล์ของคุณ
              </p>
            </div>
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              style={{
                padding: '10px 20px',
                background: isEditing ? '#10b981' : '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isEditing ? '✓ บันทึก' : '✏️ แก้ไข'}
            </button>
          </div>

          {/* รูปโปรไฟล์ */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
              }}
            >
              👤
            </div>
          </div>

          {/* ฟอร์มข้อมูลส่วนตัว */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* ชื่อผู้ใช้ */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: isEditing ? '#fff' : '#f9fafb',
                  color: '#111827',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* อีเมล */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                อีเมล
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: isEditing ? '#fff' : '#f9fafb',
                  color: '#111827',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* เบอร์โทรศัพท์ */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: isEditing ? '#fff' : '#f9fafb',
                  color: '#111827',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* ข้อมูลเพิ่มเติม */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                เกี่ยวกับฉัน
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!isEditing}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: isEditing ? '#fff' : '#f9fafb',
                  color: '#111827',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>
        </div>

        {/* การ์ดเปลี่ยนรหัสผ่าน */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: showPasswordChange ? '24px' : '0',
            }}
          >
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#111827' }}>
                🔒 ความปลอดภัย
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                จัดการรหัสผ่านและความปลอดภัยของบัญชี
              </p>
            </div>
            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              style={{
                padding: '10px 20px',
                background: showPasswordChange ? '#6b7280' : '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {showPasswordChange ? '✕ ยกเลิก' : '🔑 เปลี่ยนรหัสผ่าน'}
            </button>
          </div>

          {showPasswordChange && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: '1px solid #f3f4f6',
              }}
            >
              {/* รหัสผ่านปัจจุบัน */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '8px',
                  }}
                >
                  รหัสผ่านปัจจุบัน
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านปัจจุบัน"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '15px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* รหัสผ่านใหม่ */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '8px',
                  }}
                >
                  รหัสผ่านใหม่
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '15px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* ยืนยันรหัสผ่านใหม่ */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '8px',
                  }}
                >
                  ยืนยันรหัสผ่านใหม่
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '15px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* ปุ่มยืนยันเปลี่ยนรหัสผ่าน */}
              <button
                onClick={handleChangePassword}
                style={{
                  padding: '12px 24px',
                  background: '#4f46e5',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: '8px',
                }}
              >
                ✓ ยืนยันเปลี่ยนรหัสผ่าน
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}