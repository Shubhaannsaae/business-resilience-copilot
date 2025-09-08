'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Icon = ({ path }: { path: string }) => (
  <svg
    className='w-5 h-5'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={path} />
  </svg>
);

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    {
      href: '/dashboard/upload',
      label: 'Upload Data',
      icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
    },
    {
      href: '/dashboard/risks',
      label: 'Risks',
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      href: '/dashboard/simulator',
      label: 'Simulator',
      icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
    },
    {
      href: '/dashboard/copilot',
      label: 'Resilience Copilot',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      href: '/dashboard/actions',
      label: 'Action Plan',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ];

  return (
    <div className="w-64 bg-secondary p-4 border-r border-highlight">
      <nav>
        <ul className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-accent text-white font-semibold shadow-lg'
                      : 'text-light-accent hover:bg-highlight hover:text-white hover:translate-x-1'
                  }`}
                >
                  <Icon path={link.icon} />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}