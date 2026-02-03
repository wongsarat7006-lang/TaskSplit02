import Link from 'next/link'

export default function Navbar() {
  return (
    <nav
      style={{
        padding: '16px',
        background: '#eee',
        display: 'flex',
        gap: '16px',
      }}
    >
      <Link href="/">Home</Link>
      <Link href="/tasks">Task Board</Link>
      <Link href="/tasks/create">Create Task</Link>
      <Link href="/about">About</Link>
    </nav>
  )
}
