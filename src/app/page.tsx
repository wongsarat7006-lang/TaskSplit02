import Link from 'next/link'

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
        padding: '40px 24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header
  style={{
    marginBottom: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }}
>
  {/* ซ้าย: Logo + Profile */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
    <div>
      <h1
        style={{
          fontSize: '34px',
          fontWeight: 800,
          margin: 0,
          color: '#1f2937',
        }}
      >
        TaskSplit
      </h1>
      <p
        style={{
          fontSize: '14px',
          color: '#6b7280',
          marginTop: '4px',
        }}
      >
        <h3>ระบบจัดการงานที่ต้องทำ Task Board</h3>
      </p>
    </div>

    {/* Profile */}
    <Link
      href="/profile"
      style={{
        padding: '10px 16px',
        background: '#ffffff',
        color: '#111827',
        textDecoration: 'none',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: 600,
        border: '2px solid #111827',
      }}
    >
      👤 Profile
    </Link>
  </div>

  {/* ขวา: Task Board */}
  <Link
    href="/tasks"
    style={{
      padding: '10px 20px',
      background: '#111827',
      color: '#fff',
      textDecoration: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: 600,
    }}
  >
    ไปที่ Task Board
  </Link>
</header>


        {/* Hero */}
        <section
          style={{
            textAlign: 'center',
            marginBottom: '64px',
          }}
        >
          <h2
            style={{
              fontSize: '44px',
              fontWeight: 800,
              color: '#111827',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}
          >
            จัดการงานให้เป็นระบบ<br />ในที่เดียว
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: '#4b5563',
              maxWidth: '680px',
              margin: '0 auto 32px',
              lineHeight: 1.6,
            }}
          >
            สร้าง แบ่ง และติดตามงานของทีมได้อย่างชัดเจน  
            ลดความสับสน เพิ่มประสิทธิภาพการทำงาน
          </p>

          <Link
            href="/tasks/create"
            style={{
              display: 'inline-block',
              padding: '14px 36px',
              background: '#1f1f1fd7',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              boxShadow: '0 10px 24px rgba(79, 70, 229, 0.35)',
            }}
          >
            + สร้างงานใหม่
          </Link>
        </section>

        {/* Features */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {[
            {
              icon: '📝',
              title: 'สร้างงานชัดเจน',
              desc: 'กำหนดรายละเอียด ผู้รับผิดชอบ และวันครบกำหนดได้ในที่เดียว',
            },
            {
              icon: '📊',
              title: 'เห็นภาพรวมงาน',
              desc: 'ติดตามสถานะ To Do, Doing และ Done ได้แบบเป็นระบบ',
            },
            {
              icon: '⚡',
              title: 'ใช้งานง่าย',
              desc: 'ออกแบบมาให้เข้าใจทันที ไม่ซับซ้อน',
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                {item.icon}
              </div>
              <h3
                style={{
                  fontSize: '20px',
                  marginBottom: '12px',
                  color: '#111827',
                  fontWeight: 700,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  color: '#6b7280',
                  lineHeight: 1.6,
                  fontSize: '15px',
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer
          style={{
            marginTop: '80px',
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '14px',
          }}
        >
          © 2026 TaskSplit · Built with Next.js
        </footer>
      </div>
    </main>
  )
}
