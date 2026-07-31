import { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../layouts/PublicLayout';
import ProgramCalendar from '../../components/public/ProgramCalendar';

export default function Home({ heroProgram, activePrograms }: any) {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://elfsightcdn.com/platform.js";
        script.async = true;
        document.body.appendChild(script);

        // Skrip untuk membersihkan watermark secara agresif lewat Javascript
        const cleanerInterval = setInterval(() => {
            // Cari elemen link yang mengarah ke elfsight
            const links = document.querySelectorAll('a[href*="elfsight.com"], a[href*="elfsight"]');
            links.forEach(link => {
                // Sembunyikan elemen
                (link as HTMLElement).style.setProperty('display', 'none', 'important');
            });
            
            // Cari elemen badge dengan nama class spesifik
            const badges = document.querySelectorAll('[class*="Badge__Container"], [class*="Watermark__Container"], .eapps-link');
            badges.forEach(badge => {
                (badge as HTMLElement).style.setProperty('display', 'none', 'important');
            });
            
            // Cek jika ada shadow root
            const widget = document.querySelector('.elfsight-app-81fba1fa-87f5-4b47-bdbd-1eff0f9bdbf6');
            if (widget && widget.shadowRoot) {
                const shadowLinks = widget.shadowRoot.querySelectorAll('a[href*="elfsight.com"]');
                shadowLinks.forEach(link => {
                    (link as HTMLElement).style.setProperty('display', 'none', 'important');
                });
                
                const shadowBadges = widget.shadowRoot.querySelectorAll('[class*="Badge__Container"], [class*="Watermark__Container"]');
                shadowBadges.forEach(badge => {
                    (badge as HTMLElement).style.setProperty('display', 'none', 'important');
                });
            }
        }, 300);

        return () => {
            clearInterval(cleanerInterval);
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <PublicLayout>
            <Head title="Beranda - Komite KBIT-TKIT Al-Ikhlash Pasar Minggu" />
            
            {/* Hero Section */}
            <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {heroProgram ? (
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                            {/* Text Content */}
                            <div className="w-full lg:w-1/2 lg:pr-8">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${heroProgram.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {heroProgram.status === 'ongoing' ? 'Sedang Berlangsung' : 'Program Utama'}
                                </div>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.15] mb-6">
                                    {heroProgram.title}
                                </h1>
                                <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                                    {heroProgram.description || 'Mari dukung dan sukseskan program komite ini bersama-sama demi kemajuan pendidikan anak-anak kita.'}
                                </p>
                                <div className="flex flex-wrap items-center gap-4">
                                    <Link 
                                        href={`/program?id=${heroProgram.id}`} 
                                        className="inline-flex items-center justify-center px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-xl shadow-sm hover:bg-blue-700 hover:-translate-y-[1px] transition-all duration-200"
                                    >
                                        Detail Program
                                    </Link>
                                    {heroProgram.start_date && (
                                        <div className="inline-flex items-center gap-2 text-slate-500 font-medium px-4 py-3.5">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(heroProgram.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Image Content (Placeholder) */}
                            <div className="w-full lg:w-1/2">
                                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-[4/3] bg-gradient-to-br from-blue-100 to-indigo-50 border border-blue-200 shadow-sm flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="w-20 h-20 bg-blue-200 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-blue-800 font-medium">Gambar Program Segera Hadir</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.15] mb-6">
                                Transparansi untuk <br className="hidden sm:block"/>
                                <span className="text-blue-600">Pendidikan Anak Kita</span>
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Temukan informasi program kerja, laporan keuangan, dan ruang partisipasi secara terbuka dari Komite KBIT-TKIT Al-Ikhlash Pasar Minggu.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Active Programs Snippet */}
            <ProgramCalendar activePrograms={heroProgram ? [heroProgram, ...activePrograms] : activePrograms} />

            {/* Financial CTA Banner */}
            <section className="py-16 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900 rounded-3xl overflow-hidden relative shadow-lg">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
                            </svg>
                        </div>
                        
                        <div className="relative p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold uppercase tracking-wider mb-4">
                                    Transparansi
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                                    Laporan Keuangan Terbuka
                                </h2>
                                <p className="text-slate-300 text-lg leading-relaxed">
                                    Kami berkomitmen untuk mengelola dana komite secara transparan dan akuntabel. Akses seluruh rincian pemasukan dan pengeluaran program secara terbuka.
                                </p>
                            </div>
                            
                            <div className="flex-shrink-0 w-full md:w-auto">
                                <Link 
                                    href="/keuangan" 
                                    className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl shadow-sm hover:bg-slate-100 hover:scale-105 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Lihat Laporan
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Instagram Feed Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white shrink-0">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Ikuti Aktivits Kami di Instagram</h2>
                            </div>
                        </div>
                        <a 
                            href="https://www.instagram.com/tkit.alikhlash/?hl=en" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:-translate-y-[1px] transition-all duration-200 whitespace-nowrap"
                        >
                            Follow Now
                        </a>
                    </div>

                    <div className="mt-8 min-h-[300px] w-full">
                        <div className="elfsight-app-81fba1fa-87f5-4b47-bdbd-1eff0f9bdbf6" data-elfsight-app-lazy="true"></div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
