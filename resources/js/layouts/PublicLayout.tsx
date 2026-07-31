import { Link, usePage } from '@inertiajs/react';
import { House, Users, Briefcase, Wallet, SignIn } from '@phosphor-icons/react';
import appLogo from '../../images/logo/logo-komite-alikhlash-jatipadang.png';
import FlashMessage from '../components/FlashMessage';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { url } = usePage();

    const navLinkClass = (path: string) =>
        `transition-colors font-medium ${url === path ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`;

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900">
            <FlashMessage />

            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md transition-all duration-300">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-center px-4 sm:px-6 md:justify-between lg:px-8">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="group flex items-center gap-2.5 sm:gap-3"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10">
                                <img
                                    src={appLogo}
                                    alt="Logo Komite"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="mb-1 text-[8.5px] leading-none font-bold tracking-widest text-slate-500 uppercase sm:text-[10px]">
                                    Komite KBIT-TKIT
                                </span>
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-[11px] leading-none font-extrabold whitespace-nowrap text-transparent transition-all duration-300 group-hover:to-blue-600 sm:text-sm">
                                    Al-Ikhlash Pasar Minggu
                                </span>
                            </div>
                        </Link>
                    </div>

                    <nav className="hidden items-center gap-8 text-sm md:flex">
                        <Link href="/" className={navLinkClass('/')}>
                            Beranda
                        </Link>
                        <Link
                            href="/pengurus"
                            className={navLinkClass('/pengurus')}
                        >
                            Pengurus
                        </Link>
                        <Link
                            href="/program"
                            className={navLinkClass('/program')}
                        >
                            Program Kerja
                        </Link>
                        <Link
                            href="/keuangan"
                            className={navLinkClass('/keuangan')}
                        >
                            Transparansi Keuangan
                        </Link>
                    </nav>

                    <div className="hidden items-center gap-4 md:flex">
                        <Link
                            href="/login"
                            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-200 active:scale-95"
                        >
                            Login Pengurus
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pb-16 md:pb-0">{children}</main>

            {/* Footer */}
            <footer className="mt-auto border-t border-slate-100 bg-white py-8 pb-24 md:pb-8">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-1.5 px-4 text-center text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
                    <span>
                        &copy; {new Date().getFullYear()} Hak Cipta Dilindungi.
                    </span>
                    <span className="hidden sm:inline">&bull;</span>
                    <span>
                        Powered by{' '}
                        <a
                            href="https://www.instagram.com/studionettra"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-slate-700 transition-colors hover:text-blue-600"
                        >
                            Studio Nettra
                        </a>
                    </span>
                </div>
            </footer>

            {/* Mobile Bottom Navigation (Floating Glass Pill) */}
            <div
                className="pointer-events-none fixed bottom-0 left-0 z-50 w-full px-4 md:hidden"
                style={{
                    paddingBottom:
                        'calc(1.25rem + env(safe-area-inset-bottom))',
                }}
            >
                <nav className="pointer-events-auto overflow-hidden rounded-[1.25rem] border border-white/60 bg-white/75 shadow-2xl shadow-slate-300/40 backdrop-blur-xl">
                    <div className="flex h-[4.25rem] items-center justify-around px-1">
                        <Link
                            href="/"
                            className={`flex h-full w-full flex-col items-center justify-center space-y-1 ${url === '/' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <House
                                size={24}
                                weight={url === '/' ? 'fill' : 'regular'}
                            />
                            <span className="text-[10px] font-medium">
                                Beranda
                            </span>
                        </Link>
                        <Link
                            href="/pengurus"
                            className={`flex h-full w-full flex-col items-center justify-center space-y-1 ${url === '/pengurus' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Users
                                size={24}
                                weight={
                                    url === '/pengurus' ? 'fill' : 'regular'
                                }
                            />
                            <span className="text-[10px] font-medium">
                                Pengurus
                            </span>
                        </Link>
                        <Link
                            href="/program"
                            className={`flex h-full w-full flex-col items-center justify-center space-y-1 ${url.startsWith('/program') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Briefcase
                                size={24}
                                weight={
                                    url.startsWith('/program')
                                        ? 'fill'
                                        : 'regular'
                                }
                            />
                            <span className="text-[10px] font-medium">
                                Program
                            </span>
                        </Link>
                        <Link
                            href="/keuangan"
                            className={`flex h-full w-full flex-col items-center justify-center space-y-1 ${url.startsWith('/keuangan') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Wallet
                                size={24}
                                weight={
                                    url.startsWith('/keuangan')
                                        ? 'fill'
                                        : 'regular'
                                }
                            />
                            <span className="text-[10px] font-medium">
                                Keuangan
                            </span>
                        </Link>
                        <Link
                            href="/login"
                            className="flex h-full w-full flex-col items-center justify-center space-y-1 text-slate-400 hover:text-slate-600"
                        >
                            <SignIn size={24} weight="regular" />
                            <span className="text-[10px] font-medium">
                                Login
                            </span>
                        </Link>
                    </div>
                </nav>
            </div>
        </div>
    );
}
