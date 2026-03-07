'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTasks } from '../context/TaskContext'

export default function DashboardPage() {
  const {
    tasks = [],
    fetchTasks,
    loading,
    isDarkMode, // ⬅️ ใช้โหมดจาก Context
    currentUser,
    allUsers,
  } = useTasks()
  const router = useRouter()

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

  // จำกัดสิทธิ์: ถ้าเป็นพนักงานทั่วไปให้ไปที่ Task Board
  const me = allUsers.find((u: any) => u.id === currentUser?.id)
  const isAdmin = me?.role === 'admin'

  useEffect(() => {
    if (currentUser && !isAdmin) {
      router.replace('/tasks')
    }
  }, [currentUser, isAdmin, router])

  /* =======================
     Group Tasks for Overview
     - หน้าแรกใช้ดูงานภาพรวม แบ่งตามสถานะ
  ======================= */
  const columns = [
    { id: 'todo',  label: 'TO DO',  description: 'งานที่ยังไม่เริ่ม' },
    { id: 'doing', label: 'DOING', description: 'งานที่กำลังดำเนินการ' },
    { id: 'done',  label: 'DONE',  description: 'งานที่เสร็จแล้ว' },
  ] as const

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
          LOADING TASKS...
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
            TASK <span style={{ color: t.accent }}>OVERVIEW</span>
          </h1>
          <p style={{ color: t.subText }}>
            ดูภาพรวมงานทั้งหมด แบ่งตามสถานะ เพื่อเช็คความคืบหน้าได้ง่าย
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
            + CREATE TASK
          </button>
        </Link>
      </div>

      {/* Overview Board (Read Only) */}
      {tasks.length === 0 ? (
        <p
          style={{
            marginTop: 80,
            textAlign: 'center',
            color: t.subText,
          }}
        >
          ยังไม่มีงานในระบบ
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(260px, 1fr))',
            gap: 24,
          }}
        >
          {columns.map(col => {
            const colTasks = tasks.filter(task => task.status === col.id)
            return (
              <div
                key={col.id}
                style={{
                  background: t.card,
                  border: `1px solid ${t.border}`,
                  borderRadius: 18,
                  padding: 20,
                }}
              >
                {/* Column header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: engFont,
                        fontSize: 20,
                        letterSpacing: 2,
                      }}
                    >
                      {col.label}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: t.subText,
                        marginTop: 2,
                      }}
                    >
                      {col.description}
                    </div>
                  </div>
                  <span
                    style={{
                      minWidth: 26,
                      textAlign: 'center',
                      background: `${t.accent}22`,
                      color: t.accent,
                      borderRadius: 999,
                      padding: '2px 10px',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {colTasks.length}
                  </span>
                </div>

                {/* Column tasks (read only cards) */}
                {colTasks.length === 0 ? (
                  <div
                    style={{
                      fontSize: 12,
                      color: t.subText,
                      opacity: 0.7,
                      marginTop: 12,
                    }}
                  >
                    ไม่มีงานในสถานะนี้
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      marginTop: 8,
                    }}
                  >
                    {colTasks.map(task => {
                      const members = task.team_members || []
                      const currentCount =
                        typeof task.current_people === 'number'
                          ? task.current_people
                          : Math.max(0, members.length - 1)
                      const maxCount = task.max_assignees ?? 1

                      return (
                        <div
                          key={task.id}
                          style={{
                            borderRadius: 14,
                            border: `1px solid ${t.border}`,
                            padding: 14,
                            background: isDarkMode
                              ? 'rgba(15,23,42,0.6)'
                              : '#ffffff',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 14,
                              marginBottom: 4,
                            }}
                          >
                            {task.title}
                          </div>
                          {task.description && (
                            <div
                              style={{
                                fontSize: 12,
                                color: t.subText,
                                marginBottom: 6,
                              }}
                            >
                              {task.description}
                            </div>
                          )}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: 11,
                              color: t.subText,
                            }}
                          >
                            <span>
                              👥 {currentCount}/{maxCount} คน
                            </span>
                            {task.due_date && (
                              <span>
                                📅{' '}
                                {new Date(
                                  task.due_date
                                ).toLocaleDateString('th-TH')}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}