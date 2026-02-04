type Task = {
  id: number
  title: string
  status: 'todo' | 'doing' | 'done'
}

const mockTasks: Task[] = [
  { id: 1, title: 'Design home page', status: 'todo' },
  { id: 2, title: 'Create task board layout', status: 'doing' },
  { id: 3, title: 'Prepare project presentation', status: 'done' },
]

export default function TaskBoardPage() {
  return (
    <main
      style={{
        padding: '24px',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>
        Task Board
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
        }}
      >
        {mockTasks.map((task) => (
          <div
            key={task.id}
            style={{
              border: '1px solid #ddd',
              padding: '16px',
              borderRadius: '8px',
              backgroundColor:
                task.status === 'done'
                  ? '#e8f5e9'
                  : task.status === 'doing'
                  ? '#fffde7'
                  : '#ffffff',
            }}
          >
            <h3>{task.title}</h3>
            <p>
              Status:{' '}
              <strong>{task.status.toUpperCase()}</strong>
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
