export default function ActionChecklist ({ items }: {
  items: {
    title: string
    description: string
    impact: number
    effort: number
    due_days: number
  }[]
}) {
  return (
    <div className='space-y-4'>
      {items.map((x, i) => (
        <div
          key={i}
          className='border border-highlight rounded-lg p-4 bg-secondary shadow-lg animate-slideInUp'
        >
          <div className='flex items-center justify-between'>
            <h4 className='font-semibold text-lg text-light'>{x.title}</h4>
            <div className='flex items-center space-x-2'>
              <span className='text-xs bg-blue-500 text-white rounded-full px-3 py-1 font-bold'>
                Impact {x.impact}
              </span>
              <span className='text-xs bg-green-500 text-white rounded-full px-3 py-1 font-bold'>
                Effort {x.effort}
              </span>
              <span className='text-xs bg-red-500 text-white rounded-full px-3 py-1 font-bold'>
                {x.due_days}d
              </span>
            </div>
          </div>
          <p className='mt-3 text-sm text-light-accent'>{x.description}</p>
        </div>
      ))}
    </div>
  )
}
