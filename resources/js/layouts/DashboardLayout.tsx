import { usePage, Link } from '@inertiajs/react';
import {
    HouseLine,
    Briefcase,
    Users,
    Wallet,
    UserGear,
    ShieldCheck,
    SignOut,
    List,
    X,
} from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import appLogo from '../../images/logo/logo-komite-alikhlash-jatipadang.png';
import FlashMessage from '../components/FlashMessage';

const NavLink = ({ href, icon: Icon, children, pathname, onClick }: any) => {
    const isActive = pathname.startsWith(href);

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 active:scale-[0.98] ${
                isActive
                    ? 'bg-blue-600/10 font-semibold text-blue-400 shadow-inner'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
        >
            <Icon weight={isActive ? 'fill' : 'duotone'} className="h-5 w-5" />
            {children}
        </Link>
    );
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage().props as any;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname =
        typeof window !== 'undefined' ? window.location.pathname : '';

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans antialiased md:flex-row">
            <Toaster position="top-right" />
            <FlashMessage />

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex min-h-screen w-72 flex-col border-r border-slate-800 bg-slate-900 text-white shadow-2xl transition-transform duration-300 ease-in-out md:static md:w-64 md:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} `}
            >
                <div className="flex items-center justify-between border-b border-slate-800 p-5">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-white p-1.5 shadow-sm">
                            <img
                                src={appLogo}
                                alt="Logo"
                                className="h-7 w-7 object-contain"
                            />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            Dashboard Komite
                        </span>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={closeSidebar}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white md:hidden"
                    >
                        <X weight="bold" className="h-5 w-5" />
                    </button>
                </div>

                <nav className="custom-scrollbar flex-1 space-y-1.5 overflow-y-auto px-3 py-6">
                    <NavLink
                        href="/dashboard"
                        icon={HouseLine}
                        pathname={pathname}
                        onClick={closeSidebar}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        href="/programs"
                        icon={Briefcase}
                        pathname={pathname}
                        onClick={closeSidebar}
                    >
                        Program Kerja
                    </NavLink>
                    <NavLink
                        href="/meetings"
                        icon={Users}
                        pathname={pathname}
                        onClick={closeSidebar}
                    >
                        Notulensi Rapat
                    </NavLink>
                    <NavLink
                        href="/transactions"
                        icon={Wallet}
                        pathname={pathname}
                        onClick={closeSidebar}
                    >
                        Keuangan
                    </NavLink>

                    {auth?.user?.roles?.[0]?.name === 'Superadmin' && (
                        <>
                            <div className="px-4 pt-6 pb-2">
                                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                    Pengaturan
                                </p>
                            </div>

                            <NavLink
                                href="/users"
                                icon={UserGear}
                                pathname={pathname}
                                onClick={closeSidebar}
                            >
                                Pengguna
                            </NavLink>
                            <NavLink
                                href="/roles"
                                icon={ShieldCheck}
                                pathname={pathname}
                                onClick={closeSidebar}
                            >
                                Role & Hak Akses
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="border-t border-slate-800 bg-slate-900/50 p-5">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 font-bold text-blue-400">
                            {auth?.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <div className="truncate text-sm font-semibold text-white">
                                {auth?.user?.name || 'User'}
                            </div>
                            <div className="truncate text-xs text-slate-400">
                                {auth?.user?.roles?.[0]?.name || 'Member'}
                            </div>
                        </div>
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400 active:scale-[0.98]"
                    >
                        <SignOut weight="bold" />
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex h-screen flex-1 flex-col overflow-hidden">
                {/* Mobile Header (Hamburger Menu) */}
                <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="-ml-2 rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
                        >
                            <List weight="bold" className="h-6 w-6" />
                        </button>
                        <span className="font-bold text-slate-800">Menu</span>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600">
                        {auth?.user?.name?.charAt(0) || 'U'}
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
