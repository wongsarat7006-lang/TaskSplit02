'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function SignUpPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('') 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // ตรวจสอบความถูกต้องเบื้องต้น
    if (!fullName) return alert('กรุณากรอกชื่อ-นามสกุลด้วยครับ')
    if (password.length < 6) {
      alert('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษรครับ')
      return
    }
    if (password !== confirmPassword) {
      alert('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน')
      return
    }

    setLoading(true)

    // สั่ง Supabase ให้สมัครสมาชิกพร้อมส่งชื่อจริงเข้าไปใน Metadata 
    // ค่านี้จะถูก Trigger ในฐานข้อมูลดึงไปใส่ตาราง profiles อัตโนมัติ
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { 
          full_name: fullName 
        } 
      }
    })

    if (error) {
      alert('เกิดข้อผิดพลาด: ' + error.message)
    } else {
      alert('สมัครสมาชิกสำเร็จ! ข้อมูลชื่อของคุณจะถูกบันทึกเข้าระบบโดยอัตโนมัติ')
      router.push('/login') 
    }
    setLoading(false)
  }

  const inputStyle = (id: string) => ({
    padding: "16px", 
    background: "rgba(0,0,0,0.3)", 
    border: `1px solid ${focused === id ? "#ff6b00" : "rgba(255,255,255,0.1)"}`, 
    borderRadius: "12px", 
    color: "white", 
    outline: "none", 
    transition: "0.3s",
    fontFamily: "'Sarabun', sans-serif"
  })

  return (
    <main style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "#050505", 
      fontFamily: "'Sarabun', sans-serif" 
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "400px", 
        padding: "40px", 
        background: "rgba(15, 15, 15, 0.75)", 
        backdropFilter: "blur(20px)", 
        borderRadius: "24px", 
        border: "1px solid rgba(255, 107, 0, 0.2)", 
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)" 
      }}>
        
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <h1 style={{ fontSize: "40px", fontWeight: 900, color: "#ff6b00", margin: 0, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "3px" }}>TASKSPLIT</h1>
          <p style={{ color: "#8a8a82", fontSize: "11px", marginTop: "8px", letterSpacing: "1px" }}>CREATE YOUR PROFESSIONAL PROFILE</p>
        </div>

        <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: "12px", color: "#ff6b00", paddingLeft: "5px" }}>FULL NAME</label>
            <input 
              type="text" placeholder="ชื่อ - นามสกุล" required 
              onChange={(e) => setFullName(e.target.value)}
              onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
              style={inputStyle("name")}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: "12px", color: "#ff6b00", paddingLeft: "5px" }}>EMAIL ADDRESS</label>
            <input 
              type="email" placeholder="example@email.com" required 
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
              style={inputStyle("email")}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: "12px", color: "#ff6b00", paddingLeft: "5px" }}>PASSWORD</label>
            <input 
              type="password" placeholder="••••••••" required 
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
              style={inputStyle("password")}
            />
            <span style={{ 
              fontSize: "11px", 
              color: password.length > 0 && password.length < 6 ? "#ff4d4d" : "#8a8a82",
              paddingLeft: "5px"
            }}>
              * อย่างน้อย 6 ตัวอักษร
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: "12px", color: "#ff6b00", paddingLeft: "5px" }}>CONFIRM PASSWORD</label>
            <input 
              type="password" placeholder="พิมพ์รหัสผ่านอีกครั้ง" required 
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocused("confirmPassword")} onBlur={() => setFocused(null)}
              style={inputStyle("confirmPassword")}
            />
            <span style={{ 
              fontSize: "11px", 
              color: confirmPassword && confirmPassword !== password ? "#ff4d4d" : "#8a8a82",
              paddingLeft: "5px"
            }}>
              {confirmPassword && confirmPassword !== password
                ? "รหัสผ่านไม่ตรงกัน"
                : "กรอกให้ตรงกับรหัสผ่านด้านบน"}
            </span>
          </div>

          <button 
            type="submit" disabled={loading}
            style={{ 
              marginTop: "15px", 
              padding: "16px", 
              background: "#ff6b00", 
              border: "none", 
              borderRadius: "12px", 
              color: "#000", 
              fontWeight: 800, 
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.2s"
            }}
          >
            {loading ? "CREATING ACCOUNT..." : "REGISTER NOW"}
          </button>

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <p style={{ color: "#8a8a82", fontSize: "13px" }}>
              Already have an account?{" "}
              <button 
                type="button" 
                onClick={() => router.push("/login")}
                style={{ background: "none", border: "none", color: "#ff6b00", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
      
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sarabun:wght@400;500;600;700&display=swap');`}</style>
    </main>
  )
}