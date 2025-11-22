"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Github, ArrowUpRight, Calendar, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/lib/api";
import { Project } from "@/types";

export default function ProjectDetail() {
    const { slug } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            if (!slug) return;
            try {
                const response = await api.get(`/projects/slug/${slug}/`);
                setProject(response.data);
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-green"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
                <Link href="/projects" className="text-neon-green hover:underline">
                    Back to Projects
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black">
            <Navbar />

            <article className="pt-32 pb-20">
                {/* Header */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    <Link
                        href="/projects"
                        className="inline-flex items-center text-gray-400 hover:text-neon-green mb-8 transition-colors group"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Projects
                    </Link>

                    <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 font-sans tracking-tight">
                        {project.title}
                    </h1>

                    <div className="flex flex-wrap gap-4 mb-10">
                        {project.category && (
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20 text-sm font-medium font-mono">
                                <Tag className="mr-2 h-3.5 w-3.5" />
                                {project.category}
                            </span>
                        )}
                        {project.created_at && (
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 text-gray-300 border border-white/10 text-sm font-medium font-mono">
                                <Calendar className="mr-2 h-3.5 w-3.5" />
                                {new Date(project.created_at).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-4">
                        {project.live_demo_url && (
                            <a
                                href={project.live_demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 rounded-lg bg-neon-green text-black font-bold hover:bg-white hover:shadow-[0_0_20px_-5px_rgba(0,255,157,0.5)] transition-all duration-300"
                            >
                                Live Demo
                                <ArrowUpRight className="ml-2 h-5 w-5" />
                            </a>
                        )}
                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 rounded-lg border border-white/20 bg-white/5 text-white font-medium hover:bg-white/10 hover:border-neon-green/50 transition-all duration-300"
                            >
                                <Github className="mr-2 h-5 w-5" />
                                View Code
                            </a>
                        )}
                    </div>
                </div>

                {/* Main Image */}
                {project.project_image && (
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            <Image
                                src={project.project_image}
                                alt={project.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
                    {/* Overview */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 font-sans">Overview</h2>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            {project.description}
                        </p>
                    </section>

                    {/* Technologies */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 font-sans">Technologies Used</h2>
                        <div className="flex flex-wrap gap-3">
                            {project.technologies.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-mono text-sm hover:border-neon-green/30 transition-colors"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Problem */}
                    {project.problem && (
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 font-sans">The Problem</h2>
                            <div className="prose prose-lg prose-invert max-w-none text-gray-300">
                                <p>{project.problem}</p>
                            </div>
                        </section>
                    )}

                    {/* Process */}
                    {project.process && (
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 font-sans">The Process</h2>
                            <div className="prose prose-lg prose-invert max-w-none text-gray-300">
                                <p>{project.process}</p>
                            </div>
                        </section>
                    )}

                    {/* Impact/Results */}
                    {(project.impact || project.results) && (
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 font-sans">Impact & Results</h2>
                            <div className="prose prose-lg prose-invert max-w-none text-gray-300">
                                <p>{project.impact}</p>
                                <p className="mt-4">{project.results}</p>
                            </div>
                        </section>
                    )}

                    {/* Gallery */}
                    {project.gallery_images && project.gallery_images.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-8 font-sans">Gallery</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {project.gallery_images.map((img, index) => (
                                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-neon-green/50 transition-colors group">
                                        <Image
                                            src={img}
                                            alt={`${project.title} screenshot ${index + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </article>

            <Footer />
        </main>
    );
}
