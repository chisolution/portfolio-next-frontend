"use client";

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { Certification } from '@/types';

interface CertificationFormProps {
    certification?: Certification | null;
    onClose: () => void;
    onSuccess: () => void;
}

// Helper to format date for HTML date input (YYYY-MM-DD)
const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
};

export default function CertificationForm({ certification, onClose, onSuccess }: CertificationFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: certification?.name || '',
        issuing_organization: certification?.issuing_organization || '',
        issue_date: formatDateForInput(certification?.issue_date),
        expiry_date: formatDateForInput(certification?.expiry_date),
        credential_id: certification?.credential_id || '',
        credential_url: certification?.credential_url || '',
        description: certification?.description || '',
        skills: certification?.skills || [],
        display_order: certification?.display_order || 0,
        is_published: (certification as any)?.is_published ?? false,
    });
    const [skillInput, setSkillInput] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()]
            }));
            setSkillInput('');
        }
    };

    const removeSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (certification) {
                await api.patch(`/certifications/${certification.id}/`, formData);
            } else {
                await api.post('/certifications/', formData);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error saving certification:', err);
            const errorMsg = err.response?.data?.data?.errors
                ? Object.values(err.response.data.data.errors).flat().join(', ')
                : err.response?.data?.message || 'Failed to save certification';
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
                        {certification ? 'Edit Certification' : 'Add Certification'}
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
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Certification Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            placeholder="AWS Certified Solutions Architect"
                        />
                    </div>

                    {/* Issuing Organization */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Issuing Organization <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="issuing_organization"
                            value={formData.issuing_organization}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            placeholder="Amazon Web Services"
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Issue Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="issue_date"
                                value={formData.issue_date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Expiry Date
                            </label>
                            <input
                                type="date"
                                name="expiry_date"
                                value={formData.expiry_date}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            />
                        </div>
                    </div>

                    {/* Credential ID & URL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Credential ID
                            </label>
                            <input
                                type="text"
                                name="credential_id"
                                value={formData.credential_id}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                placeholder="ABC123XYZ"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Credential URL
                            </label>
                            <input
                                type="url"
                                name="credential_url"
                                value={formData.credential_url}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 resize-none"
                            placeholder="Brief description of the certification"
                        />
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Skills
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                placeholder="Add skill"
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                className="px-4 py-2 bg-neon-green/10 border border-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/20 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-neon-green/10 text-neon-green rounded-lg text-sm"
                                >
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
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
                                certification ? 'Update Certification' : 'Add Certification'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
