import { Head, usePage } from '@inertiajs/react';
import bannerImage from '../../images/banners/image-banner-dashboard-komite.png';
import AnggotaDashboard from '../components/dashboard/AnggotaDashboard';
import BendaharaDashboard from '../components/dashboard/BendaharaDashboard';
import SekretarisDashboard from '../components/dashboard/SekretarisDashboard';
import SuperadminDashboard from '../components/dashboard/SuperadminDashboard';
import DashboardLayout from '../layouts/DashboardLayout';


export default function Dashboard(props: any) {
    const { auth } = usePage().props as any;
    const { role } = props;

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
    };

    const renderDashboard = () => {
        switch (role) {
            case 'Superadmin':
                return <SuperadminDashboard {...props} formatRupiah={formatRupiah} />;
            case 'Bendahara':
                return <BendaharaDashboard {...props} formatRupiah={formatRupiah} />;
            case 'Sekretaris':
                return <SekretarisDashboard {...props} formatRupiah={formatRupiah} />;
            default:
                return <AnggotaDashboard {...props} formatRupiah={formatRupiah} />;
        }
    };

    return (
        <DashboardLayout>
            <Head title="Dashboard Komite" />
            
            <div className="space-y-8 w-full">
                {/* Hero / Greeting Section */}
                <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-sm min-h-[300px] flex flex-col justify-center">
                    {/* Subtle background glow */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/20 blur-3xl rounded-full pointer-events-none z-0"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none z-0"></div>
                    
                    {/* Integrated Banner Image (Photo Background Style) */}
                    <div 
                        className="absolute inset-y-0 right-0 w-full md:w-1/2 lg:w-5/12 z-0 hidden md:block pointer-events-none"
                        style={{ 
                            WebkitMaskImage: 'linear-gradient(to right, transparent 10%, black 30%, black 100%)',
                            maskImage: 'linear-gradient(to right, transparent 5%, black 30%, black 100%)'
                        }}
                    >
                        <img 
                            src={bannerImage} 
                            alt="Dashboard Banner" 
                            className="w-full h-full object-cover object-right-top opacity-30 mix-blend-luminosity hover:mix-blend-overlay hover:opacity-60 transition-all duration-1000"
                        />
                    </div>
                    
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6 max-w-2xl">
                        <div className="w-20 h-20 bg-white/10 border border-white/20 text-white rounded-2xl flex items-center justify-center text-3xl font-semibold shadow-inner backdrop-blur-md shrink-0">
                            {auth?.user?.name?.charAt(0) || 'K'}
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/90 text-xs font-semibold mb-3 backdrop-blur-md shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Logged in as {auth?.user?.roles?.[0]?.name || 'Admin'}
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-sm">
                                Selamat Datang, {auth?.user?.name || 'Pengurus'}
                            </h1>
                            <p className="mt-2.5 text-slate-300 max-w-lg leading-relaxed font-medium">
                                {role === 'Bendahara' 
                                    ? 'Kelola arus kas, pantau pemasukan dan pengeluaran, serta pastikan transparansi keuangan komite terjaga.'
                                    : role === 'Sekretaris'
                                        ? 'Kelola administrasi, catat notulensi rapat, dan pastikan seluruh dokumen program kerja terarsip dengan baik.'
                                        : role === 'Superadmin'
                                            ? 'Pantau dan kelola seluruh aktivitas, program kerja, serta transparansi kas Komite dengan mudah dari panel ini.'
                                            : 'Pantau transparansi kas, agenda program kerja, dan hasil keputusan rapat secara mudah di sini.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Role Specific Dashboard */}
                {renderDashboard()}
            </div>
        </DashboardLayout>
    );
}
