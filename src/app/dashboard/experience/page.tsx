"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Loader2, X, Briefcase } from 'lucide-react';
import api from '@/lib/api';
import { Experience } from '@/types';
import ExperienceForm from '@/components/dashboard/ExperienceForm';

export default function ExperiencePage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            const response = await api.get('/experience/');
            // API returns data.results array
            const results = response.data.data?.results || [];
            setExperiences(Array.isArray(results) ? results : []);
        } catch (error) {
            console.error('Error fetching experiences:', error);
            setExperiences([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/experience/${id}/`);
            setExperiences(experiences.filter(e => e.id !== id));
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting experience:', error);
            alert('Failed to delete experience');
        }
    };

    const filteredExperiences = experiences.filter(exp =>
        exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.position.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h1 className="text-3xl font-bold text-white mb-2">Experience</h1>
                    <p className="text-gray-400">Manage work experiences</p>
                </div>
                <button
                    onClick={() => {
                        setEditingExperience(null);
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-white transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Experience
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search experiences..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                />
            </div>

            {/* Experience Cards */}
            <div className="space-y-4">
                {filteredExperiences.length === 0 ? (
                    <div className="glass-card p-12 border border-white/10 text-center">
                        <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-500">No experiences found</p>
                    </div>
                ) : (
                    filteredExperiences.map((exp) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 border border-white/10 hover:border-neon-green/30 transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white">{exp.position}</h3>
                                        {exp.is_current && (
                                            <span className="px-2 py-1 text-xs bg-neon-green/10 text-neon-green rounded-full border border-neon-green/20">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-neon-green font-medium mb-2">{exp.company}</p>
                                    {exp.location && (
                                        <p className="text-sm text-gray-400 mb-2">{exp.location}</p>
                                    )}
                                    <p className="text-sm text-gray-500 mb-4">{exp.duration}</p>
                                    <p className="text-gray-300 mb-4">{exp.description}</p>

                                    {exp.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {exp.technologies.map((tech, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 text-xs bg-white/5 text-gray-400 rounded"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {exp.achievements.length > 0 && (
                                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                                            {exp.achievements.map((achievement, idx) => (
                                                <li key={idx}>{achievement}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => {
                                            setEditingExperience(exp);
                                            setShowModal(true);
                                        }}
                                        className="p-2 text-gray-400 hover:text-neon-green transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(exp.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
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
                                Are you sure you want to delete this experience? This action cannot be undone.
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
                    <ExperienceForm
                        experience={editingExperience}
                        onClose={() => {
                            setShowModal(false);
                            setEditingExperience(null);
                        }}
                        onSuccess={fetchExperiences}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
