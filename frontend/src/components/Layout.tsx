'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Dealers', href: '/dealers', icon: '🏢' },
  { name: 'Salespersons', href: '/salespersons', icon: '👤' },
  { name: 'Customers', href: '/customers', icon: '👥' },
  { name: 'Vehicle Models', href: '/vehicle-models', icon: '🏍️' },
  { name: 'Leads', href: '/leads', icon: '🎯' },
  { name: 'Sales Pipeline', href: '/leads/pipeline', icon: '📈' },
  { name: 'Follow Ups', href: '/follow-ups', icon: '📅' },
  { name: 'Vehicles', href: '/vehicles', icon: '🔧' },
  { name: 'Sales', href: '/sales', icon: '💰' },
  { name: 'Services', href: '/services', icon: '🛠️' },
  { name: 'Warranties', href: '/warranties', icon: '🛡️' },
  { name: 'Loyalty', href: '/loyalty', icon: '⭐' },
  { name: 'Sales Targets', href: '/sales-targets', icon: '🎯' },
  { name: 'Reports', href: '/reports', icon: '📊' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-red-500">KAWASAKI</h1>
          <p className="text-xs text-gray-400">Dealer Management</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <div className="text-sm text-gray-300 mb-2">
            <p className="font-medium text-white">{user?.name}</p>
            <p className="text-xs">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full text-left text-sm text-red-400 hover:text-red-300"
          >
            🚪 Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Kawasaki Dealer Management System
          </h2>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}