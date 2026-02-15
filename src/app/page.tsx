'use client'

import Link from 'next/link'
import { useTasks } from '../context/TaskContext'

export default function HomePage() {
  const { isDarkMode } = useTasks()

  // 1. กำหนดชุดสีตามโหมดมืด/สว่าง
  const theme = {
    bg: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#f3f4f6' : '#111827',
    subText: isDarkMode ? '#9ca3af' : '#4b5563',
    cardBg: isDarkMode ? '#1e1e1e' : '#ffffff',
    cardBorder: isDarkMode ? '#333' : '#f3f4f6'
  }

  return (
    <main style={{ 
      padding: '80px 40px', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: theme.bg, // เปลี่ยนสีพื้นหลังตามโหมด
      color: theme.text,    // เปลี่ยนสีตัวอักษรหลักตามโหมด
      transition: 'all 0.3s ease' 
    }}>
      <div style={{ textAlign: 'center', maxWidth: '800px' }}>
        
        <h1 style={{ fontSize: '56px', fontWeight: 800, marginBottom: '16px' }}>TaskSplit</h1>
        <p style={{ fontSize: '20px', color: theme.subText, marginBottom: '48px' }}>
          ระบบจัดการงานที่ต้องทำ Task Board อย่างมืออาชีพ
        </p>

        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '20px' }}>
            จัดการงานให้เป็นระบบในที่เดียว
          </h2>
          <p style={{ fontSize: '18px', color: theme.subText, lineHeight: '1.6' }}>
            สร้าง แบ่ง และติดตามงานของทีมได้อย่างชัดเจน ลดความสับสน เพิ่มประสิทธิภาพการทำงาน
          </p>
          
          <Link href="/tasks" style={{
            background: '#2563eb', 
            color: '#fff', 
            padding: '16px 40px', 
            borderRadius: '14px', 
            textDecoration: 'none', 
            display: 'inline-block', 
            marginTop: '32px',
            fontSize: '18px',
            fontWeight: 600,
            boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)'
          }}>
            + เริ่มจัดการงานของคุณ
          </Link>
        </div>

        {/* ส่วน Features ด้านล่างที่ปรับสีตามโหมดมืด */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginTop: '80px' }}>
           <FeatureCard icon="📝" title="สร้างงานชัดเจน" desc="กำหนดรายละเอียดและผู้รับผิดชอบได้ทันที" theme={theme} />
           <FeatureCard icon="📊" title="เห็นภาพรวมงาน" desc="ติดตามสถานะ To Do, Doing และ Done" theme={theme} />
           <FeatureCard icon="⚡" title="ใช้งานง่าย" desc="ออกแบบมาให้เข้าใจง่าย ไม่ซับซ้อน" theme={theme} />
        </div>
      </div>
    </main>
  )
}

function FeatureCard({ icon, title, desc, theme }: any) {
  return (
    <div style={{ 
      background: theme.cardBg, 
      padding: '32px', 
      borderRadius: '20px', 
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', 
      border: `1px solid ${theme.cardBorder}`,
      transition: 'all 0.3s ease'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: theme.subText }}>{desc}</p>
    </div>
  )
}