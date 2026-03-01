'use client'

import Link from 'next/link'
import { useTasks } from '../context/TaskContext'

export default function DashboardPage() {
  // ดึงข้อมูลจาก Context ที่คุณแก้มาแล้ว (จะไม่แดงแล้ว)
  const { tasks, currentUser, updateTask } = useTasks()

  const t = {
    bg: '#0a0a0a',
    card: '#0f0f0f',
    accent: '#ff6b00', // สีส้ม Cyberpunk
    text: '#f0ede8',
    subText: '#6a6a62',
    border: 'rgba(255, 107, 0, 0.2)',
  }

  const engFont = "'Bebas Neue', sans-serif"

  // ฟังก์ชันสำหรับกดรับงาน
  const handleJoin = async (task: any) => {
    const currentCount = task.current_people || 1
    if (currentCount < (task.max_assignees || 1)) {
      // อัปเดตจำนวนคนในฐานข้อมูลผ่าน Context
      await updateTask({ ...task, current_people: currentCount + 1 })
      alert('เข้าร่วมงานสำเร็จ!')
    } else {
      alert('ขออภัย งานนี้เต็มแล้ว')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: t.bg, color: t.text, padding: '40px', fontFamily: 'Sarabun, sans-serif' }}>
      
      {/* ส่วนหัว: คลีน ๆ มีแค่ชื่อหน้าและปุ่มส้ม */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
        <div>
          <h1 style={{ fontFamily: engFont, fontSize: '56px', margin: 0, letterSpacing: '2px' }}>
            PUBLIC <span style={{ color: t.accent }}>MISSIONS</span>
          </h1>
          <p style={{ color: t.subText, margin: '5px 0 0 0' }}>งานทั้งหมดที่เปิดรับอาสาสมัครในขณะนี้</p>
        </div>

        {/* ✅ ปุ่มสร้างงานส้ม ลิ้งค์ไปไฟล์สร้างงาน */}
        <Link href="/tasks/create">
          <button style={{
            background: t.accent, color: '#000', border: 'none', borderRadius: '12px',
            padding: '16px 32px', fontSize: '18px', fontWeight: 900, cursor: 'pointer',
            fontFamily: engFont, boxShadow: `0 0 30px ${t.accent}33`, transition: '0.3s'
          }}>
            + CREATE NEW TASK
          </button>
        </Link>
      </div>

      {/* รายการงาน: ทุกคนเห็นเหมือนกัน */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
        {tasks?.map(task => {
          const isFull = (task.current_people || 1) >= (task.max_assignees || 1)
          const isMyTask = task.authorEmail === currentUser?.email

          return (
            <div key={task.id} style={{ 
              background: t.card, border: `1px solid ${isMyTask ? t.accent : t.border}`, 
              borderRadius: '20px', padding: '24px', transition: '0.3s',
              boxShadow: isMyTask ? `0 0 15px ${t.accent}22` : 'none'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: t.accent, fontWeight: 'bold' }}>
                  {isMyTask ? '// YOUR_TASK' : `// BY_${task.authorEmail?.split('@')[0].toUpperCase()}`}
                </span>
                <span style={{ fontSize: '12px', color: t.subText }}>{task.dueDate || 'NO DEADLINE'}</span>
              </div>
              
              <div style={{ fontWeight: 800, fontSize: '24px', color: t.text, marginBottom: '20px' }}>{task.title}</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#080808', padding: '15px', borderRadius: '12px', border: '1px solid #111' }}>
                <div>
                  <div style={{ fontSize: '11px', color: t.subText, textTransform: 'uppercase' }}>Available Slots</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: isFull ? '#ff4d4d' : t.accent }}>
                    {task.current_people || 1} / {task.max_assignees || 1}
                  </div>
                </div>

                {/* ปุ่มรับงาน: ถ้าไม่ใช่ของเราและยังไม่เต็ม จะกดได้ */}
                {!isMyTask && (
                  <button 
                    onClick={() => handleJoin(task)}
                    disabled={isFull}
                    style={{ 
                      background: isFull ? 'transparent' : t.accent, 
                      color: isFull ? '#444' : '#000',
                      border: isFull ? '1px solid #333' : 'none', 
                      padding: '10px 20px', borderRadius: '8px', 
                      fontWeight: 900, cursor: isFull ? 'not-allowed' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {isFull ? 'CLOSED' : 'JOIN +'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* กรณีไม่มีงานเลย */}
      {tasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px', border: `1px dashed ${t.border}`, borderRadius: '20px' }}>
          <p style={{ color: t.subText }}>ยังไม่มีการสร้างงานในระบบส่วนกลาง</p>
        </div>
      )}
    </div>
  )
}