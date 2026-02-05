type Props = {
  id: number
  title: string
  status: 'todo' | 'doing' | 'done'
  onNext: (id: number) => void
}

export default function TaskCard({ id, title, status, onNext }: Props) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '12px',
        borderRadius: '8px',
        background: '#fff',
      }}
    >
      <h3>{title}</h3>
      <p>Status: {status}</p>

      {status !== 'done' && (
        <button onClick={() => onNext(id)}>
          Next →
        </button>
      )}
    </div>
  )
}
