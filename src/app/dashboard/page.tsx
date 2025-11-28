"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Briefcase, Award, GraduationCap, Mail, TrendingUp, Loader2, Clock } from 'lucide-react';
import api from '@/lib/api';

interface Stats {
    projects: number;
    experiences: number;
    certifications: number;
    workshops: number;
    messages: number;
    totalViews: number;
}

interface RecentActivity {
    type: 'project' | 'experience' | 'certification' | 'message';
    id: string;
    title: string;
    description: string;
    timestamp: string;
    data: any;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats>({
        projects: 0,
        experiences: 0,
        certifications: 0,
        workshops: 0,
        messages: 0,
        totalViews: 0,
    });
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // Fetch all stats in parallel
            const [projectsRes, experiencesRes, certificationsRes, workshopsRes, messagesRes, activitiesRes] = await Promise.all([
                api.get('/projects/', { params: { published_only: false, page_size: 1 } }).catch(() => ({ data: { data: { count: 0 } } })),
                api.get('/experience/').catch(() => ({ data: { data: { count: 0 } } })),
                api.get('/certifications/').catch(() => ({ data: { data: { count: 0 } } })),
                api.get('/workshops/').catch(() => ({ data: { data: { count: 0 } } })),
                api.get('/contact/').catch(() => ({ data: { data: { length: 0 } } })),
                api.get('/core/recent-activities/').catch(() => ({ data: { data: { results: [] } } })),
            ]);

            // Calculate total views from projects
            const projectsData = projectsRes.data.data?.results || [];
            const totalViews = Array.isArray(projectsData)
                ? projectsData.reduce((sum: number, p: any) => sum + (p.view_count || 0), 0)
                : 0;

            setStats({
                projects: projectsRes.data.data?.count || 0,
                experiences: experiencesRes.data.data?.count || 0,
                certifications: certificationsRes.data.data?.count || 0,
                workshops: workshopsRes.data.data?.count || 0,
                messages: Array.isArray(messagesRes.data.data) ? messagesRes.data.data.length : (messagesRes.data.data?.length || 0),
                totalViews,
            });

            setRecentActivities(activitiesRes.data.data?.results || []);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statsData = [
        { name: 'Total Projects', value: stats.projects.toString(), icon: FolderKanban, color: 'text-blue-500' },
        { name: 'Experiences', value: stats.experiences.toString(), icon: Briefcase, color: 'text-green-500' },
        { name: 'Certifications', value: stats.certifications.toString(), icon: Award, color: 'text-yellow-500' },
        { name: 'Workshops', value: stats.workshops.toString(), icon: GraduationCap, color: 'text-purple-500' },
        { name: 'Messages', value: stats.messages.toString(), icon: Mail, color: 'text-pink-500' },
        { name: 'Total Views', value: stats.totalViews.toString(), icon: TrendingUp, color: 'text-neon-green' },
    ];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'project': return FolderKanban;
            case 'experience': return Briefcase;
            case 'certification': return Award;
            case 'message': return Mail;
            default: return Clock;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'project': return 'text-blue-500 bg-blue-500/10';
            case 'experience': return 'text-green-500 bg-green-500/10';
            case 'certification': return 'text-yellow-500 bg-yellow-500/10';
            case 'message': return 'text-pink-500 bg-pink-500/10';
            default: return 'text-gray-500 bg-gray-500/10';
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
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-gray-400">Manage portfolio content and track engagement</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statsData.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6 border border-white/10 hover:border-neon-green/30 transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">{stat.name}</p>
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                            </div>
                            <div className={`p-3 bg-white/5 rounded-lg ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        onClick={() => window.location.href = '/dashboard/projects'}
                        className="px-4 py-3 bg-neon-green/10 border border-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/20 transition-all"
                    >
                        Add Project
                    </button>
                    <button
                        onClick={() => window.location.href = '/dashboard/experience'}
                        className="px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all"
                    >
                        Add Experience
                    </button>
                    <button
                        onClick={() => window.location.href = '/dashboard/certifications'}
                        className="px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all"
                    >
                        Add Certification
                    </button>
                    <button
                        onClick={() => window.location.href = '/dashboard/messages'}
                        className="px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all"
                    >
                        View Messages
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                {recentActivities.length > 0 ? (
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => {
                            const Icon = getActivityIcon(activity.type);
                            const colorClass = getActivityColor(activity.type);

                            return (
                                <motion.div
                                    key={`${activity.type}-${activity.id}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all"
                                >
                                    <div className={`p-2 rounded-lg ${colorClass}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-medium text-white">{activity.title}</h3>
                                            <span className="text-xs text-gray-500">
                                                {new Date(activity.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400">{activity.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>No recent activity to display</p>
                    </div>
                )}
            </div>
        </div>
    );
}
