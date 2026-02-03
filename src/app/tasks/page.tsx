'use client'

import { useState } from 'react'

export default function CreateTaskPage() {
  const [title, setTitle] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    console.log('Task name:', title)

    // เคลียร์ช่อง input หลัง submit
    setTitle('')
  }

  return (
    <main style={{ padding: '24px' }}>
      <h1>Create Task</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Task name</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">Add Task</button>
      </form>
    </main>
  )
}
