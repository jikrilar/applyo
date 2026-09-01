"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { logoutAction } from "@/app/(auth)/actions";

const navigation = [
  { href: "/dashboard", label: "Dasbor", icon: LayoutDashboard },
  { href: "/aplikasi", label: "Lamaran", icon: BriefcaseBusiness },
  { href: "/kalender", label: "Kalender", icon: CalendarDays },
  { href: "/analitik", label: "Analitik", icon: BarChart3 },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
];

export function AppShell({ children, profile }: { children: React.ReactNode; profile: { displayName: string; email: string; initials: string } }) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link className="wordmark" href="/" aria-label="Beranda Applyo">Apply<span>o</span></Link>
        <nav className="app-navigation" aria-label="Navigasi aplikasi">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link href={href} className={pathname === href ? "active" : ""} key={label}>
              <Icon aria-hidden="true" /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <form action={logoutAction}><button className="sidebar-logout" type="submit"><LogOut aria-hidden="true" /> Keluar</button></form>
      </aside>

      <div className="app-frame">
        <header className="app-topbar">
          <div className="mobile-brand">
            <Link className="wordmark" href="/">Apply<span>o</span></Link>
          </div>
          <div className="app-topbar-actions">
            <ThemeToggle />
            <div className="profile-menu" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setProfileOpen(false); }}>
              <button className="profile-button" type="button" aria-label="Buka menu profil" aria-expanded={profileOpen} onClick={() => setProfileOpen((value) => !value)}><span>{profile.initials}</span><span className="profile-copy"><strong>{profile.displayName}</strong><small>{profile.email}</small></span><ChevronDown /></button>
              {profileOpen && <div className="profile-popover"><strong>{profile.displayName}</strong><small>{profile.email}</small><form action={logoutAction}><button type="submit"><LogOut /> Keluar</button></form></div>}
            </div>
          </div>
        </header>
        <main className="app-content">{children}</main>
        <nav className="mobile-app-nav" aria-label="Navigasi aplikasi seluler">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link href={href} className={pathname === href ? "active" : ""} key={label}><Icon aria-hidden="true" /><span>{label}</span></Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
