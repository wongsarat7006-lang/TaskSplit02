'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTasks, Profile } from '../../context/TaskContext'
import { supabase } from '../../lib/supabaseClient'

export default function EmployeesPage() {
  const { allUsers = [], currentUser, isDarkMode } = useTasks()
  const router = useRouter()

  const [employees, setEmployees] = useState<Profile[]>(allUsers)
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [newEmployee, setNewEmployee] = useState({ full_name: '', email: '' })

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
      alert('หน้าจัดการพนักงานอนุญาตเฉพาะหัวหน้างาน / แอดมิน')
      router.replace('/tasks')
    }
  }, [currentUser, isAdmin, router])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmployee.email) {
      alert('กรุณากรอกอีเมลพนักงาน')
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          full_name: newEmployee.full_name || null,
          email: newEmployee.email,
        })
        .select('id, full_name, email, avatar_url')
        .single()

      if (error) throw error
      if (data) {
        setEmployees(prev => [data as Profile, ...prev])
        setNewEmployee({ full_name: '', email: '' })
      }
    } catch (err: any) {
      alert(err.message || 'ไม่สามารถเพิ่มพนักงานได้')
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
        .select('id, full_name, email, avatar_url')
        .single()
      if (error) throw error
      if (data) {
        setEmployees(prev => prev.map(e => (e.id === emp.id ? (data as Profile) : e)))
      }
    } catch (err: any) {
      alert(err.message || 'ไม่สามารถบันทึกข้อมูลพนักงานได้')
    } finally {
      setSavingId(null)
    }
  }

  const handleChangePassword = async (emp: Profile) => {
    if (!emp.id) return
    const newPassword = prompt(`ตั้งรหัสผ่านใหม่สำหรับ "${emp.full_name || emp.email}" (อย่างน้อย 6 ตัวอักษร):`)
    if (!newPassword || newPassword.length < 6) {
      if (newPassword !== null) alert('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
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
      alert('เปลี่ยนรหัสผ่านสำเร็จ')
    } catch (err: any) {
      alert(err.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ')
    } finally {
      setSavingId(null)
    }
  }

  const handleDelete = async (emp: Profile) => {
    if (!emp.id) return
    if (currentUser && emp.id === currentUser.id) {
      alert('ไม่สามารถลบบัญชีของตัวเองจากรายการพนักงานได้')
      return
    }
    const ok = confirm(`ต้องการลบพนักงาน "${emp.full_name || emp.email}" ใช่หรือไม่?`)
    if (!ok) return
    setSavingId(emp.id)
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', emp.id)
      if (error) throw error
      setEmployees(prev => prev.filter(e => e.id !== emp.id))
    } catch (err: any) {
      alert(err.message || 'ไม่สามารถลบพนักงานได้')
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 32,
          borderBottom: `1px solid ${t.border}`,
          paddingBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: engFont,
              fontSize: 48,
              margin: 0,
            }}
          >
            EMPLOYEE <span style={{ color: t.accent }}>MANAGEMENT</span>
          </h1>
          <p style={{ color: t.subText, marginTop: 4 }}>จัดการรายชื่อพนักงาน เพิ่ม แก้ไข และลบข้อมูล</p>
        </div>
      </div>

      {/* New employee form */}
      <form
        onSubmit={handleCreate}
        style={{
          background: t.card,
          borderRadius: 16,
          border: `1px solid ${t.border}`,
          padding: 20,
          marginBottom: 24,
          display: 'grid',
          gridTemplateColumns: '2fr 2fr auto',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <div>
          <label style={{ fontSize: 12, color: t.subText, display: 'block', marginBottom: 4 }}>ชื่อพนักงาน</label>
          <input
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: 8,
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
          <label style={{ fontSize: 12, color: t.subText, display: 'block', marginBottom: 4 }}>อีเมล *</label>
          <input
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: 8,
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
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 18px',
            borderRadius: 10,
            border: 'none',
            background: loading ? '#4b5563' : t.accent,
            color: '#000',
            fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            alignSelf: 'flex-end',
            minWidth: 140,
          }}
        >
          {loading ? 'กำลังเพิ่ม...' : '+ เพิ่มพนักงาน'}
        </button>
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
            gridTemplateColumns: '2fr 2fr 1fr 1fr',
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
                gridTemplateColumns: '2fr 2fr 1fr 1fr',
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
    </div>
  )
}

