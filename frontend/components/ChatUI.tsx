'use client'
import { useState } from 'react'

export default function ChatUI ({ onAsk }: { onAsk: (q: string) => Promise<string> }) {
  const [q, setQ] = useState<string>('')
  const [a, setA] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit (e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setA(null)
    try {
      const ans = await onAsk(q)
      setA(ans)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-secondary p-6 rounded-lg border border-highlight shadow-lg'>
      <form onSubmit={submit} className='flex gap-4'>
        <input
          className='flex-1 border border-highlight rounded-lg px-4 py-3 bg-primary text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300'
          placeholder='Ask the copilot anything about your business...'
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <button
          disabled={loading || !q.trim()}
          className='px-8 py-3 rounded-lg bg-accent text-white font-bold hover:bg-green-600 transform hover:scale-105 transition-all duration-300 disabled:bg-highlight disabled:cursor-not-allowed shadow-md'
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>
      {a && (
        <div className='mt-6 border border-highlight rounded-lg p-6 bg-gradient-to-br from-primary to-secondary shadow-inner'>
          <h3 className='text-lg font-semibold text-white mb-3'>Copilot's Answer</h3>
          <div className='whitespace-pre-wrap text-light-accent text-base'>
            {a}
          </div>
        </div>
      )}
    </div>
  )
}
