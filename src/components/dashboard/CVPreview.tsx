import { useState, useEffect } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface CVPreviewProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CVPreview({ isOpen, onClose }: CVPreviewProps) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchCV();
        } else {
            // Cleanup URL object when modal closes
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
                setPdfUrl(null);
            }
        }
    }, [isOpen]);

    const fetchCV = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/cv/download/', {
                responseType: 'blob'
            });

            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            setPdfUrl(url);
        } catch (err) {
            console.error('Error fetching CV:', err);
            setError('Failed to load CV preview. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'cv.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-5xl h-[85vh] bg-[#1a1f2e] rounded-xl border border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">CV Preview</h2>
                            <div className="flex items-center gap-2">
                                {pdfUrl && (
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-neon-green/10 border border-neon-green/20 rounded-lg hover:bg-neon-green/20 transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download PDF
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-white/5 relative overflow-hidden">
                            {loading ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-neon-green" />
                                </div>
                            ) : error ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                    <p className="text-red-400 mb-4">{error}</p>
                                    <button
                                        onClick={fetchCV}
                                        className="px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : pdfUrl ? (
                                <iframe
                                    src={pdfUrl}
                                    className="w-full h-full border-0"
                                    title="CV Preview"
                                />
                            ) : null}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
