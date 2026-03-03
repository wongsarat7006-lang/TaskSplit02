'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

function getAuthErrorMessage(message?: string) {
  const msg = (message || "").toLowerCase();

  if (!msg) return "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";

  // Supabase common messages
  if (msg.includes("invalid login credentials")) return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  if (msg.includes("email not confirmed")) return "กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ";
  if (msg.includes("too many requests")) return "คุณลองหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่";
  if (msg.includes("user not found")) return "ไม่พบผู้ใช้นี้ในระบบ";

  return "เข้าสู่ระบบไม่สำเร็จ: " + (message || "Unknown error");
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. เรียก Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. ถ้า Login ผ่าน ให้ใช้ Hard Redirect ไปที่หน้า tasks
      // การใช้ window.location.href จะช่วยล้างสถานะ Routing ที่อาจค้างอยู่
      console.log("Login Success, Redirecting...");
      window.location.href = "/tasks"; 
      
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(getAuthErrorMessage(err?.message));
      setLoading(false);
    }
  };

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
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "40px", fontWeight: 900, color: "#ff6b00", margin: 0, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "3px" }}>TASKSPLIT</h1>
          <p style={{ color: "#8a8a82", fontSize: "12px", marginTop: "8px" }}>LOGIN TO YOUR WORKSPACE</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <input 
            type="email" placeholder="EMAIL ADDRESS" required 
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
            style={{ padding: "16px", background: "rgba(0,0,0,0.3)", border: `1px solid ${focused === "email" ? "#ff6b00" : "rgba(255,255,255,0.1)"}`, borderRadius: "12px", color: "white", outline: "none", transition: "0.3s" }}
          />
          <input 
            type="password" placeholder="PASSWORD" required 
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
            style={{ padding: "16px", background: "rgba(0,0,0,0.3)", border: `1px solid ${focused === "password" ? "#ff6b00" : "rgba(255,255,255,0.1)"}`, borderRadius: "12px", color: "white", outline: "none", transition: "0.3s" }}
          />

          <button 
            type="submit" disabled={loading}
            style={{ marginTop: "10px", padding: "16px", background: "#ff6b00", border: "none", borderRadius: "12px", color: "#000", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "AUTHENTICATING..." : "SIGN IN"}
          </button>

          {error && <p style={{ color: "#ff4d4d", fontSize: "12px", textAlign: "center", marginTop: "10px" }}>{error}</p>}

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <p style={{ color: "#8a8a82", fontSize: "13px" }}>
              Don't have an account?{" "}
              <button type="button" onClick={() => router.push("/signup")} style={{ background: "none", border: "none", color: "#ff6b00", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}>
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sarabun:wght@400;500;600;700&display=swap');`}</style>
    </main>
  );
}