import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

// Static image imports from resources/images
import anggotaHumasMamaFath from '../../../images/komite/anggota-humas-mama-fath.jpeg';
import anggotaHumasMamaThariq from '../../../images/komite/anggota-humas-mama-thariq.jpeg';
import anggotaKonsumsiMamaRyu from '../../../images/komite/anggota-konsumsi-mama-ryu.jpeg';
import anggotaSosmedMamaShanum from '../../../images/komite/angota-sosmed-mama-shanum.jpeg';
import bendaharaMamaSarah from '../../../images/komite/bendahara-mama-sarah.jpeg';
import ketuaKomiteMamaUna from '../../../images/komite/ketua-komite-mama-una.jpeg';
import ketuaKonsumsiMamaRazka from '../../../images/komite/ketua-konsumsi-mama-razka.jpeg';
import ketuaSosmedMamaAthar from '../../../images/komite/ketua-sosmed-mama-athar.jpeg';
import sekretarisMamaDaania from '../../../images/komite/sekretaris-mama-daania.jpeg';
import wakilKetuaMamaGhani from '../../../images/komite/wakil-ketua-mama-ghani.jpeg';
import PublicLayout from '../../layouts/PublicLayout';

export default function Organization() {
    const pengurus = [
        {
            title: 'Pengurus Harian',
            members: [
                { role: 'Ketua', name: 'Mama Una BL2 (Eka)', image: ketuaKomiteMamaUna },
                { role: 'Wakil Ketua', name: 'Mama Gani BL1 (Nova)', image: wakilKetuaMamaGhani },
                { role: 'Sekretaris', name: 'Mama Daania KBIT (Denissa)', image: sekretarisMamaDaania },
                { role: 'Bendahara', name: 'Mama Sarah B (Rima)', image: bendaharaMamaSarah },
            ]
        },
        {
            title: 'Bidang Media Sosial',
            members: [
                { role: 'Ketua', name: 'Mama Athar B (Vita)', image: ketuaSosmedMamaAthar },
                { role: 'Anggota', name: 'Mama Shanum BL1 (Widya)', image: anggotaSosmedMamaShanum },
                { role: 'Anggota', name: 'Mama Baarik B (Rosmanih)', image: null },
            ]
        },
        {
            title: 'Bidang Humas',
            members: [
                { role: 'Ketua', name: 'Mama Fath A2 (Sarah)', image: anggotaHumasMamaFath },
                { role: 'Anggota', name: 'Mama Thariq A2 (Kunairoh)', image: anggotaHumasMamaThariq },
            ]
        },
        {
            title: 'Bidang Konsumsi',
            members: [
                { role: 'Ketua', name: 'Mama Razka BL2 (Rahma)', image: ketuaKonsumsiMamaRazka },
                { role: 'Anggota', name: 'Mama Rayya A1 (Bella)', image: anggotaKonsumsiMamaRyu },
            ]
        },
    ];

    const getInitials = (name: string) => {
        const match = name.match(/\(([^)]+)\)/);

        if (match) {
return match[1].charAt(0).toUpperCase();
}

        return name.split(' ')[1]?.charAt(0).toUpperCase() || name.charAt(0).toUpperCase();
    };

    return (
        <PublicLayout>
            <Head title="Susunan Pengurus - Komite KBIT-TKIT Al-Ikhlash Pasar Minggu" />
            
            {/* Hero Section */}
            <section className="bg-slate-900 pt-32 pb-24 text-center text-white border-b border-slate-800 relative overflow-hidden">
                {/* Soft decorative circles for kindergarten feel without being sloppy */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
                
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-none">
                            Wajah di Balik Komite
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Mengenal lebih dekat para pengurus Komite KBIT-TKIT Al-Ikhlash Pasar Minggu yang berdedikasi tinggi untuk kemajuan peserta didik dan sekolah.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Structure Grid */}
            <section className="bg-white pb-32">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {pengurus.map((divisi, idx) => (
                        <div key={idx} className="py-20 border-b border-slate-100 last:border-0">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="mb-10 sm:mb-12"
                            >
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-center sm:text-left">{divisi.title}</h2>
                            </motion.div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
                                {divisi.members.map((member, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                        className="group flex flex-col"
                                    >
                                        <div className="aspect-[4/5] w-full rounded-[2rem] mb-5 overflow-hidden bg-slate-50 relative shadow-sm border border-slate-100 group-hover:shadow-xl transition-all duration-500">
                                            {member.image ? (
                                                <img 
                                                    src={member.image} 
                                                    alt={member.name} 
                                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-50 flex items-center justify-center text-5xl font-extrabold text-slate-300 group-hover:text-blue-400 group-hover:bg-blue-50 transition-colors duration-500">
                                                    {getInitials(member.name)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1 text-center sm:text-left">
                                            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{member.name}</h3>
                                            <p className="text-xs sm:text-sm font-medium text-slate-500">
                                                {member.role}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
