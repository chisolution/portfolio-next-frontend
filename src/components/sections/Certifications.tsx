"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, Building2 } from 'lucide-react';
import axios from 'axios';
import { Certification } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-django-backend.onrender.com';

export default function CertificationsSection() {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCertifications = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/certifications/`);
                if (response.data && response.data.data && response.data.data.results) {
                    setCertifications(response.data.data.results);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching certifications:', err);
                setError('Failed to load certifications');
                setLoading(false);
            }
        };

        fetchCertifications();
    }, []);

    if (loading) {
        return (
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-12 text-center">
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-neon-green">
                            Certifications
                        </span>
                    </h2>
                    <div className="flex justify-center items-center min-h-[200px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-12 text-center">
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-neon-green">
                            Certifications
                        </span>
                    </h2>
                    <div className="text-center text-red-500">{error}</div>
                </div>
            </section>
        );
    }

    if (certifications.length === 0) {
        return null; // Don't show section if no certifications
    }

    return (
        <section className="py-20">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold mb-12 text-center">
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-neon-green">
                            Certifications
                        </span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certifications.map((cert, index) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className="glass-card p-6 h-full hover:shadow-xl transition-all duration-300 hover:scale-105">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-primary/10 rounded-lg">
                                            <Award className="w-6 h-6 text-primary" />
                                        </div>
                                        {cert.is_expired && (
                                            <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full">
                                                Expired
                                            </span>
                                        )}
                                    </div>

                                    {/* Certification Name */}
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {cert.name}
                                    </h3>

                                    {/* Issuing Organization */}
                                    <div className="flex items-center gap-2 mb-3 text-gray-400">
                                        <Building2 className="w-4 h-4" />
                                        <span className="text-sm">{cert.issuing_organization}</span>
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-center gap-2 mb-4 text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm">
                                            {new Date(cert.issue_date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                            {cert.expiry_date && (
                                                <> - {new Date(cert.expiry_date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}</>
                                            )}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    {cert.description && (
                                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                                            {cert.description}
                                        </p>
                                    )}

                                    {/* Skills */}
                                    {cert.skills && cert.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {cert.skills.slice(0, 3).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {cert.skills.length > 3 && (
                                                <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                                                    +{cert.skills.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Credential Link */}
                                    {cert.credential_url && (
                                        <a
                                            href={cert.credential_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm mt-auto"
                                        >
                                            <span>View Credential</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}

                                    {/* Credential ID */}
                                    {cert.credential_id && !cert.credential_url && (
                                        <div className="text-xs text-gray-500 mt-2">
                                            ID: {cert.credential_id}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
