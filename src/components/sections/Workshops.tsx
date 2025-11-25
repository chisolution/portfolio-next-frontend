"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ExternalLink, Calendar, MapPin, Clock } from 'lucide-react';
import axios from 'axios';
import { Workshop } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-django-backend.onrender.com';

export default function WorkshopsSection() {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/workshops/`);
                if (response.data && response.data.data && response.data.data.results) {
                    setWorkshops(response.data.data.results);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching workshops:', err);
                setError('Failed to load workshops');
                setLoading(false);
            }
        };

        fetchWorkshops();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-dark-lighter">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-12 text-center">
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-neon-green">
                            Workshops & <span className="text-white"> Training </span>
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
            <section className="py-20 bg-dark-lighter">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-12 text-center">
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-neon-green">
                            Workshops & <span className="text-white"> Training </span>
                        </span>
                    </h2>
                    <div className="text-center text-red-500">{error}</div>
                </div>
            </section>
        );
    }

    if (workshops.length === 0) {
        return null; // Don't show section if no workshops
    }

    return (
        <section className="py-20 bg-dark-lighter">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold mb-12 text-center">
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-neon-green">
                            Workshops & <span className="text-white"> Training </span>
                        </span>
                    </h2>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {workshops.map((workshop, index) => (
                            <motion.div
                                key={workshop.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className="glass-card p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                                    {/* Header */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                                            <GraduationCap className="w-6 h-6 text-primary" />
                                        </div>

                                        <div className="flex-1">
                                            {/* Title */}
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                {workshop.title}
                                            </h3>

                                            {/* Organizer */}
                                            <p className="text-gray-400 mb-3">{workshop.organizer}</p>

                                            {/* Meta Information */}
                                            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {new Date(workshop.date).toLocaleDateString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>

                                                {workshop.duration_hours && (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{workshop.duration_hours} hours</span>
                                                    </div>
                                                )}

                                                {workshop.location && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{workshop.location}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-300 mb-4 leading-relaxed">
                                                {workshop.description}
                                            </p>

                                            {/* Topics */}
                                            {workshop.topics && workshop.topics.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Topics Covered:</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {workshop.topics.map((topic, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full"
                                                            >
                                                                {topic}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Certificate Link */}
                                            {workshop.certificate_url && (
                                                <a
                                                    href={workshop.certificate_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
                                                >
                                                    <span>View Certificate</span>
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
