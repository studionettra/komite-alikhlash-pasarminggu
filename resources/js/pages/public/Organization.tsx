import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

// Static image imports from resources/images
import anggotaHumasMamaFath from '../../../images/komite/anggota-humas-mama-fath.jpeg';
import anggotaHumasMamaThariq from '../../../images/komite/anggota-humas-mama-thariq.jpeg';
import anggotaKonsumsiMamaRayya from '../../../images/komite/anggota-konsumsi-mama-rayya.jpeg';
import anggotaKonsumsiMamaRyu from '../../../images/komite/anggota-konsumsi-mama-ryu.jpeg';
import anggotaSosmedMamaBaarik from '../../../images/komite/anggota-sosmed-mama-baarik.jpeg';
import anggotaSosmedMamaShanum from '../../../images/komite/angota-sosmed-mama-shanum.jpeg';
import bendaharaMamaSarah from '../../../images/komite/bendahara-mama-sarah.jpeg';
import kepalaSekolah from '../../../images/komite/kepala-sekolah-Ibu-Rifdah, S.Pd..jpg';
import ketuaKomiteMamaUna from '../../../images/komite/ketua-komite-mama-una.jpeg';
import ketuaKonsumsiMamaRazka from '../../../images/komite/ketua-konsumsi-mama-razka.jpeg';
import ketuaSosmedMamaAthar from '../../../images/komite/ketua-sosmed-mama-athar.jpeg';
import sekretarisMamaDaania from '../../../images/komite/sekretaris-mama-daania.jpeg';
import wakilKetuaMamaGhani from '../../../images/komite/wakil-ketua-mama-ghani.jpeg';
import PublicLayout from '../../layouts/PublicLayout';

export default function Organization() {
    const pengurus = [
        {
            title: 'Kepala Sekolah',
            members: [
                {
                    role: 'Kepala Sekolah',
                    name: 'Rifda, S.Pd.',
                    image: kepalaSekolah,
                },
            ],
        },
        {
            title: 'Pengurus Harian',
            members: [
                {
                    role: 'Ketua',
                    name: 'Eka Putri Rahayu (Una - BL2)',
                    image: ketuaKomiteMamaUna,
                },
                {
                    role: 'Wakil Ketua',
                    name: 'Noval Aysha Pratiwi (Ghani - BL1)',
                    image: wakilKetuaMamaGhani,
                },
                {
                    role: 'Sekretaris',
                    name: 'Denissa Indriana (Daania - KBIT)',
                    image: sekretarisMamaDaania,
                },
                {
                    role: 'Bendahara',
                    name: 'Karima Salsabila (Sarah - B)',
                    image: bendaharaMamaSarah,
                },
            ],
        },
        {
            title: 'Bidang Media Sosial',
            members: [
                {
                    role: 'Ketua',
                    name: 'Novita Diah Lestari (Athar - KBIT)',
                    image: ketuaSosmedMamaAthar,
                },
                {
                    role: 'Anggota',
                    name: 'Widiya Juliana (Shanum - BL1)',
                    image: anggotaSosmedMamaShanum,
                },
                {
                    role: 'Anggota',
                    name: 'Rosmanih (Baarik - B)',
                    image: anggotaSosmedMamaBaarik,
                },
            ],
        },
        {
            title: 'Bidang Konsumsi',
            members: [
                {
                    role: 'Ketua',
                    name: 'Rahmawati (Razka - BL2)',
                    image: ketuaKonsumsiMamaRazka,
                },
                {
                    role: 'Anggota',
                    name: 'Tuti Alawiyah (Ryu - A1)',
                    image: anggotaKonsumsiMamaRyu,
                },
                {
                    role: 'Anggota',
                    name: 'Nabila Rivmi (Rayya - A1)',
                    image: anggotaKonsumsiMamaRayya,
                },
            ],
        },
        {
            title: 'Bidang Humas',
            members: [
                {
                    role: 'Ketua',
                    name: 'Nurlaila Zahra (Fath - A2)',
                    image: anggotaHumasMamaFath,
                },
                {
                    role: 'Anggota',
                    name: 'Kunairoh (Thariq - A2)',
                    image: anggotaHumasMamaThariq,
                },
            ],
        },
    ];

    const getInitials = (name: string) => {
        const match = name.match(/\(([^)]+)\)/);

        if (match) {
            return match[1].charAt(0).toUpperCase();
        }

        return (
            name.split(' ')[1]?.charAt(0).toUpperCase() ||
            name.charAt(0).toUpperCase()
        );
    };

    return (
        <PublicLayout>
            <Head title="Susunan Pengurus - Komite KBIT-TKIT Al-Ikhlash Pasar Minggu" />

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-slate-800 bg-slate-900 pt-32 pb-24 text-center text-white">
                {/* Soft decorative circles for kindergarten feel without being sloppy */}
                <div className="absolute top-0 left-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl"></div>
                <div className="absolute right-0 bottom-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-amber-500/10 blur-3xl"></div>

                <div className="relative z-10 mx-auto max-w-4xl px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="mb-6 text-4xl leading-none font-extrabold tracking-tight md:text-6xl">
                            Wajah di Balik Komite
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
                            Mengenal lebih dekat para pengurus Komite KBIT-TKIT
                            Al-Ikhlash Pasar Minggu yang berdedikasi tinggi
                            untuk kemajuan peserta didik dan sekolah.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Structure Grid */}
            <section className="bg-white pb-32">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {pengurus.map((divisi, idx) => (
                        <div
                            key={idx}
                            className="border-b border-slate-100 py-20 last:border-0"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={{
                                    duration: 0.5,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className="mb-10 sm:mb-12"
                            >
                                <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-left sm:text-3xl">
                                    {divisi.title}
                                </h2>
                            </motion.div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
                                {divisi.members.map((member, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{
                                            once: true,
                                            margin: '-50px',
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            delay: i * 0.1,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        className="group flex flex-col"
                                    >
                                        <div className="relative mb-5 aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50 shadow-sm transition-all duration-500 group-hover:shadow-xl">
                                            {member.image ? (
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className={`h-full w-full object-cover transition-transform duration-500 ease-out ${
                                                        member.role === 'Kepala Sekolah'
                                                            ? 'object-[center_15%] scale-[1.6] group-hover:scale-[1.7]'
                                                            : 'object-center group-hover:scale-[1.15]'
                                                    }`}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-slate-50 text-5xl font-extrabold text-slate-300 transition-colors duration-500 group-hover:bg-blue-50 group-hover:text-blue-400">
                                                    {getInitials(member.name)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1 text-center sm:text-left">
                                            <h3 className="text-sm leading-tight font-bold text-slate-900 transition-colors group-hover:text-blue-600 sm:text-base">
                                                {member.name}
                                            </h3>
                                            <p className="text-xs font-medium text-slate-500 sm:text-sm">
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
