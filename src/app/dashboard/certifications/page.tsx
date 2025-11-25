"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Loader2, X, Award, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import { Certification } from '@/types';
import CertificationForm from '@/components/dashboard/CertificationForm';

export default function CertificationsPage() {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCert, setEditingCert] = useState<Certification | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchCertifications();
    }, []);

    const fetchCertifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/certifications/');
            // API returns data.results array
            const results = response.data.data?.results || [];
            setCertifications(Array.isArray(results) ? results : []);
        } catch (error) {
            console.error('Error fetching certifications:', error);
            setCertifications([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/certifications/${id}/`);
            setCertifications(certifications.filter(c => c.id !== id));
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting certification:', error);
            alert('Failed to delete certification');
        }
    };

    const filteredCertifications = certifications.filter(cert =>
        cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.issuing_organization.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h1 className="text-3xl font-bold text-white mb-2">Certifications</h1>
                    <p className="text-gray-400">Manage certifications</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCert(null);
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-white transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Certification
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search certifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                />
            </div>

            {/* Certifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCertifications.length === 0 ? (
                    <div className="col-span-full glass-card p-12 border border-white/10 text-center">
                        <Award className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-500">No certifications found</p>
                    </div>
                ) : (
                    filteredCertifications.map((cert) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 border border-white/10 hover:border-neon-green/30 transition-all"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2">{cert.name}</h3>
                                    <p className="text-neon-green font-medium mb-2">{cert.issuing_organization}</p>
                                    <p className="text-sm text-gray-400 mb-2">
                                        Issued: {new Date(cert.issue_date).toLocaleDateString()}
                                    </p>
                                    {cert.expiry_date && (
                                        <p className={`text-sm mb-2 ${cert.is_expired ? 'text-red-500' : 'text-gray-400'}`}>
                                            Expires: {new Date(cert.expiry_date).toLocaleDateString()}
                                            {cert.is_expired && ' (Expired)'}
                                        </p>
                                    )}
                                    {cert.credential_id && (
                                        <p className="text-xs text-gray-500 mb-2">ID: {cert.credential_id}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {cert.credential_url && (
                                        <a
                                            href={cert.credential_url}
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
                                            setEditingCert(cert);
                                            setShowModal(true);
                                        }}
                                        className="p-2 text-gray-400 hover:text-neon-green transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(cert.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {cert.description && (
                                <p className="text-sm text-gray-300 mb-3">{cert.description}</p>
                            )}

                            {cert.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {cert.skills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 text-xs bg-white/5 text-gray-400 rounded"
                                        >
                                            {skill}
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
                                Are you sure you want to delete this certification?
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
                    <CertificationForm
                        certification={editingCert}
                        onClose={() => {
                            setShowModal(false);
                            setEditingCert(null);
                        }}
                        onSuccess={fetchCertifications}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
