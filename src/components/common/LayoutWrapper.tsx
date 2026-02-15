'use client'
import Sidebar from './Sidebar'
import { useTasks } from '../../context/TaskContext'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useTasks()
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        marginLeft: isSidebarOpen ? '260px' : '80px', 
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh'
      }}>
        {children}
      </main>
    </div>
  )
}