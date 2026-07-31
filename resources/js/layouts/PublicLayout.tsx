import { Link, usePage } from '@inertiajs/react';
import { House, Users, Briefcase, Wallet, SignIn } from '@phosphor-icons/react';
import appLogo from '../../images/logo/logo-komite-alikhlash-jatipadang.png';
import FlashMessage from '../components/FlashMessage';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();

    const navLinkClass = (path: string) => 
        `transition-colors font-medium ${url === path ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900 flex flex-col">
            <FlashMessage />
            
            {/* Navbar */}
            <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 transition-all duration-300">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shrink-0">
                                <img src={appLogo} alt="Logo Komite" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-[8.5px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
                                    Komite KBIT-TKIT
                                </span>
                                <span className="text-[11px] sm:text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 leading-none group-hover:to-blue-600 transition-all duration-300 whitespace-nowrap">
                                    Al-Ikhlash Pasar Minggu
                                </span>
                            </div>
                        </Link>
                    </div>
                    
                    <nav className="hidden md:flex items-center gap-8 text-sm">
                        <Link href="/" className={navLinkClass('/')}>Beranda</Link>
                        <Link href="/pengurus" className={navLinkClass('/pengurus')}>Pengurus</Link>
                        <Link href="/program" className={navLinkClass('/program')}>Program Kerja</Link>
                        <Link href="/keuangan" className={navLinkClass('/keuangan')}>Transparansi Keuangan</Link>
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login" className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all active:scale-95 shadow-sm hover:shadow-md hover:shadow-blue-200 whitespace-nowrap">
                            Login Pengurus
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pb-16 md:pb-0">
                {children}
            </main>
            
            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-8 mt-auto pb-24 md:pb-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5">
                    <span>&copy; {new Date().getFullYear()} Hak Cipta Dilindungi.</span>
                    <span className="hidden sm:inline">&bull;</span>
                    <span>
                        Powered by <a href="https://www.instagram.com/studionettra" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-700 hover:text-blue-600 transition-colors">Studio Nettra</a>
                    </span>
                </div>
            </footer>

            {/* Mobile Bottom Navigation (Floating Glass Pill) */}
            <div className="md:hidden fixed bottom-0 left-0 w-full z-50 px-4 pointer-events-none" style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}>
                <nav className="pointer-events-auto bg-white/75 backdrop-blur-xl border border-white/60 shadow-2xl shadow-slate-300/40 rounded-[1.25rem] overflow-hidden">
                    <div className="flex justify-around items-center h-[4.25rem] px-1">
                    <Link href="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${url === '/' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        <House size={24} weight={url === '/' ? "fill" : "regular"} />
                        <span className="text-[10px] font-medium">Beranda</span>
                    </Link>
                    <Link href="/pengurus" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${url === '/pengurus' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        <Users size={24} weight={url === '/pengurus' ? "fill" : "regular"} />
                        <span className="text-[10px] font-medium">Pengurus</span>
                    </Link>
                    <Link href="/program" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${url.startsWith('/program') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        <Briefcase size={24} weight={url.startsWith('/program') ? "fill" : "regular"} />
                        <span className="text-[10px] font-medium">Program</span>
                    </Link>
                    <Link href="/keuangan" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${url.startsWith('/keuangan') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        <Wallet size={24} weight={url.startsWith('/keuangan') ? "fill" : "regular"} />
                        <span className="text-[10px] font-medium">Keuangan</span>
                    </Link>
                    <Link href="/login" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-400 hover:text-slate-600">
                        <SignIn size={24} weight="regular" />
                        <span className="text-[10px] font-medium">Login</span>
                    </Link>
                </div>
                </nav>
            </div>
        </div>
    );
}
