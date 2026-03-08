'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTasks, Profile } from '../../context/TaskContext'
import { useToast } from '../../context/ToastContext'
import { useConfirm } from '../../context/ConfirmContext'
import { supabase } from '../../lib/supabaseClient'

export default function EmployeesPage() {
  const { allUsers = [], currentUser, isDarkMode, tasks = [] } = useTasks()
  const { toast } = useToast()
  const { confirm } = useConfirm()
  const router = useRouter()

  const [employees, setEmployees] = useState<Profile[]>(allUsers)
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null)
  const [newEmployee, setNewEmployee] = useState({ full_name: '', email: '', password: '' })

  useEffect(() => {
    setEmployees(allUsers)
  }, [allUsers])

  const t = isDarkMode
    ? {
        bg: '#050608',
        card: '#0b0c10',
        accent: '#ff6b00',
        text: '#f9fafb',
        subText: '#9ca3af',
        border: 'rgba(255,107,0,0.28)',
        row: '#111827',
      }
    : {
        bg: '#f3f4f6',
        card: '#ffffff',
        accent: '#ff6b00',
        text: '#111827',
        subText: '#6b7280',
        border: 'rgba(15,23,42,0.12)',
        row: '#f9fafb',
      }

  const engFont = "'Bebas Neue', sans-serif"

  const me = allUsers.find((u: any) => u.id === currentUser?.id)
  const isAdmin = me?.role === 'admin'

  useEffect(() => {
    if (currentUser && !isAdmin) {
      toast('หน้าจัดการพนักงานอนุญาตเฉพาะหัวหน้างาน / แอดมิน', 'error')
      router.replace('/tasks')
    }
  }, [currentUser, isAdmin, router, toast])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmployee.email) {
      toast('กรุณากรอกอีเมลพนักงาน', 'error')
      return
    }
    if (!newEmployee.password || newEmployee.password.length < 6) {
      toast('กรุณาตั้งรหัสผ่านอย่างน้อย 6 ตัวอักษร', 'error')
      return
    }
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()

      const res = await fetch('/api/admin/create-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: newEmployee.full_name,
          email: newEmployee.email,
          password: newEmployee.password,
          accessToken: session?.access_token,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'ไม่สามารถสร้างบัญชีพนักงานได้')

      if (json.profile) {
        setEmployees(prev => [json.profile as Profile, ...prev])
        setNewEmployee({ full_name: '', email: '', password: '' })
        toast('เพิ่มพนักงานสำเร็จ', 'success')
      }
    } catch (err: any) {
      toast(err.message || 'ไม่สามารถเพิ่มพนักงานได้', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (emp: Profile, patch: Partial<Profile>) => {
    if (!emp.id) return
    const updated = { ...emp, ...patch }
    setSavingId(emp.id)
    try {
      if (patch.email !== undefined && String(patch.email || '').trim() !== String(emp.email || '').trim()) {
        const { data: { session } } = await supabase.auth.getSession()
        const res = await fetch('/api/admin/update-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: emp.id,
            email: (updated.email || '').trim() || null,
            accessToken: session?.access_token,
          }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'อัปเดตอีเมลในระบบล็อกอินไม่สำเร็จ')
      }
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: updated.full_name || null,
          email: updated.email || null,
        })
        .eq('id', emp.id)
        .select('id, full_name, email, avatar_url, role, bio, phone')
        .single()
      if (error) throw error
      if (data) {
        setEmployees(prev => prev.map(e => (e.id === emp.id ? (data as Profile) : e)))
      }
    } catch (err: any) {
      toast(err.message || 'ไม่สามารถบันทึกข้อมูลพนักงานได้', 'error')
    } finally {
      setSavingId(null)
    }
  }

  const handleChangePassword = async (emp: Profile) => {
    if (!emp.id) return
    const newPassword = prompt(`ตั้งรหัสผ่านใหม่สำหรับ "${emp.full_name || emp.email}" (อย่างน้อย 6 ตัวอักษร):`)
    if (!newPassword || newPassword.length < 6) {
      if (newPassword !== null) toast('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'error')
      return
    }
    setSavingId(emp.id)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: emp.id,
          newPassword,
          accessToken: session?.access_token,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'เปลี่ยนรหัสผ่านไม่สำเร็จ')
      toast('เปลี่ยนรหัสผ่านสำเร็จ', 'success')
    } catch (err: any) {
      toast(err.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ', 'error')
    } finally {
      setSavingId(null)
    }
  }

  const handleDelete = async (emp: Profile) => {
    if (!emp.id) return
    if (currentUser && emp.id === currentUser.id) {
      toast('ไม่สามารถลบบัญชีของตัวเองจากรายการพนักงานได้', 'error')
      return
    }
    const ok = await confirm({
      message: `ต้องการลบพนักงาน "${emp.full_name || emp.email}" ใช่หรือไม่?`,
      confirmText: 'ลบ',
      danger: true,
    })
    if (!ok) return
    setSavingId(emp.id)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin/delete-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: emp.id,
          accessToken: session?.access_token,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'ไม่สามารถลบพนักงานได้')

      setEmployees(prev => prev.filter(e => e.id !== emp.id))
      toast('ลบพนักงานสำเร็จ', 'success')
    } catch (err: any) {
      toast(err.message || 'ไม่สามารถลบพนักงานได้', 'error')
    } finally {
      setSavingId(null)
    }
  }

  if (!currentUser) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: t.bg,
          color: t.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        กรุณาเข้าสู่ระบบเพื่อจัดการพนักงาน
      </div>
    )
  }

  if (currentUser && !isAdmin) {
    return null
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: t.bg,
        color: t.text,
        padding: 40,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28, borderBottom: `1px solid ${t.border}`, paddingBottom: 20 }}>
        <h1 style={{ fontFamily: engFont, fontSize: 48, margin: 0 }}>
          EMPLOYEE <span style={{ color: t.accent }}>MANAGEMENT</span>
        </h1>
        <p style={{ color: t.subText, marginTop: 4 }}>จัดการรายชื่อพนักงาน เพิ่ม แก้ไข และลบข้อมูล</p>
      </div>

      {/* ฟอร์มเพิ่มพนักงาน - รวมไว้ในกล่องเดียว */}
      <form
        onSubmit={handleCreate}
        style={{
          background: t.card,
          borderRadius: 16,
          border: `1px solid ${t.border}`,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: t.accent, marginBottom: 14 }}>เพิ่มพนักงานใหม่</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: 12,
            alignItems: 'end',
          }}
        >
          <div>
            <label style={{ fontSize: 11, color: t.subText, display: 'block', marginBottom: 4 }}>ชื่อพนักงาน</label>
            <input
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: `1px solid ${t.border}`,
                background: isDarkMode ? '#020617' : '#f9fafb',
                color: t.text,
                fontSize: 13,
              }}
              value={newEmployee.full_name}
              onChange={e => setNewEmployee({ ...newEmployee, full_name: e.target.value })}
              placeholder="เช่น สมชาย ใจดี"
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: t.subText, display: 'block', marginBottom: 4 }}>อีเมล *</label>
            <input
              type="email"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: `1px solid ${t.border}`,
                background: isDarkMode ? '#020617' : '#f9fafb',
                color: t.text,
                fontSize: 13,
              }}
              value={newEmployee.email}
              onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
              placeholder="employee@example.com"
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: t.subText, display: 'block', marginBottom: 4 }}>รหัสผ่านเริ่มต้น *</label>
            <input
              type="password"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: `1px solid ${t.border}`,
                background: isDarkMode ? '#020617' : '#f9fafb',
                color: t.text,
                fontSize: 13,
              }}
              value={newEmployee.password}
              onChange={e => setNewEmployee({ ...newEmployee, password: e.target.value })}
              placeholder="อย่างน้อย 6 ตัวอักษร"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              border: 'none',
              background: loading ? '#6b7280' : t.accent,
              color: '#000',
              fontWeight: 800,
              fontSize: 13,
              cursor: loading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'กำลังเพิ่ม...' : '+ เพิ่มพนักงาน'}
          </button>
        </div>
      </form>

      {/* Employees table */}
      <div
        style={{
          background: t.card,
          borderRadius: 16,
          border: `1px solid ${t.border}`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
            padding: '10px 16px',
            background: isDarkMode ? '#020617' : '#f9fafb',
            fontSize: 12,
            color: t.subText,
            fontWeight: 600,
          }}
        >
          <div>ชื่อพนักงาน</div>
          <div>อีเมล</div>
          <div style={{ textAlign: 'center' }}>รหัสผ่าน</div>
          <div style={{ textAlign: 'center' }}>โปรไฟล์</div>
          <div style={{ textAlign: 'right' }}>การจัดการ</div>
        </div>
        {employees.length === 0 ? (
          <div style={{ padding: 16, fontSize: 13, color: t.subText }}>ยังไม่มีข้อมูลพนักงาน</div>
        ) : (
          employees.map(emp => (
            <div
              key={emp.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
                padding: '10px 16px',
                background: t.row,
                borderTop: `1px solid ${t.border}`,
                alignItems: 'center',
                fontSize: 13,
              }}
            >
              <input
                style={{
                  width: '90%',
                  padding: '6px 8px',
                  borderRadius: 8,
                  border: `1px solid ${t.border}`,
                  background: isDarkMode ? '#020617' : '#ffffff',
                  color: t.text,
                  fontSize: 13,
                }}
                value={emp.full_name || ''}
                onChange={e => handleUpdate(emp, { full_name: e.target.value })}
                placeholder="ยังไม่ได้ระบุชื่อ"
              />
              <input
                style={{
                  width: '90%',
                  padding: '6px 8px',
                  borderRadius: 8,
                  border: `1px solid ${t.border}`,
                  background: isDarkMode ? '#020617' : '#ffffff',
                  color: t.text,
                  fontSize: 13,
                }}
                value={emp.email || ''}
                onChange={e => handleUpdate(emp, { email: e.target.value })}
              />
              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleChangePassword(emp)}
                  disabled={savingId === emp.id}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: `1px solid ${t.border}`,
                    background: 'transparent',
                    color: t.accent,
                    cursor: savingId === emp.id ? 'not-allowed' : 'pointer',
                    fontSize: 12,
                  }}
                >
                  เปลี่ยนรหัส
                </button>
              </div>
              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setViewingProfile(emp)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: `1px solid ${t.border}`,
                    background: 'transparent',
                    color: t.text,
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  ดูโปรไฟล์
                </button>
              </div>
              <div style={{ textAlign: 'right' }}>
                {emp.id !== currentUser?.id && (
                  <button
                    onClick={() => handleDelete(emp)}
                    disabled={savingId === emp.id}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 8,
                      border: '1px solid rgba(239,68,68,0.5)',
                      background: 'rgba(239,68,68,0.08)',
                      color: '#ef4444',
                      cursor: savingId === emp.id ? 'not-allowed' : 'pointer',
                      fontSize: 12,
                    }}
                  >
                    ลบ
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal ดูโปรไฟล์พนักงาน */}
      {viewingProfile && (
        <div
          onClick={() => setViewingProfile(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: t.card,
              borderRadius: 16,
              border: `1px solid ${t.border}`,
              padding: 28,
              maxWidth: 420,
              width: '100%',
              boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, color: t.accent }}>โปรไฟล์พนักงาน</h3>
              <button
                onClick={() => setViewingProfile(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: t.subText,
                  fontSize: 20,
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  margin: '0 auto 12px',
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: t.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 900,
                  color: '#000',
                }}
              >
                {viewingProfile.avatar_url ? (
                  <img src={viewingProfile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  viewingProfile.full_name?.[0] || viewingProfile.email?.[0] || '?'
                )}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{viewingProfile.full_name || 'ยังไม่ได้ระบุชื่อ'}</div>
              <div style={{ fontSize: 13, color: t.subText }}>{viewingProfile.email || '-'}</div>
            </div>
            {(() => {
              const empTasks = tasks.filter(task => {
                const isOwner = task.user_id === viewingProfile.id || task.author_email === viewingProfile.email
                const inTeam = task.team_members?.includes(viewingProfile.email || '')
                return isOwner || inTeam
              })
              const todoC = empTasks.filter(t => t.status === 'todo').length
              const doingC = empTasks.filter(t => t.status === 'doing').length
              const doneC = empTasks.filter(t => t.status === 'done').length
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
                  <StatBox label="TO DO" value={todoC} t={t} />
                  <StatBox label="DOING" value={doingC} t={t} />
                  <StatBox label="DONE" value={doneC} t={t} />
                </div>
              )
            })()}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Row label="บทบาท" value={viewingProfile.role === 'admin' ? 'แอดมิน' : viewingProfile.role === 'employee' ? 'พนักงาน' : '-'} t={t} />
              <Row label="เบอร์โทร" value={viewingProfile.phone || '-'} t={t} />
              <Row label="Bio" value={viewingProfile.bio || '-'} t={t} multiline />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, t, multiline }: { label: string; value: string; t: any; multiline?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: t.subText, marginBottom: 4 }}>{label}</div>
      <div
        style={{
          padding: 10,
          borderRadius: 8,
          background: t.row,
          fontSize: 13,
          color: t.text,
          whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
          overflow: multiline ? undefined : 'hidden',
          textOverflow: multiline ? undefined : 'ellipsis',
        }}
      >
        {value}
      </div>
    </div>
  )
}

function StatBox({ label, value, t }: { label: string; value: number; t: any }) {
  return (
    <div style={{ padding: 12, background: t.row, borderRadius: 12, textAlign: 'center', border: `1px solid ${t.border}` }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: t.accent, marginBottom: 2 }}>{value}</div>
      <div style={{ fontSize: 11, letterSpacing: 1, color: t.subText }}>{label}</div>
    </div>
  )
}

