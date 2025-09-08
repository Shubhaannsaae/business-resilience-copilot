import Link from 'next/link'

const cardStyles = [
  'bg-secondary',
  'hover:bg-highlight',
  'text-light',
  'p-6',
  'rounded-lg',
  'transition-all',
  'duration-300',
  'shadow-lg',
  'transform',
  'hover:scale-105',
  'flex',
  'flex-col',
  'items-center',
  'justify-center',
  'text-center'
].join(' ')

const Icon = ({ path, className }: { path: string, className?: string }) => (
  <svg
    className={`w-10 h-10 mb-4 text-accent ${className}`}
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d={path}
    />
  </svg>
)

export default function Dashboard () {
  return (
    <main className='p-8 max-w-7xl mx-auto animate-fadeIn'>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className='text-5xl font-bold text-light leading-tight'>Business Resilience Copilot</h1>
          <p className="text-lg text-light-accent">
            Welcome to your AI-powered command center for business resilience. 
            Navigate through the tools below to upload data, analyze risks, simulate scenarios, and generate actionable plans to fortify your business.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard/upload" className="px-6 py-3 rounded-lg bg-accent text-white font-bold transform hover:scale-105 transition-all duration-300 shadow-lg">
              Get Started
            </Link>
            <Link href="/about" className="px-6 py-3 rounded-lg bg-secondary text-white font-bold transform hover:scale-105 transition-all duration-300 shadow-lg">
              Learn More
            </Link>
          </div>
        </div>
        <div className='grid sm:grid-cols-2 gap-6'>
          <Link href='/dashboard/upload' className={cardStyles}>
            <Icon path='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' />
            <h3 className='text-xl font-semibold mb-2'>Upload Data</h3>
            <p className='text-sm text-light-accent'>Upload your business data.</p>
          </Link>
          <Link href='/dashboard/risks' className={cardStyles}>
            <Icon path='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            <h3 className='text-xl font-semibold mb-2'>Analyze Risks</h3>
            <p className='text-sm text-light-accent'>Identify potential risks.</p>
          </Link>
          <Link href='/dashboard/simulator' className={cardStyles}>
            <Icon path='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' />
            <h3 className='text-xl font-semibold mb-2'>Simulator</h3>
            <p className='text-sm text-light-accent'>Test your resilience.</p>
          </Link>
          <Link href='/dashboard/copilot' className={cardStyles}>
            <Icon path='M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            <h3 className='text-xl font-semibold mb-2'>Copilot</h3>
            <p className='text-sm text-light-accent'>AI-powered recommendations.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
