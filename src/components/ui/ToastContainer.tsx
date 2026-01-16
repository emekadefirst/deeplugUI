import { useToastStore } from '../../stores/toast-store';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const ToastContainer = () => {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md pointer-events-auto
                        transition-all duration-300 animate-in slide-in-from-right fade-in mr-4
                        ${toast.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' : ''}
                        ${toast.type === 'error' ? 'bg-red-50/95 border-red-200 text-red-800' : ''}
                        ${toast.type === 'info' ? 'bg-blue-50/95 border-blue-200 text-blue-800' : ''}
                    `}
                >
                    {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />}
                    {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
                    {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600 shrink-0" />}

                    <p className="text-sm font-medium pr-2">{toast.message}</p>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="p-1 hover:bg-black/5 rounded-full transition-colors shrink-0"
                    >
                        <X className="w-4 h-4 opacity-50" />
                    </button>
                </div>
            ))}
        </div>
    );
};
