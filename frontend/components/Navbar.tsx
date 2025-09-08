export default function Navbar () {
  return (
    <div className='w-full bg-gradient-to-r from-primary to-secondary border-b border-highlight shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <img className='h-8 w-8' src='/logo.png' alt='Logo' />
            </div>
            <div className='ml-4'>
              <div className='text-xl font-bold text-white tracking-wider'>
                Business Resilience Copilot
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
