'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav
      style={{
        padding: '16px',
        borderBottom: '1px solid #ddd',
        marginBottom: '24px',
        display: 'flex',
        gap: '16px',
      }}
    >
      <Link href="/">Home</Link>
      <Link href="/tasks">Task Board</Link>
      <Link href="/tasks/create">Create Task</Link>
      <Link href="/profile">Profile</Link>
    </nav>
  )
}
