// src/app/layout.tsx
import { TaskProvider } from '../context/TaskContext'
import { UserProvider } from '../context/UserContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>
        <UserProvider>
          <TaskProvider>
            {children}
          </TaskProvider>
        </UserProvider>
      </body>
    </html>
  )
}