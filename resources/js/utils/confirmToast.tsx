import toast from 'react-hot-toast';

export const confirmDelete = (message: string, onConfirm: () => void) => {
    toast((t) => (
        <div className="flex flex-col gap-3 p-1 min-w-[250px]">
            <span className="text-sm font-semibold text-slate-800 leading-relaxed">{message}</span>
            <div className="flex justify-end gap-2 mt-1">
                <button 
                    onClick={() => toast.dismiss(t.id)} 
                    className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                >
                    Batal
                </button>
                <button 
                    onClick={() => {
                        toast.dismiss(t.id);
                        onConfirm();
                    }} 
                    className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-colors shadow-sm shadow-rose-200"
                >
                    Ya, Hapus
                </button>
            </div>
        </div>
    ), { 
        duration: 10000, 
        icon: '⚠️',
        style: { 
            maxWidth: '400px',
            border: '1px solid #fce8e8',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
        } 
    });
};
