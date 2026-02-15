// src/app/layout.tsx
import { TaskProvider } from '../context/TaskContext'
import { UserProvider } from '../context/UserContext'
import LayoutWrapper from '../components/common/LayoutWrapper'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body style={{ margin: 0, padding: 0 }}>
        <UserProvider>
          <TaskProvider>
            {/* ใช้ Wrapper เพื่อจัดการการขยับของหน้าจอ */}
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </TaskProvider>
        </UserProvider>
      </body>
    </html>
  )
}