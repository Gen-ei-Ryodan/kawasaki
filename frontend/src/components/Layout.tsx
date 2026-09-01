'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  UserCircle,
  Users,
  Bike,
  Target,
  TrendingUp,
  CalendarClock,
  Wrench,
  DollarSign,
  Hammer,
  ShieldCheck,
  Star,
  Trophy,
  BarChart3,
  LogOut,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard',         href: '/dashboard',         icon: LayoutDashboard },
  { name: 'Dealers',           href: '/dealers',           icon: Building2 },
  { name: 'Salespersons',      href: '/salespersons',      icon: UserCircle },
  { name: 'Customers',         href: '/customers',         icon: Users },
  { name: 'Vehicle Models',    href: '/vehicle-models',    icon: Bike },
  { name: 'Leads',             href: '/leads',             icon: Target },
  { name: 'Sales Pipeline',    href: '/leads/pipeline',    icon: TrendingUp },
  { name: 'Follow Ups',        href: '/follow-ups',        icon: CalendarClock },
  { name: 'Vehicles',          href: '/vehicles',          icon: Wrench },
  { name: 'Sales',             href: '/sales',             icon: DollarSign },
  { name: 'Services',          href: '/services',          icon: Hammer },
  { name: 'Warranties',        href: '/warranties',        icon: ShieldCheck },
  { name: 'Loyalty',           href: '/loyalty',           icon: Star },
  { name: 'Sales Targets',     href: '/sales-targets',     icon: Trophy },
  { name: 'Reports',           href: '/reports',           icon: BarChart3 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-red-500 tracking-wide">KAWASAKI</h1>
          <p className="text-xs text-gray-300 mt-0.5">Dealer Management</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-200 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="mr-3 h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="text-sm text-gray-200 mb-3">
            <p className="font-semibold text-white">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-[18px] w-[18px]" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Kawasaki Dealer Management System
          </h2>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

