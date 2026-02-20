"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError] = useState("");

  const validUser = {
  email: "keelol@gmail.com",
  password: "123456"
};
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (email === validUser.email && password === validUser.password) {
    localStorage.setItem("token", "loggedin");
    setError("");
    router.push("/tasks");
  } else {
    setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  }
};

  const colors = {
    primary: "#ff6b00",
    bg: "#050505",
    card: "rgba(15, 15, 15, 0.75)",
    border: "rgba(255, 107, 0, 0.2)",
    text: "#f0ede8",
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
      
      {/* --- ANIMATED BACKGROUND ELEMENTS --- */}
      <div className="bg-animation">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      
      {/* Grid Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `linear-gradient(rgba(255,107,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.05) 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
        zIndex: 1
      }} />

      {/* --- LOGIN CARD --- */}
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
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ 
            fontSize: "48px", 
            fontWeight: 900, 
            color: colors.primary,
            margin: 0,
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: "3px",
            textShadow: "0 0 20px rgba(255,107,0,0.4)"
          }}>TASKSPLIT</h1>
          <p style={{ color: "#8a8a82", fontSize: "14px", marginTop: "8px", fontWeight: 300 }}>
             บริหารจัดการงานของคุณอย่างมีประสิทธิภาพ
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ fontSize: "12px", color: colors.primary, fontWeight: 700, letterSpacing: "1px" }}>EMAIL ADDRESS</label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              required
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              style={{
                padding: "16px",
                background: "rgba(0,0,0,0.3)",
                border: `1px solid ${focused === "email" ? colors.primary : "rgba(255,255,255,0.1)"}`,
                borderRadius: "12px",
                color: "white",
                outline: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: focused === "email" ? `0 0 15px ${colors.primary}20` : "none"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ fontSize: "12px", color: colors.primary, fontWeight: 700, letterSpacing: "1px" }}>PASSWORD</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              style={{
                padding: "16px",
                background: "rgba(0,0,0,0.3)",
                border: `1px solid ${focused === "password" ? colors.primary : "rgba(255,255,255,0.1)"}`,
                borderRadius: "12px",
                color: "white",
                outline: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: focused === "password" ? `0 0 15px ${colors.primary}20` : "none"
              }}
            />
          </div>

                  <button
                type="submit"
                className="login-btn"
                style={{
                  marginTop: "15px",
                  padding: "18px",
                  background: colors.primary,
                  border: "none",
                  borderRadius: "12px",
                  color: "#000",
                  fontWeight: 800,
                  fontSize: "16px",
                  cursor: "pointer",
                  boxShadow: `0 10px 30px ${colors.primary}40`,
                  transition: "all 0.3s ease",
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: "1px"
                }}
              >
                SIGN IN TO SYSTEM
              </button>

              {error && (
                <p
                  style={{
                    color: "red",
                    fontSize: "13px",
                    textAlign: "center",
                    marginTop: "10px"
                  }}
                >
                  {error}
                </p>
              )}
        </form>

        <p style={{ textAlign: "center", color: "#555", fontSize: "12px", marginTop: "35px", letterSpacing: "1px" }}>
          © 2026 TASKSPLIT . ALL RIGHTS RESERVED.
        </p>
      </div>

      {/* --- CSS ANIMATIONS --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sarabun:wght@300;400;700;800&display=swap');

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
          opacity: 0.4;
          animation: float 20s infinite alternate;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: ${colors.primary};
          top: -100px;
          right: -100px;
          animation-duration: 15s;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: #ff3c00;
          bottom: -50px;
          left: -100px;
          animation-duration: 18s;
          animation-delay: -2s;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          background: ${colors.primary};
          top: 40%;
          left: 30%;
          opacity: 0.15;
          animation-duration: 25s;
        }

        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }

        .login-btn:hover {
          background: #ff8533 !important;
          transform: translateY(-3px);
          box-shadow: 0 15px 40px ${colors.primary}60 !important;
        }

        .login-btn:active {
          transform: translateY(-1px);
        }

        input::placeholder {
          color: rgba(255,255,255,0.2) !important;
        }
      `}</style>
    </main>
  );
}