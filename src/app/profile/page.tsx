'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  
  // ข้อมูลโปรไฟล์
  const [name, setName] = useState('สมชาย ใจดี')
  const [email, setEmail] = useState('somchai@example.com')
  const [bio, setBio] = useState('นักพัฒนาเว็บแอปพลิเคชัน')
  const [phone, setPhone] = useState('081-234-5678')
  
  // ข้อมูลรหัสผ่าน
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSave = () => {
    setIsEditing(false)
    alert('บันทึกข้อมูลเรียบร้อยแล้ว')
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('รหัสผ่านใหม่ไม่ตรงกัน')
      return
    }
    alert('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว')
    setShowPasswordChange(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
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
                fontWeight: 700,
                margin: 0,
                color: '#1a1a1a',
              }}
            >
              👤 โปรไฟล์
            </h1>
            <p
              style={{
                fontSize: '15px',
                color: '#78716c',
                margin: '6px 0 0 0',
              }}
            >
              จัดการข้อมูลส่วนตัวของคุณ
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              href="/tasks"
              style={{
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#1a1a1a',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                border: '2px solid rgba(0,0,0,0.1)',
              }}
            >
              บอร์ดงาน
            </Link>
            <Link
              href="/"
              style={{
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#1a1a1a',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                border: '2px solid rgba(0,0,0,0.1)',
              }}
            >
              หน้าแรก
            </Link>
          </div>
        </div>

        {/* การ์ดโปรไฟล์ */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '3px solid #60a5fa',
            marginBottom: '24px',
          }}
        >
          {/* ปุ่มแก้ไขโปรไฟล์ */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              style={{
                padding: '10px 20px',
                background: '#eab308',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isEditing ? '💾 บันทึก' : '✏️ แก้ไขโปรไฟล์'}
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
                width: '180px',
                height: '180px',
                background: '#6b7280',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px',
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
                  fontSize: '14px',
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
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: isEditing ? '#fff' : '#f9fafb',
                  color: '#1a1a1a',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* อีเมล */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
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
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: isEditing ? '#fff' : '#f9fafb',
                  color: '#1a1a1a',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* เบอร์โทรศัพท์ */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
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
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: isEditing ? '#fff' : '#f9fafb',
                  color: '#1a1a1a',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* ข้อมูลเพิ่มเติม */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
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
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: isEditing ? '#fff' : '#f9fafb',
                  color: '#1a1a1a',
                  boxSizing: 'border-box',
                  resize: 'none',
                }}
              />
            </div>
          </div>

          {/* จุด 3 จุด */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '32px',
            }}
          >
            <div style={{ width: '8px', height: '8px', background: '#9ca3af', borderRadius: '50%' }} />
            <div style={{ width: '8px', height: '8px', background: '#9ca3af', borderRadius: '50%' }} />
            <div style={{ width: '8px', height: '8px', background: '#9ca3af', borderRadius: '50%' }} />
          </div>
        </div>

        {/* การ์ดเปลี่ยนรหัสผ่าน */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '2px solid #ef4444',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#1a1a1a' }}>
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
                background: showPasswordChange ? '#6b7280' : '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {showPasswordChange ? 'ยกเลิก' : 'เปลี่ยนรหัสผ่าน'}
            </button>
          </div>

          {showPasswordChange && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              {/* รหัสผ่านปัจจุบัน */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
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
                    padding: '12px 16px',
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
                    fontSize: '14px',
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
                  placeholder="กรอกรหัสผ่านใหม่"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
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
                    fontSize: '14px',
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
                    padding: '12px 16px',
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
                  background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '8px',
                }}
              >
                ✅ ยืนยันเปลี่ยนรหัสผ่าน
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}