import toast from 'react-hot-toast';

export const confirmDelete = (message: string, onConfirm: () => void) => {
    toast(
        (t) => (
            <div className="flex min-w-[250px] flex-col gap-3 p-1">
                <span className="text-sm leading-relaxed font-semibold text-slate-800">
                    {message}
                </span>
                <div className="mt-1 flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="rounded-lg bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            onConfirm();
                        }}
                        className="rounded-lg bg-rose-500 px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-rose-200 transition-colors hover:bg-rose-600"
                    >
                        Ya, Hapus
                    </button>
                </div>
            </div>
        ),
        {
            duration: 10000,
            icon: '⚠️',
            style: {
                maxWidth: '400px',
                border: '1px solid #fce8e8',
                boxShadow:
                    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            },
        },
    );
};
