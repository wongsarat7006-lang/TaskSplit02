'use client'

import { useState, useEffect } from 'react'
import { TaskProvider } from '../context/TaskContext'
import { UserProvider } from '../context/UserContext'
import LayoutWrapper from '../components/common/LayoutWrapper'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <html lang="th">
      <body style={{ margin: 0, padding: 0 }}>
        {!mounted ? (
          <div style={{ background: '#0f172a', minHeight: '100vh' }} />
        ) : (
          <UserProvider>
            <TaskProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </TaskProvider>
          </UserProvider>
        )}
      </body>
    </html>
  )
}