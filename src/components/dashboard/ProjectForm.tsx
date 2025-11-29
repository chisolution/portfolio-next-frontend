"use client";

import { useState, FormEvent, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Plus, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import api from '@/lib/api';
import { Project } from '@/types';
import { generateSlug, validateImageFile, fileToBase64 } from '@/lib/fileUpload';

interface ProjectFormProps {
    project?: Project | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ProjectForm({ project, onClose, onSuccess }: ProjectFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: project?.title || '',
        description: project?.description || '',
        problem: project?.problem || '',
        process: project?.process || '',
        impact: project?.impact || '',
        results: project?.results || '',
        project_slug: project?.project_slug || '',
        technologies: project?.technologies || [],
        live_demo_url: project?.live_demo_url || '',
        github_url: project?.github_url || '',
        project_image: project?.project_image || '',
        gallery_images: project?.gallery_images || [],
        display_order: project?.display_order || 0,
        is_published: project?.is_published || false,
        is_featured: project?.is_featured || false,
    });
    const [techInput, setTechInput] = useState('');
    const [galleryInput, setGalleryInput] = useState('');
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!project?.project_slug);
    const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
    const [projectImagePreview, setProjectImagePreview] = useState<string>(project?.project_image || '');
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>(project?.gallery_images || []);
    const projectImageInputRef = useRef<HTMLInputElement>(null);
    const galleryImageInputRef = useRef<HTMLInputElement>(null);

    // Auto-generate slug from title
    useEffect(() => {
        if (!slugManuallyEdited && formData.title) {
            const newSlug = generateSlug(formData.title);
            setFormData(prev => ({ ...prev, project_slug: newSlug }));
        }
    }, [formData.title, slugManuallyEdited]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        // Track if slug is manually edited
        if (name === 'project_slug') {
            setSlugManuallyEdited(true);
        }

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

    const addGalleryImage = () => {
        if (galleryInput.trim() && !formData.gallery_images.includes(galleryInput.trim())) {
            setFormData(prev => ({
                ...prev,
                gallery_images: [...prev.gallery_images, galleryInput.trim()]
            }));
            setGalleryInput('');
        }
    };

    const removeGalleryImage = (url: string) => {
        setFormData(prev => ({
            ...prev,
            gallery_images: prev.gallery_images.filter(img => img !== url)
        }));
    };

    // Handle project image file upload
    const handleProjectImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateImageFile(file);
        if (!validation.valid) {
            setError(validation.error || 'Invalid file');
            return;
        }

        setProjectImageFile(file);
        const preview = await fileToBase64(file);
        setProjectImagePreview(preview);
        setError('');
    };

    // Handle gallery image file upload
    const handleGalleryImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const validFiles: File[] = [];
        const newPreviews: string[] = [];

        for (const file of files) {
            const validation = validateImageFile(file);
            if (validation.valid) {
                validFiles.push(file);
                const preview = await fileToBase64(file);
                newPreviews.push(preview);
            } else {
                setError(validation.error || 'Invalid file');
                return;
            }
        }

        setGalleryFiles(prev => [...prev, ...validFiles]);
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
        setError('');

        // Reset input
        if (galleryImageInputRef.current) {
            galleryImageInputRef.current.value = '';
        }
    };

    // Remove gallery image by index
    const removeGalleryImageByIndex = (index: number) => {
        // Check if this is a new file or existing URL
        if (index < galleryFiles.length) {
            // Remove from new files
            setGalleryFiles(prev => prev.filter((_, i) => i !== index));
            setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
        } else {
            // Remove from existing gallery images
            const existingIndex = index - galleryFiles.length;
            setFormData(prev => ({
                ...prev,
                gallery_images: prev.gallery_images.filter((_, i) => i !== existingIndex)
            }));
            setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Create FormData for file upload
            const submitData = new FormData();

            // Add text fields
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('problem', formData.problem);
            submitData.append('process', formData.process);
            submitData.append('impact', formData.impact);
            submitData.append('results', formData.results);
            submitData.append('project_slug', formData.project_slug);
            submitData.append('live_demo_url', formData.live_demo_url);
            submitData.append('github_url', formData.github_url);
            submitData.append('display_order', formData.display_order.toString());
            submitData.append('is_published', formData.is_published.toString());
            submitData.append('is_featured', formData.is_featured.toString());

            // Add technologies as JSON array
            submitData.append('technologies', JSON.stringify(formData.technologies));

            // Add project image file if selected
            if (projectImageFile) {
                submitData.append('project_image', projectImageFile);
            } else if (formData.project_image && !projectImageFile) {
                // Keep existing image URL if no new file selected
                submitData.append('project_image', formData.project_image);
            }

            // Add gallery image files
            if (galleryFiles.length > 0) {
                galleryFiles.forEach((file, index) => {
                    submitData.append(`gallery_image_files`, file);
                });
            }
            // Note: Existing gallery images are preserved automatically by the backend


            if (project) {
                // Update existing project
                await api.patch(`/projects/${project.id}/`, submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                // Create new project
                await api.post('/projects/', submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error saving project:', err);
            const errorMsg = err.response?.data?.data?.errors
                ? Object.values(err.response.data.data.errors).flat().join(', ')
                : err.response?.data?.message || 'Failed to save project';
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
                        {project ? 'Edit Project' : 'Create Project'}
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
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            placeholder="Project title"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Slug
                        </label>
                        <input
                            type="text"
                            name="project_slug"
                            value={formData.project_slug}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            placeholder="project-slug"
                        />
                        <p className="mt-1 text-xs text-gray-500">URL-friendly version of the title</p>
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
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 resize-none"
                            placeholder="Brief project description"
                        />
                    </div>

                    {/* Problem */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Problem <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="problem"
                            value={formData.problem}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 resize-none"
                            placeholder="What problem does this project solve?"
                        />
                    </div>

                    {/* Process */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Process <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="process"
                            value={formData.process}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 resize-none"
                            placeholder="How did you build it?"
                        />
                    </div>

                    {/* Impact */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Impact <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="impact"
                            value={formData.impact}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 resize-none"
                            placeholder="What impact did it have?"
                        />
                    </div>

                    {/* Results */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Results <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="results"
                            value={formData.results}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 resize-none"
                            placeholder="What were the results?"
                        />
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

                    {/* Project Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Project Image
                        </label>
                        <div className="space-y-3">
                            <input
                                ref={projectImageInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleProjectImageChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => projectImageInputRef.current?.click()}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:bg-white/10 hover:border-neon-green/30 transition-all flex items-center justify-center gap-2"
                            >
                                <Upload className="w-5 h-5" />
                                <span>Choose Project Image</span>
                            </button>
                            {projectImagePreview && (
                                <div className="relative group">
                                    <img
                                        src={projectImagePreview}
                                        alt="Project preview"
                                        className="w-full h-48 object-cover rounded-lg border border-white/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProjectImageFile(null);
                                            setProjectImagePreview('');
                                            setFormData(prev => ({ ...prev, project_image: '' }));
                                            if (projectImageInputRef.current) {
                                                projectImageInputRef.current.value = '';
                                            }
                                        }}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Gallery Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Gallery Images
                        </label>
                        <div className="space-y-3">
                            <input
                                ref={galleryImageInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryImageChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => galleryImageInputRef.current?.click()}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:bg-white/10 hover:border-neon-green/30 transition-all flex items-center justify-center gap-2"
                            >
                                <ImageIcon className="w-5 h-5" />
                                <span>Add Gallery Images</span>
                            </button>
                            {galleryPreviews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {galleryPreviews.map((preview, idx) => (
                                        <div key={idx} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Gallery ${idx + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border border-white/10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImageByIndex(idx)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* URLs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Live Demo URL
                            </label>
                            <input
                                type="url"
                                name="live_demo_url"
                                value={formData.live_demo_url}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                placeholder="https://demo.example.com"
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

                    {/* Checkboxes */}
                    <div className="flex gap-6">
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
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-white/10 bg-white/5 text-neon-green focus:ring-neon-green/50"
                            />
                            <span className="text-sm text-gray-300">Featured</span>
                        </label>
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
                                project ? 'Update Project' : 'Create Project'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
