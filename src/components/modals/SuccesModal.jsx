import React, { useEffect } from 'react';
import { XCircle, X } from 'phosphor-react';

const SuccesModal = ({ lang, message, onClose, duration = 5000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    if (!message) return null;

    return (
        <div className="fixed top-25 right-5 z-[100] animate-fade-in-left">
            <div className="bg-[#27374D] border-l-4 border-green-500 text-white p-4 rounded-lg shadow-2xl flex items-center space-x-4 min-w-[300px] max-w-[450px]">
                <XCircle
                    size={32}
                    className="text-green-500 shrink-0"
                    weight="fill"
                />
                <div className="flex-grow">
                    <p className="font-bold text-green-400">
                        {lang === 'hu'
                            ? 'Sikeres művelet!'
                            : 'Successful operation!'}
                    </p>
                    <p className="text-sm text-gray-200">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="hover:bg-white/10 p-1 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default SuccesModal;
