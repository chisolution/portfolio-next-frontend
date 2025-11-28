"use client";

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { Experience } from '@/types';

interface ExperienceFormProps {
    experience?: Experience | null;
    onClose: () => void;
    onSuccess: () => void;
}

// Helper to format date for HTML date input (YYYY-MM-DD)
const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
};

export default function ExperienceForm({ experience, onClose, onSuccess }: ExperienceFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        company: experience?.company || '',
        position: experience?.position || '',
        location: experience?.location || '',
        start_date: formatDateForInput(experience?.start_date),
        end_date: formatDateForInput(experience?.end_date),
        description: experience?.description || '',
        technologies: experience?.technologies || [],
        achievements: experience?.achievements || [],
        is_current: experience?.is_current || false,
        display_order: experience?.display_order || 0,
        is_published: (experience as any)?.is_published ?? false,
    });
    const [techInput, setTechInput] = useState('');
    const [achievementInput, setAchievementInput] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addTechnology = () => {
        if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
            setFormData(prev => ({
                ...prev,
                technologies: [...prev.technologies, techInput.trim()]
            }));
            setTechInput('');
        }
    };

    const removeTechnology = (tech: string) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies.filter(t => t !== tech)
        }));
    };

    const addAchievement = () => {
        if (achievementInput.trim()) {
            setFormData(prev => ({
                ...prev,
                achievements: [...prev.achievements, achievementInput.trim()]
            }));
            setAchievementInput('');
        }
    };

    const removeAchievement = (index: number) => {
        setFormData(prev => ({
            ...prev,
            achievements: prev.achievements.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (experience) {
                await api.patch(`/experience/${experience.id}/`, formData);
            } else {
                await api.post('/experience/', formData);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error saving experience:', err);
            const errorMsg = err.response?.data?.data?.errors
                ? Object.values(err.response.data.data.errors).flat().join(', ')
                : err.response?.data?.message || 'Failed to save experience';
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
                        {experience ? 'Edit Experience' : 'Add Experience'}
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
                    {/* Company & Position */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Company <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                placeholder="Company name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Position <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                placeholder="Job title"
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
                            placeholder="City, Country"
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                disabled={formData.is_current}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50 disabled:opacity-50"
                            />
                        </div>
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
                            placeholder="Describe role and responsibilities"
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_current"
                                checked={formData.is_current}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-white/10 bg-white/5 text-neon-green focus:ring-neon-green/50"
                            />
                            <span className="text-sm text-gray-300">Current Position</span>
                        </label>
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

                    {/* Technologies */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Technologies
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                placeholder="Add technology"
                            />
                            <button
                                type="button"
                                onClick={addTechnology}
                                className="px-4 py-2 bg-neon-green/10 border border-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/20 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.technologies.map((tech, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-neon-green/10 text-neon-green rounded-lg text-sm"
                                >
                                    {tech}
                                    <button
                                        type="button"
                                        onClick={() => removeTechnology(tech)}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Achievements */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Key Achievements
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={achievementInput}
                                onChange={(e) => setAchievementInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                placeholder="Add achievement"
                            />
                            <button
                                type="button"
                                onClick={addAchievement}
                                className="px-4 py-2 bg-neon-green/10 border border-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/20 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.achievements.map((achievement, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-2 p-3 bg-white/5 rounded-lg"
                                >
                                    <span className="flex-1 text-sm text-gray-300">{achievement}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeAchievement(idx)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
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
                                experience ? 'Update Experience' : 'Add Experience'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
