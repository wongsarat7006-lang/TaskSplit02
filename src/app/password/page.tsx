"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // จำลองการส่ง Email (ในอนาคตเชื่อมกับ Backend API ตรงนี้)
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
    }, 1500);
  };

  const colors = {
    primary: "#ff6b00",
    bg: "#050505",
    card: "rgba(15, 15, 15, 0.75)",
    border: "rgba(255, 107, 0, 0.2)",
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: colors.bg,
      fontFamily: "'Sarabun', sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Animation (เหมือนหน้า Login) */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <div style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "420px",
        padding: "50px 40px",
        background: colors.card,
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        border: `1px solid ${colors.border}`,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
      }}>
        
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <h2 style={{ 
            fontSize: "32px", 
            fontWeight: 900, 
            color: colors.primary,
            margin: 0,
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: "2px"
          }}>
            {isSent ? "CHECK YOUR EMAIL" : "RESET PASSWORD"}
          </h2>
          <p style={{ color: "#8a8a82", fontSize: "14px", marginTop: "10px" }}>
            {isSent 
              ? `เราได้ส่งคำแนะนำการกู้คืนรหัสผ่านไปยัง ${email} เรียบร้อยแล้ว` 
              : "กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่"}
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label style={{ fontSize: "12px", color: colors.primary, fontWeight: 700 }}>EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "16px",
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid rgba(255,255,255,0.1)`,
                  borderRadius: "12px",
                  color: "white",
                  outline: "none",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "18px",
                background: loading ? "#555" : colors.primary,
                border: "none",
                borderRadius: "12px",
                color: "#000",
                fontWeight: 800,
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              {loading ? "SENDING..." : "SEND RESET LINK"}
            </button>
          </form>
        ) : (
          <button
            onClick={() => router.push("/login")}
            style={{
              width: "100%",
              padding: "18px",
              background: "transparent",
              border: `1px solid ${colors.primary}`,
              borderRadius: "12px",
              color: colors.primary,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            BACK TO LOGIN
          </button>
        )}

        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <Link href="/login" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>
            ← กลับหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sarabun:wght@300;400;700;800&display=swap');
        .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3; animation: float 15s infinite alternate; }
        .orb-1 { width: 400px; height: 400px; background: ${colors.primary}; top: -100px; right: -50px; }
        .orb-2 { width: 300px; height: 300px; background: #ff3c00; bottom: -50px; left: -50px; animation-delay: -2s; }
        @keyframes float { 0% { transform: translate(0,0); } 100% { transform: translate(30px, 30px); } }
      `}</style>
    </main>
  );
}