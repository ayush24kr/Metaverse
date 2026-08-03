"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Bookmark,
  Activity,
  BarChart3,
  Dna,
  User,
  Film,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNav = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Search", href: "/search", icon: Search },
    { name: "Watchlist", href: "/watchlist", icon: Bookmark },
  ];

  const insightNav = [
    { name: "Activity", href: "/activity", icon: Activity },
    { name: "Statistics", href: "/statistics", icon: BarChart3 },
    { name: "Entertainment DNA", href: "/dna", icon: Dna, badge: "AI" },
  ];

  const personalNav = [
    { name: "Profile", href: "/profile", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col md:flex-row antialiased">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#18181B]/80 backdrop-blur-xl border-r border-[#27272A] sticky top-0 h-screen z-40">
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-[#27272A]/60">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                MediaVerse
              </span>
              <span className="block text-[10px] text-[#A1A1AA] uppercase tracking-wider font-semibold">
                SaaS Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
          {/* Main Group */}
          <div>
            <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] mb-3">
              Overview
            </div>
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active
                        ? "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 shadow-sm"
                        : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A]/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${active ? "text-[#3B82F6]" : "text-[#A1A1AA]"}`} />
                      <span>{item.name}</span>
                    </div>
                    {active && <ChevronRight className="w-3.5 h-3.5 text-[#3B82F6]" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Insights Group */}
          <div>
            <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] mb-3">
              Analytics & AI
            </div>
            <nav className="space-y-1">
              {insightNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active
                        ? "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 shadow-sm"
                        : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A]/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${active ? "text-[#3B82F6]" : "text-[#A1A1AA]"}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5" />
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Account Group */}
          <div>
            <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] mb-3">
              Personal
            </div>
            <nav className="space-y-1">
              {personalNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active
                        ? "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 shadow-sm"
                        : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A]/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${active ? "text-[#3B82F6]" : "text-[#A1A1AA]"}`} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Footer Profile Card */}
        <div className="p-4 border-t border-[#27272A]/60">
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-[#1F1F23] border border-[#27272A]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#FAFAFA] truncate">Ayush</p>
              <p className="text-[10px] text-[#A1A1AA] truncate">Pro Member</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#18181B] border-b border-[#27272A] sticky top-0 z-50">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
            <Film className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            MediaVerse
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#A1A1AA] hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#18181B] border-b border-[#27272A] p-4 space-y-4 z-40">
          <nav className="space-y-1">
            {[...mainNav, ...insightNav, ...personalNav].map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    active ? "bg-[#3B82F6]/10 text-[#3B82F6]" : "text-[#A1A1AA]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
