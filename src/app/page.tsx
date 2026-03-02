'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTasks, Task } from '../context/TaskContext'
import { supabase } from '../lib/supabaseClient'

export default function DashboardPage() {
  const {
    tasks = [],
    currentUser,
    fetchTasks,
    loading,
    isDarkMode, // ⬅️ ใช้โหมดจาก Context
  } = useTasks()

  const [joiningId, setJoiningId] = useState<string | null>(null)

  /* =======================
     Theme Configuration
  ======================= */
  const t = isDarkMode
    ? {
        bg: '#0b0d10',
        card: 'rgba(255,255,255,0.04)',
        accent: '#ff6b00',
        text: '#f0ede8',
        subText: '#9ca3af',
        border: 'rgba(255,107,0,0.25)',
      }
    : {
        bg: '#f9fafb',
        card: '#ffffff',
        accent: '#ff6b00',
        text: '#111827',
        subText: '#6b7280',
        border: 'rgba(255,107,0,0.3)',
      }

  const engFont = "'Bebas Neue', sans-serif"

  /* =======================
     Fetch Tasks on Mount
  ======================= */
  useEffect(() => {
    fetchTasks?.()
  }, [fetchTasks])

  /* =======================
     Join Mission
  ======================= */
  const handleJoin = async (task: Task) => {
    if (!currentUser) {
      alert('กรุณาเข้าสู่ระบบก่อนเข้าร่วมภารกิจ')
      return
    }

    if (joiningId) return

    const members = task.team_members || []
    const currentCount = task.current_people || 0
    const maxCount = task.max_assignees || 1

    if (members.includes(currentUser.email)) {
      alert('คุณเป็นสมาชิกของภารกิจนี้อยู่แล้ว')
      return
    }

    if (currentCount >= maxCount) {
      alert('ขออภัย ภารกิจนี้เต็มแล้ว')
      return
    }

    try {
      setJoiningId(task.id)

      const { error } = await supabase
        .from('tasks')
        .update({
          current_people: currentCount + 1,
          team_members: [...members, currentUser.email],
        })
        .eq('id', task.id)

      if (error) throw error

      await fetchTasks?.()
    } catch (err: any) {
      alert('เกิดข้อผิดพลาด: ' + err.message)
    } finally {
      setJoiningId(null)
    }
  }

  /* =======================
     Filter Public Missions
  ======================= */
  const publicMissions = tasks.filter(task => {
    if (!currentUser) return true
    const isJoined = task.team_members?.includes(currentUser.email)
    const isOwner = task.user_id === currentUser.id
    return !isJoined && !isOwner
  })

  /* =======================
     Loading
  ======================= */
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: t.bg,
        color: t.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: `3px solid ${t.border}`,
          borderTop: `3px solid ${t.accent}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ marginTop: 20, fontFamily: engFont }}>
          LOADING MISSIONS...
        </p>
      </div>
    )
  }

  /* =======================
     Render
  ======================= */
  return (
    <div style={{
      minHeight: '100vh',
      background: t.bg,
      color: t.text,
      padding: 40,
      transition: 'all 0.3s ease'
    }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 50,
        borderBottom: `1px solid ${t.border}`,
        paddingBottom: 30
      }}>
        <div>
          <h1 style={{
            fontFamily: engFont,
            fontSize: 64,
            margin: 0
          }}>
            PUBLIC <span style={{ color: t.accent }}>MISSIONS</span>
          </h1>
          <p style={{ color: t.subText }}>
            ค้นหาและรับภารกิจที่เหมาะสม
          </p>
        </div>

        <Link href="/tasks/create">
          <button style={{
            background: t.accent,
            color: '#000',
            border: 'none',
            padding: '18px 36px',
            fontFamily: engFont,
            fontWeight: 900,
            borderRadius: 14,
            cursor: 'pointer'
          }}>
            + CREATE MISSION
          </button>
        </Link>
      </div>

      {/* Mission Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: 30
      }}>
        {publicMissions.map(task => (
          <div
            key={task.id}
            style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 24,
              padding: 30,
              display: 'flex',
              flexDirection: 'column',
              backdropFilter: isDarkMode ? 'blur(14px)' : 'none'
            }}
          >
            <h2>{task.title}</h2>

            <p style={{ color: t.subText }}>
              {task.description || 'ไม่มีรายละเอียด'}
            </p>

            <button
              onClick={() => handleJoin(task)}
              disabled={joiningId === task.id}
              style={{
                marginTop: 'auto',
                background: t.accent,
                border: 'none',
                padding: 14,
                fontWeight: 900,
                borderRadius: 12,
                cursor: 'pointer'
              }}
            >
              JOIN MISSION +
            </button>
          </div>
        ))}
      </div>

      {publicMissions.length === 0 && (
        <p style={{
          marginTop: 80,
          textAlign: 'center',
          color: t.subText
        }}>
          ไม่พบภารกิจใหม่
        </p>
      )}
    </div>
  )
}