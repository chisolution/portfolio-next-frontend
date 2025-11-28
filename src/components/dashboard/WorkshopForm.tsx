"use client";

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { Workshop } from '@/types';

interface WorkshopFormProps {
    workshop?: Workshop | null;
    onClose: () => void;
    onSuccess: () => void;
}

// Helper to format date for HTML date input (YYYY-MM-DD)
const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
};

export default function WorkshopForm({ workshop, onClose, onSuccess }: WorkshopFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: workshop?.title || '',
        organizer: workshop?.organizer || '',
        date: formatDateForInput(workshop?.date),
        duration_hours: workshop?.duration_hours || 0,
        location: workshop?.location || '',
        description: workshop?.description || '',
        topics: workshop?.topics || [],
        certificate_url: workshop?.certificate_url || '',
        display_order: workshop?.display_order || 0,
        is_published: (workshop as any)?.is_published ?? false,
    });
    const [topicInput, setTopicInput] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addTopic = () => {
        if (topicInput.trim() && !formData.topics.includes(topicInput.trim())) {
            setFormData(prev => ({
                ...prev,
                topics: [...prev.topics, topicInput.trim()]
            }));
            setTopicInput('');
        }
    };

    const removeTopic = (topic: string) => {
        setFormData(prev => ({
            ...prev,
            topics: prev.topics.filter(t => t !== topic)
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (workshop) {
                await api.patch(`/workshops/${workshop.id}/`, formData);
            } else {
                await api.post('/workshops/', formData);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error saving workshop:', err);
            const errorMsg = err.response?.data?.data?.errors
                ? Object.values(err.response.data.data.errors).flat().join(', ')
                : err.response?.data?.message || 'Failed to save workshop';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card p-4 sm:p-6 border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">
                        {workshop ? 'Edit Workshop' : 'Add Workshop'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Workshop Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            placeholder="Advanced React Patterns"
                        />
                    </div>

                    {/* Organizer */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Organizer <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="organizer"
                            value={formData.organizer}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            placeholder="Tech Academy"
                        />
                    </div>

                    {/* Date & Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Duration (hours)
                            </label>
                            <input
                                type="number"
                                name="duration_hours"
                                value={formData.duration_hours}
                                onChange={handleChange}
                                min="0"
                                step="0.5"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                placeholder="8"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            placeholder="Online / City, Country"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 resize-none"
                            placeholder="What did you learn in this workshop?"
                        />
                    </div>

                    {/* Topics */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Topics Covered
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={topicInput}
                                onChange={(e) => setTopicInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                placeholder="Add topic"
                            />
                            <button
                                type="button"
                                onClick={addTopic}
                                className="px-4 py-2 bg-neon-green/10 border border-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/20 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.topics.map((topic, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-neon-green/10 text-neon-green rounded-lg text-sm"
                                >
                                    {topic}
                                    <button
                                        type="button"
                                        onClick={() => removeTopic(topic)}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Certificate URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Certificate URL
                        </label>
                        <input
                            type="url"
                            name="certificate_url"
                            value={formData.certificate_url}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            placeholder="https://..."
                        />
                    </div>

                    {/* Published Checkbox */}
                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_published"
                                checked={formData.is_published}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-white/10 bg-white/5 text-neon-green focus:ring-neon-green/50"
                            />
                            <span className="text-sm text-gray-300">Published</span>
                        </label>
                    </div>

                    {/* Display Order */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Display Order
                        </label>
                        <input
                            type="number"
                            name="display_order"
                            value={formData.display_order}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            placeholder="0"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-white transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                workshop ? 'Update Workshop' : 'Add Workshop'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
