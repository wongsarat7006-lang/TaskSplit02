'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateTaskPage() {
  const [title, setTitle] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      alert('Please enter task name')
      return
    }

    const newTask = {
      title,
      status: 'todo',
    }

    console.log('New Task:', newTask)
    alert(`Task "${title}" created (mock)`)

    setTitle('')
    router.push('/tasks') // 👉 redirect
  }

  return (
    <main
      style={{
        padding: '24px',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>
        Create Task
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label>Task name</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '4px',
            }}
          />
        </div>

        <button type="submit">Add Task</button>
      </form>
    </main>
  )
}
