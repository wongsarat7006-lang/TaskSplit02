'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'
import { useTasks } from '../../context/TaskContext'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

export default function TasksPage() {
  const router = useRouter()
  const { tasks, categories, reorderTasks, deleteTask, isDarkMode, getTaskTimeStatus } = useTasks()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [hasMounted, setHasMounted] = useState(false)

  // 🔐 LOGIN GUARD: ใช้ Hard Redirect เพื่อความชัวร์และกันลูป
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // ใช้ window.location.href แทน router.replace เพื่อบังคับ Browser ไปหน้า Login แบบเด็ดขาด
        window.location.href = "/login"
        return
      }
      setHasMounted(true)
    }
    checkSession()
  }, [])

  const t = {
    bg:        isDarkMode ? '#0a0a0a' : '#fafaf8',
    card:      isDarkMode ? '#0f0f0f' : '#ffffff',
    cardHover: isDarkMode ? '#131313' : '#fff8f4',
    text:      isDarkMode ? '#f0ede8' : '#111110',
    subText:   isDarkMode ? '#6a6a62' : '#7a7a72',
    border:    isDarkMode ? 'rgba(255,107,0,0.12)' : 'rgba(255,107,0,0.18)',
    borderStr: isDarkMode ? 'rgba(255,107,0,0.35)' : 'rgba(255,107,0,0.45)',
    grid:      isDarkMode ? 'rgba(255,107,0,0.035)' : 'rgba(255,107,0,0.06)',
    inputBg:   isDarkMode ? '#0a0a0a' : '#ffffff',
    dragOver:  isDarkMode ? 'rgba(255,107,0,0.06)' : 'rgba(255,107,0,0.04)',
    statBg:    isDarkMode ? '#0f0f0f' : '#ffffff',
    colBorder: isDarkMode ? 'rgba(255,107,0,0.12)' : 'rgba(255,107,0,0.2)',
  }

  const thaiFont = "'Sarabun', sans-serif"
  const engFont  = "'Bebas Neue', 'Impact', sans-serif"
  const monoFont = "'Courier New', monospace"

  // 📊 Stats Calculation
  const totalTasks = tasks?.length || 0
  const doneTasks  = tasks?.filter(t => t.status === 'done').length || 0
  const doingTasks = tasks?.filter(t => t.status === 'doing').length || 0
  const todoTasks  = tasks?.filter(t => t.status === 'todo').length || 0

  // 🔍 Filtering Logic
  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchesCategory = filterCategory === 'all' || task.category_id === filterCategory
    return matchesSearch && matchesPriority && matchesCategory
  }) || []

  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    reorderTasks(destination, source, draggableId)
  }, [reorderTasks])

  const columns = [
    { id: 'todo',  label: 'TO DO',       title: 'รายการใหม่' },
    { id: 'doing', label: 'IN PROGRESS', title: 'กำลังทำ' },
    { id: 'done',  label: 'DONE',        title: 'เสร็จสิ้น' },
  ]

  // ป้องกันหน้าจอกระพริบก่อนโหลดเสร็จ
  if (!hasMounted) return null

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main style={{ minHeight: '100vh', background: t.bg, color: t.text, fontFamily: thaiFont, position: 'relative', overflow: 'hidden', transition: 'background 0.3s ease' }}>
        
        {/* BG Decor */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '40px 32px' }}>
          
          {/* Header */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
            <div>
              <div style={{ fontFamily: monoFont, fontSize: '11px', color: '#ff6b00', letterSpacing: '0.2em', marginBottom: '8px' }}>// TASK BOARD</div>
              <h1 style={{ fontFamily: engFont, fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 900, lineHeight: 0.95, margin: 0, letterSpacing: '-1px', textTransform: 'uppercase' }}>
                <span style={{ color: t.text }}>MY </span>
                <span style={{ color: '#ff6b00', textShadow: '0 0 30px rgba(255,107,0,0.3)' }}>TASKS</span>
              </h1>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/tasks/analytics" style={{ border: `1px solid #ff6b00`, color: '#ff6b00', padding: '13px 24px', borderRadius: '4px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
                📊 ANALYTICS
              </Link>
              <Link href="/tasks/create" style={{ background: '#ff6b00', color: '#0a0a0a', padding: '13px 28px', borderRadius: '4px', textDecoration: 'none', fontWeight: 700, boxShadow: '0 0 30px rgba(255,107,0,0.3)' }}>
                + สร้างงานใหม่
              </Link>
            </div>
          </header>

          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', marginBottom: '28px', background: t.borderStr, borderRadius: '8px', overflow: 'hidden' }}>
            {[
              { label: 'ทั้งหมด', value: totalTasks, color: t.text },
              { label: 'รายการใหม่', value: todoTasks, color: t.subText },
              { label: 'กำลังทำ', value: doingTasks, color: '#ffaa44' },
              { label: 'เสร็จแล้ว', value: doneTasks, color: '#ff6b00' },
            ].map((s, i) => (
              <div key={i} style={{ background: t.statBg, padding: '20px 24px', textAlign: 'center' }}>
                <div style={{ fontFamily: engFont, fontSize: '44px', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: t.subText, marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ... (ส่วนที่เหลือของ Filter และ Kanban Board เหมือนเดิมที่คุณมี) ... */}
          
          {/* ช่องค้นหา และ Kanban Board ให้ใส่ต่อจากตรงนี้ตามโค้ดเดิมของคุณ */}
          {/* ผมใส่ให้คุณครอบคลุมถึงหน้าหลักแล้วครับ */}
        </div>
      </main>
    </DragDropContext>
  )
}