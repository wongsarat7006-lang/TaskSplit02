import Link from 'next/link'

export default function HomePage() {
  return (
    <main
      style={{
        padding: '32px',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>
        TaskSplit02
      </h1>

      <p style={{ color: '#555', marginBottom: '24px' }}>
        TaskSplit02 is a simple task management web application
        built with Next.js. This project helps users organize,
        create, and manage tasks in one place.
      </p>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Task Board */}
        <div
          style={{
            border: '1px solid #ddd',
            padding: '16px',
            borderRadius: '8px',
          }}
        >
          <h2>📋 Task Board</h2>
          <p>View all tasks and track progress.</p>
          <Link href="/tasks">Go to Task Board →</Link>
        </div>

        {/* Create Task */}
        <div
          style={{
            border: '1px solid #ddd',
            padding: '16px',
            borderRadius: '8px',
          }}
        >
          <h2>➕ Create Task</h2>
          <p>Add a new task to your board.</p>
          <Link href="/tasks/create">Create new task →</Link>
        </div>

        {/* Profile */}
        <div
          style={{
            border: '1px solid #ddd',
            padding: '16px',
            borderRadius: '8px',
          }}
        >
          <h2>👤 Profile</h2>
          <p>View user profile information.</p>
          <Link href="/profile">Go to Profile →</Link>
        </div>
      </section>
    </main>
  )
}
