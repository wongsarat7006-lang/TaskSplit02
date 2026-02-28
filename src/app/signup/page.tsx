'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // ตรวจสอบความยาวรหัสผ่าน (Validation)
    if (password.length < 6) {
      alert('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษรครับ')
      return
    }

    setLoading(true)

    // สั่ง Supabase ให้สมัครสมาชิก
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { full_name: 'New User' } // ข้อมูลที่จะไปโผล่ในตาราง profiles อัตโนมัติด้วย Trigger
      }
    })

    if (error) {
      alert('เกิดข้อผิดพลาด: ' + error.message)
    } else {
      alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบได้เลย')
      router.push('/login') // เด้งไปหน้า Login อัตโนมัติหลังสมัครเสร็จ
    }
    setLoading(false)
  }

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
        
        {/* หัวข้อ */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "40px", fontWeight: 900, color: "#ff6b00", margin: 0, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "3px" }}>TASKSPLIT</h1>
          <p style={{ color: "#8a8a82", fontSize: "12px", marginTop: "8px" }}>CREATE YOUR ACCOUNT</p>
        </div>

        <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Email Input */}
          <input 
            type="email" placeholder="EMAIL ADDRESS" required 
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
            style={{ padding: "16px", background: "rgba(0,0,0,0.3)", border: `1px solid ${focused === "email" ? "#ff6b00" : "rgba(255,255,255,0.1)"}`, borderRadius: "12px", color: "white", outline: "none", transition: "0.3s" }}
          />
          
          {/* Password Input & Helper Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input 
              type="password" placeholder="PASSWORD" required 
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
              style={{ padding: "16px", background: "rgba(0,0,0,0.3)", border: `1px solid ${focused === "password" ? "#ff6b00" : "rgba(255,255,255,0.1)"}`, borderRadius: "12px", color: "white", outline: "none", transition: "0.3s" }}
            />
            <span style={{ 
              fontSize: "11px", 
              color: password.length > 0 && password.length < 6 ? "#ff4d4d" : "#8a8a82",
              paddingLeft: "5px"
            }}>
              * รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร
            </span>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" disabled={loading}
            style={{ marginTop: "10px", padding: "16px", background: "#ff6b00", border: "none", borderRadius: "12px", color: "#000", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "SIGNING UP..." : "SIGN UP"}
          </button>

          {/* ลิงก์กลับไปหน้า Login */}
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
      
      {/* โหลด Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sarabun:wght@400;500;600;700&display=swap');`}</style>
    </main>
  )
}