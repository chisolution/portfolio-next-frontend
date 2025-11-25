"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Loader2, X, GraduationCap, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import { Workshop } from '@/types';
import WorkshopForm from '@/components/dashboard/WorkshopForm';

export default function WorkshopsPage() {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const fetchWorkshops = async () => {
        try {
            setLoading(true);
            const response = await api.get('/workshops/');
            // API returns data.results array
            const results = response.data.data?.results || [];
            setWorkshops(Array.isArray(results) ? results : []);
        } catch (error) {
            console.error('Error fetching workshops:', error);
            setWorkshops([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/workshops/${id}/`);
            setWorkshops(workshops.filter(w => w.id !== id));
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting workshop:', error);
            alert('Failed to delete workshop');
        }
    };

    const filteredWorkshops = workshops.filter(workshop =>
        workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-neon-green" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Workshops</h1>
                    <p className="text-gray-400">Manage workshops and training</p>
                </div>
                <button
                    onClick={() => {
                        setEditingWorkshop(null);
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-white transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Workshop
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search workshops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                />
            </div>

            {/* Workshops Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredWorkshops.length === 0 ? (
                    <div className="col-span-full glass-card p-12 border border-white/10 text-center">
                        <GraduationCap className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-500">No workshops found</p>
                    </div>
                ) : (
                    filteredWorkshops.map((workshop) => (
                        <motion.div
                            key={workshop.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 border border-white/10 hover:border-neon-green/30 transition-all"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2">{workshop.title}</h3>
                                    <p className="text-neon-green font-medium mb-2">{workshop.organizer}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                                        <span>{new Date(workshop.date).toLocaleDateString()}</span>
                                        {workshop.duration_hours && (
                                            <span>{workshop.duration_hours} hours</span>
                                        )}
                                    </div>
                                    {workshop.location && (
                                        <p className="text-sm text-gray-400 mb-2">{workshop.location}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {workshop.certificate_url && (
                                        <a
                                            href={workshop.certificate_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-400 hover:text-white transition-colors"
                                            title="View Certificate"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                    <button
                                        onClick={() => {
                                            setEditingWorkshop(workshop);
                                            setShowModal(true);
                                        }}
                                        className="p-2 text-gray-400 hover:text-neon-green transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(workshop.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm text-gray-300 mb-3">{workshop.description}</p>

                            {workshop.topics.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {workshop.topics.map((topic, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 text-xs bg-white/5 text-gray-400 rounded"
                                        >
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-card p-6 border border-white/10 max-w-md w-full"
                        >
                            <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
                            <p className="text-gray-400 mb-6">
                                Are you sure you want to delete this workshop?
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <WorkshopForm
                        workshop={editingWorkshop}
                        onClose={() => {
                            setShowModal(false);
                            setEditingWorkshop(null);
                        }}
                        onSuccess={fetchWorkshops}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
