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
    X
} from '@phosphor-icons/react';
import type { ReactNode} from 'react';
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
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 active:scale-[0.98] ${
                isActive 
                ? 'bg-blue-600/10 text-blue-400 font-semibold shadow-inner' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
        >
            <Icon weight={isActive ? "fill" : "duotone"} className="w-5 h-5" />
            {children}
        </Link>
    );
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage().props as any;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

    const closeSidebar = () => setIsSidebarOpen(false);
    
    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased flex flex-col md:flex-row">
            <Toaster position="top-right" />
            <FlashMessage />

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 bg-slate-900 text-white min-h-screen flex flex-col 
                transition-transform duration-300 ease-in-out border-r border-slate-800 shadow-2xl md:shadow-none
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-1.5 rounded-lg shadow-sm">
                            <img src={appLogo} alt="Logo" className="w-7 h-7 object-contain" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Dashboard Komite</span>
                    </div>
                    {/* Close button for mobile */}
                    <button 
                        onClick={closeSidebar} 
                        className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <X weight="bold" className="w-5 h-5" />
                    </button>
                </div>
                
                <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <NavLink href="/dashboard" icon={HouseLine} pathname={pathname} onClick={closeSidebar}>Dashboard</NavLink>
                    <NavLink href="/programs" icon={Briefcase} pathname={pathname} onClick={closeSidebar}>Program Kerja</NavLink>
                    <NavLink href="/meetings" icon={Users} pathname={pathname} onClick={closeSidebar}>Notulensi Rapat</NavLink>
                    <NavLink href="/transactions" icon={Wallet} pathname={pathname} onClick={closeSidebar}>Keuangan</NavLink>
                    
                    {auth?.user?.roles?.[0]?.name === 'Superadmin' && (
                        <>
                            <div className="pt-6 pb-2 px-4">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pengaturan</p>
                            </div>
                            
                            <NavLink href="/users" icon={UserGear} pathname={pathname} onClick={closeSidebar}>Pengguna</NavLink>
                            <NavLink href="/roles" icon={ShieldCheck} pathname={pathname} onClick={closeSidebar}>Role & Hak Akses</NavLink>
                        </>
                    )}
                </nav>
                
                <div className="p-5 border-t border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold shrink-0">
                            {auth?.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-semibold text-white truncate">{auth?.user?.name || 'User'}</div>
                            <div className="text-xs text-slate-400 truncate">{auth?.user?.roles?.[0]?.name || 'Member'}</div>
                        </div>
                    </div>
                    <Link 
                        href="/logout" 
                        method="post" 
                        as="button" 
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 text-slate-300 text-sm font-medium rounded-xl border border-slate-700 transition-all duration-200 active:scale-[0.98]"
                    >
                        <SignOut weight="bold" />
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header (Hamburger Menu) */}
                <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center z-30 sticky top-0">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <List weight="bold" className="w-6 h-6" />
                        </button>
                        <span className="font-bold text-slate-800">Menu</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200">
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
