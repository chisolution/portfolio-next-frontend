"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Save, User as UserIcon, Plus, Trash2, FileText } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import CVPreview from '@/components/dashboard/CVPreview';

interface ProfileData {
    id?: string;
    full_name: string;
    title: string;
    email: string;
    phone_number: string;
    location: string;
    linkedin_url: string;
    github_url: string;
    portfolio_url: string;
    summary: string;
    skills: string[];
}

export default function ProfilePage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [showCVPreview, setShowCVPreview] = useState(false);
    const [formData, setFormData] = useState<ProfileData>({
        full_name: '',
        title: '',
        email: '',
        phone_number: '',
        location: '',
        linkedin_url: '',
        github_url: '',
        portfolio_url: '',
        summary: '',
        skills: [],
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            // Try to get existing profile
            const response = await api.get('/profile/');
            if (response.data.data) {
                setFormData(response.data.data);
            }
        } catch (error: any) {
            // Profile doesn't exist yet, that's okay
            if (error.response?.status !== 404) {
                console.error('Error fetching profile:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            if (formData.id) {
                // Update existing profile
                await api.patch(`/profile/${formData.id}/`, formData);
            } else {
                // Create new profile
                const response = await api.post('/profile/', formData);
                setFormData(response.data.data);
            }
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            console.error('Error saving profile:', err);
            const errorMsg = err.response?.data?.data?.errors
                ? Object.values(err.response.data.data.errors).flat().join(', ')
                : err.response?.data?.message || 'Failed to save profile';
            setError(errorMsg);
        } finally {
            setSaving(false);
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
                    <p className="text-gray-400">Manage professional profile information</p>
                </div>
                <button
                    onClick={() => setShowCVPreview(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all"
                >
                    <FileText className="w-4 h-4" />
                    Preview CV
                </button>
            </div>

            {/* Messages */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                    {success}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="glass-card p-6 border border-white/10 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Professional Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            placeholder="Full Stack Developer"
                        />
                    </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            placeholder="+1 234 567 8900"
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

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            LinkedIn URL
                        </label>
                        <input
                            type="url"
                            name="linkedin_url"
                            value={formData.linkedin_url}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            placeholder="https://linkedin.com/in/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            GitHub URL
                        </label>
                        <input
                            type="url"
                            name="github_url"
                            value={formData.github_url}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            placeholder="https://github.com/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Portfolio URL
                        </label>
                        <input
                            type="url"
                            name="portfolio_url"
                            value={formData.portfolio_url}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {/* Summary */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Professional Summary <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 resize-none"
                        placeholder="Brief professional summary..."
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

                {/* Submit */}
                <div className="flex justify-end pt-4 border-t border-white/10">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-white transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Profile
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* CV Preview Modal */}
            <CVPreview isOpen={showCVPreview} onClose={() => setShowCVPreview(false)} />
        </div>
    );
}
