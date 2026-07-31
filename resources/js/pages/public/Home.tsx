import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import ProgramCalendar from '../../components/public/ProgramCalendar';
import PublicLayout from '../../layouts/PublicLayout';

export default function Home({ heroProgram, activePrograms }: any) {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://elfsightcdn.com/platform.js';
        script.async = true;
        document.body.appendChild(script);

        // Skrip untuk membersihkan watermark secara agresif lewat Javascript
        const cleanerInterval = setInterval(() => {
            // Cari elemen link yang mengarah ke elfsight
            const links = document.querySelectorAll(
                'a[href*="elfsight.com"], a[href*="elfsight"]',
            );
            links.forEach((link) => {
                // Sembunyikan elemen
                (link as HTMLElement).style.setProperty(
                    'display',
                    'none',
                    'important',
                );
            });

            // Cari elemen badge dengan nama class spesifik
            const badges = document.querySelectorAll(
                '[class*="Badge__Container"], [class*="Watermark__Container"], .eapps-link',
            );
            badges.forEach((badge) => {
                (badge as HTMLElement).style.setProperty(
                    'display',
                    'none',
                    'important',
                );
            });

            // Cek jika ada shadow root
            const widget = document.querySelector(
                '.elfsight-app-81fba1fa-87f5-4b47-bdbd-1eff0f9bdbf6',
            );

            if (widget && widget.shadowRoot) {
                const shadowLinks = widget.shadowRoot.querySelectorAll(
                    'a[href*="elfsight.com"]',
                );
                shadowLinks.forEach((link) => {
                    (link as HTMLElement).style.setProperty(
                        'display',
                        'none',
                        'important',
                    );
                });

                const shadowBadges = widget.shadowRoot.querySelectorAll(
                    '[class*="Badge__Container"], [class*="Watermark__Container"]',
                );
                shadowBadges.forEach((badge) => {
                    (badge as HTMLElement).style.setProperty(
                        'display',
                        'none',
                        'important',
                    );
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
            <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 pt-24 pb-20 lg:pt-32 lg:pb-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {heroProgram ? (
                        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
                            {/* Text Content */}
                            <div className="w-full lg:w-1/2 lg:pr-8">
                                <div
                                    className={`mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase ${heroProgram.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}
                                >
                                    {heroProgram.status === 'ongoing'
                                        ? 'Sedang Berlangsung'
                                        : 'Program Utama'}
                                </div>
                                <h1 className="mb-6 text-4xl leading-[1.15] font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                                    {heroProgram.title}
                                </h1>
                                <p className="mb-8 max-w-lg text-lg leading-relaxed text-slate-600">
                                    {heroProgram.description ||
                                        'Mari dukung dan sukseskan program komite ini bersama-sama demi kemajuan pendidikan anak-anak kita.'}
                                </p>
                                <div className="flex flex-wrap items-center gap-4">
                                    <Link
                                        href={`/program?id=${heroProgram.id}`}
                                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:bg-blue-700"
                                    >
                                        Detail Program
                                    </Link>
                                    {heroProgram.start_date && (
                                        <div className="inline-flex items-center gap-2 px-4 py-3.5 font-medium text-slate-500">
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            {new Date(
                                                heroProgram.start_date,
                                            ).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Image Content (Placeholder) */}
                            <div className="w-full lg:w-1/2">
                                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-100 to-indigo-50 shadow-sm lg:aspect-[4/3]">
                                    <div className="p-8 text-center">
                                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-200 text-blue-600">
                                            <svg
                                                className="h-10 w-10"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="font-medium text-blue-800">
                                            Gambar Program Segera Hadir
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <h1 className="mb-6 text-4xl leading-[1.15] font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                                Transparansi untuk{' '}
                                <br className="hidden sm:block" />
                                <span className="text-blue-600">
                                    Pendidikan Anak Kita
                                </span>
                            </h1>
                            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-600">
                                Temukan informasi program kerja, laporan
                                keuangan, dan ruang partisipasi secara terbuka
                                dari Komite KBIT-TKIT Al-Ikhlash Pasar Minggu.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Active Programs Snippet */}
            <ProgramCalendar
                activePrograms={
                    heroProgram
                        ? [heroProgram, ...activePrograms]
                        : activePrograms
                }
            />

            {/* Financial CTA Banner */}
            <section className="border-t border-slate-200 bg-slate-50 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-lg">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <svg
                                className="h-full w-full"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M0 100 C 20 0 50 0 100 100 Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>

                        <div className="relative flex flex-col items-center justify-between gap-8 p-8 md:flex-row md:p-12 lg:p-16">
                            <div className="max-w-2xl">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold tracking-wider text-slate-300 uppercase">
                                    Transparansi
                                </div>
                                <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                                    Laporan Keuangan Terbuka
                                </h2>
                                <p className="text-lg leading-relaxed text-slate-300">
                                    Kami berkomitmen untuk mengelola dana komite
                                    secara transparan dan akuntabel. Akses
                                    seluruh rincian pemasukan dan pengeluaran
                                    program secara terbuka.
                                </p>
                            </div>

                            <div className="w-full flex-shrink-0 md:w-auto">
                                <Link
                                    href="/keuangan"
                                    className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 font-bold text-slate-900 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 md:w-auto"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Lihat Laporan
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Instagram Feed Section */}
            <section className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white">
                                <svg
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Ikuti Aktivits Kami di Instagram
                                </h2>
                            </div>
                        </div>
                        <a
                            href="https://www.instagram.com/tkit.alikhlash/?hl=en"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-bold whitespace-nowrap text-white shadow-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg"
                        >
                            Follow Now
                        </a>
                    </div>

                    <div className="mt-8 min-h-[300px] w-full">
                        <div
                            className="elfsight-app-81fba1fa-87f5-4b47-bdbd-1eff0f9bdbf6"
                            data-elfsight-app-lazy="true"
                        ></div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
