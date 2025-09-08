export default function RiskCard ({ title, severity, priority, suggestion }: {
  key: number
  title: string
  severity: number
  priority: number
  suggestion: string
}) {
  const sevColor =
    severity >= 4
      ? 'bg-red-600 text-white'
      : severity >= 3
      ? 'bg-yellow-500 text-gray-900'
      : 'bg-green-600 text-white'

  return (
    <div className='border border-highlight rounded-lg p-4 bg-secondary shadow-lg transition-all duration-300 hover:shadow-xl hover:border-accent animate-slideInUp'>
      <div className='flex items-center justify-between'>
        <h4 className='font-semibold text-lg text-light'>{title}</h4>
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${sevColor}`}>
          Severity {severity} / Priority {priority}
        </span>
      </div>
      <p className='mt-3 text-sm text-light-accent'>{suggestion}</p>
    </div>
  )
}
