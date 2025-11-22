"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import api from "@/lib/api";
import { Project } from "@/types";

export default function FeaturedProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get("/projects/featured/");
                // API returns: { message: "...", data: { count: X, results: [...] } }
                const data = response.data?.data?.results || response.data?.results || [];
                setProjects(data);
            } catch (error) {
                console.error("Error fetching featured projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-white/10 rounded w-1/4 mx-auto"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-96 bg-white/5 rounded-2xl border border-white/10"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-black relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4 font-sans tracking-tight">
                        Featured <span className="text-neon-green">Projects</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        A selection of my recent work, showcasing technical depth and creative problem solving.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link
                        href="/projects"
                        className="inline-flex items-center px-8 py-4 text-base font-bold text-white border border-white/20 rounded-lg hover:bg-white/10 hover:border-neon-green/50 transition-all duration-300 font-sans group"
                    >
                        View All Projects
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
