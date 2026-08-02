import { CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type ModalState = {
    isOpen: boolean;
    mode: 'confirm' | 'success';
    message: string;
    onConfirm?: () => void;
};

export default function GlobalAlertModal() {
    const [state, setState] = useState<ModalState>({
        isOpen: false,
        mode: 'confirm',
        message: '',
    });

    useEffect(() => {
        const handleConfirm = (e: any) => {
            setState({
                isOpen: true,
                mode: 'confirm',
                message: e.detail.message,
                onConfirm: e.detail.onConfirm,
            });
        };

        const handleSuccess = (e: any) => {
            setState({
                isOpen: true,
                mode: 'success',
                message: e.detail.message,
            });

            // Automatically close success modal after 3 seconds
            setTimeout(() => {
                setState((prev) => (prev.mode === 'success' ? { ...prev, isOpen: false } : prev));
            }, 3000);
        };

        window.addEventListener('open-confirm-modal', handleConfirm);
        window.addEventListener('show-delete-success-modal', handleSuccess);

        return () => {
            window.removeEventListener('open-confirm-modal', handleConfirm);
            window.removeEventListener('show-delete-success-modal', handleSuccess);
        };
    }, []);

    const close = () => {
        setState((prev) => ({ ...prev, isOpen: false }));
    };

    const confirm = () => {
        if (state.onConfirm) {
            state.onConfirm();
        }

        close();
    };

    return (
        <AnimatePresence>
            {state.isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={state.mode === 'confirm' ? close : undefined}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Modal Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl shadow-slate-900/20"
                    >
                        {state.mode === 'confirm' ? (
                            <>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                                    <WarningCircle weight="fill" className="h-10 w-10" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-slate-800">
                                    Konfirmasi Hapus
                                </h3>
                                <p className="mb-6 text-sm text-slate-500">
                                    {state.message}
                                </p>
                                <div className="flex w-full gap-3">
                                    <button
                                        onClick={close}
                                        className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 active:scale-95"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={confirm}
                                        className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-rose-200 transition-colors hover:bg-rose-600 active:scale-95"
                                    >
                                        Ya, Hapus
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-500"
                                >
                                    <CheckCircle weight="fill" className="h-10 w-10" />
                                </motion.div>
                                <h3 className="mb-2 text-lg font-bold text-slate-800">
                                    Berhasil!
                                </h3>
                                <p className="mb-6 text-sm text-slate-500">
                                    {state.message}
                                </p>
                                <button
                                    onClick={close}
                                    className="w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 active:scale-95"
                                >
                                    Tutup
                                </button>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
