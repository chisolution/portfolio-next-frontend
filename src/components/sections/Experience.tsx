"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, Code, Award } from "lucide-react";
import api from "@/lib/api";
import { Experience } from "@/types";

export default function ExperienceSection() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await api.get("/experience/");
                const data = response.data?.data?.results || response.data?.results || [];
                setExperiences(data);
            } catch (error) {
                console.error("Error fetching experiences:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-white/10 rounded w-1/4 mx-auto"></div>
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-64 bg-white/5 rounded-2xl border border-white/10"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (experiences.length === 0) {
        return null; // Don't show section if no experiences
    }

    return (
        <section id="experience" className="py-24 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-deep-green/5 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4 font-sans tracking-tight">
                        Work <span className="text-neon-green">Experience</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        My professional journey and key accomplishments
                    </p>
                </div>

                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-green via-deep-green to-transparent"></div>

                    <div className="space-y-12">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-neon-green rounded-full border-4 border-black transform -translate-x-1/2 shadow-[0_0_10px_rgba(0,255,157,0.5)]"></div>

                                {/* Content Card */}
                                <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} ml-16 md:ml-0`}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 hover:border-neon-green/30 transition-all duration-300"
                                    >
                                        {/* Header */}
                                        <div className="mb-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-2xl font-bold text-white font-sans">
                                                    {exp.position}
                                                </h3>
                                                {exp.is_current && (
                                                    <span className="px-3 py-1 text-xs font-bold text-black bg-neon-green rounded-full">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm font-mono">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4 text-neon-green" />
                                                    <span className="text-white font-medium">{exp.company}</span>
                                                </div>
                                                {exp.location && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-neon-green" />
                                                        <span>{exp.location}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-neon-green" />
                                                    <span>{exp.duration}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-300 mb-4 leading-relaxed">
                                            {exp.description}
                                        </p>

                                        {/* Technologies */}
                                        {exp.technologies && exp.technologies.length > 0 && (
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Code className="h-4 w-4 text-neon-green" />
                                                    <span className="text-sm font-medium text-gray-400 font-mono">Technologies</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {exp.technologies.map((tech, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-3 py-1 text-xs font-medium text-neon-green bg-neon-green/10 border border-neon-green/20 rounded-full font-mono"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Achievements */}
                                        {exp.achievements && exp.achievements.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Award className="h-4 w-4 text-neon-green" />
                                                    <span className="text-sm font-medium text-gray-400 font-mono">Key Achievements</span>
                                                </div>
                                                <ul className="space-y-2">
                                                    {exp.achievements.map((achievement, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                                                            <span className="text-neon-green mt-1">▹</span>
                                                            <span>{achievement}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>

                                {/* Spacer for alternating layout */}
                                <div className="hidden md:block flex-1"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
