"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Star,
    StarOff,
    Search,
    Loader2,
    X,
    ExternalLink
} from 'lucide-react';
import api from '@/lib/api';
import { Project } from '@/types';
import Link from 'next/link';
import ProjectForm from '@/components/dashboard/ProjectForm';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await api.get('/projects/', {
                params: { published_only: false, page_size: 100 }
            });
            setProjects(response.data.data.results || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/projects/${id}/`);
            setProjects(projects.filter(p => p.id !== id));
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
        }
    };

    const togglePublish = async (project: Project) => {
        try {
            const endpoint = project.is_published ? 'unpublish' : 'publish';
            await api.post(`/projects/${project.id}/${endpoint}/`);
            fetchProjects();
        } catch (error) {
            console.error('Error toggling publish:', error);
        }
    };

    const toggleFeature = async (project: Project) => {
        try {
            const endpoint = project.is_featured ? 'unfeature' : 'feature';
            await api.post(`/projects/${project.id}/${endpoint}/`);
            fetchProjects();
        } catch (error) {
            console.error('Error toggling feature:', error);
        }
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                    <p className="text-gray-400">Manage portfolio projects</p>
                </div>
                <button
                    onClick={() => {
                        setEditingProject(null);
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-white transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Project
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                />
            </div>

            {/* Projects Table */}
            <div className="glass-card border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Title</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Technologies</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Featured</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Views</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No projects found
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.map((project) => (
                                    <tr key={project.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-medium">{project.title}</p>
                                                <p className="text-sm text-gray-500 truncate max-w-md">
                                                    {project.description}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {project.technologies.slice(0, 3).map((tech, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 text-xs bg-neon-green/10 text-neon-green rounded"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.technologies.length > 3 && (
                                                    <span className="px-2 py-1 text-xs text-gray-500">
                                                        +{project.technologies.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => togglePublish(project)}
                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${project.is_published
                                                    ? 'bg-green-500/10 text-green-500'
                                                    : 'bg-gray-500/10 text-gray-500'
                                                    }`}
                                            >
                                                {project.is_published ? (
                                                    <>
                                                        <Eye className="w-3 h-3" />
                                                        Published
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="w-3 h-3" />
                                                        Draft
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => toggleFeature(project)}
                                                className="text-gray-400 hover:text-yellow-500 transition-colors"
                                            >
                                                {project.is_featured ? (
                                                    <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                                ) : (
                                                    <StarOff className="w-5 h-5" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-400">
                                            {project.view_count}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/projects/${project.project_slug}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                                    title="View"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setEditingProject(project);
                                                        setShowModal(true);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-neon-green transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(project.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
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
                                Are you sure you want to delete this project? This action cannot be undone.
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
                    <ProjectForm
                        project={editingProject}
                        onClose={() => {
                            setShowModal(false);
                            setEditingProject(null);
                        }}
                        onSuccess={fetchProjects}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
