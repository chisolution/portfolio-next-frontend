"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Mail, MailOpen, Trash2, X, ExternalLink } from 'lucide-react';
import api from '@/lib/api';

interface ContactMessage {
    id: string;
    full_name: string;
    email: string;
    phone_number?: string;
    subject: string;
    message: string;
    organization?: string;
    preferred_contact_method?: string;
    status: 'new' | 'contacted' | 'closed';
    created_at: string;
    file_attached?: string;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await api.get('/contact/');
            // Handle both array and object responses
            const data = response.data.data || response.data;
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/contact/${id}/`);
            setMessages(messages.filter(m => m.id !== id));
            setDeleteConfirm(null);
            if (selectedMessage?.id === id) {
                setSelectedMessage(null);
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/contact/${id}/`, { status });
            setMessages(messages.map(m => m.id === id ? { ...m, status: status as any } : m));
            if (selectedMessage?.id === id) {
                setSelectedMessage({ ...selectedMessage, status: status as any });
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const filteredMessages = messages.filter(msg => {
        const matchesSearch =
            msg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.message.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'contacted': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'closed': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

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
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
                <p className="text-gray-400">Manage contact form submissions</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            {/* Messages List */}
            <div className="glass-card border border-white/10 overflow-hidden">
                {filteredMessages.length === 0 ? (
                    <div className="p-12 text-center">
                        <Mail className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-500">No messages found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/10">
                        {filteredMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => setSelectedMessage(msg)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            {msg.status === 'new' ? (
                                                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                            ) : (
                                                <MailOpen className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                            )}
                                            <h3 className="font-semibold text-white truncate">{msg.full_name}</h3>
                                            <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(msg.status)}`}>
                                                {msg.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-1">{msg.email}</p>
                                        <p className="text-sm font-medium text-gray-300 mb-1">{msg.subject}</p>
                                        <p className="text-sm text-gray-500 truncate">{msg.message}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            {new Date(msg.created_at).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteConfirm(msg.id);
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Message Detail Modal */}
            <AnimatePresence>
                {selectedMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedMessage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-card p-6 border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-white mb-2">{selectedMessage.subject}</h3>
                                    <p className="text-gray-400">From: {selectedMessage.full_name}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-3 mb-6 p-4 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">Email:</span>
                                    <a href={`mailto:${selectedMessage.email}`} className="text-sm text-neon-green hover:underline">
                                        {selectedMessage.email}
                                    </a>
                                </div>
                                {selectedMessage.phone_number && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">Phone:</span>
                                        <span className="text-sm text-white">{selectedMessage.phone_number}</span>
                                    </div>
                                )}
                                {selectedMessage.organization && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">Organization:</span>
                                        <span className="text-sm text-white">{selectedMessage.organization}</span>
                                    </div>
                                )}
                                {selectedMessage.preferred_contact_method && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">Preferred Contact:</span>
                                        <span className="text-sm text-white">{selectedMessage.preferred_contact_method}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">Received:</span>
                                    <span className="text-sm text-white">
                                        {new Date(selectedMessage.created_at).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-300 mb-2">Message:</h4>
                                <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>

                            {/* File Attachment */}
                            {selectedMessage.file_attached && (
                                <div className="mb-6 p-4 bg-white/5 rounded-lg">
                                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Attachment:</h4>
                                    <a
                                        href={selectedMessage.file_attached}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-neon-green hover:underline"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View Attachment
                                    </a>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-white/10">
                                <select
                                    value={selectedMessage.status}
                                    onChange={(e) => updateStatus(selectedMessage.id, e.target.value)}
                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="closed">Closed</option>
                                </select>
                                <button
                                    onClick={() => setDeleteConfirm(selectedMessage.id)}
                                    className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                Are you sure you want to delete this message? This action cannot be undone.
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
        </div>
    );
}
