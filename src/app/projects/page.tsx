"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import api from "@/lib/api";
import { Project } from "@/types";
import { Search } from "lucide-react";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get("/projects/published/");
                // API returns: { message: "...", data: { count: X, results: [...] } }
                const data = response.data?.data?.results || response.data?.results || [];
                setProjects(data);
                setFilteredProjects(data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        const filtered = projects.filter((project) => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
        setFilteredProjects(filtered);
    }, [searchTerm, selectedCategory, projects]);

    const categories = ["All", ...Array.from(new Set(Array.isArray(projects) ? projects.map((p) => p.category).filter(Boolean) : []))];

    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-white mb-6 font-sans tracking-tight">
                        All <span className="text-neon-green">Projects</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Explore my complete portfolio of projects, from web applications to data analysis.
                    </p>
                    <motion.div className="mt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                        <a href="/contact" className="inline-flex items-center px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-white transition-all">
                            Request Backend access
                        </a>
                    </motion.div>
                </div>

                <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-neon-green transition-colors h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-all duration-300"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                        {categories.map((category) => (
                            <button
                                key={category as string}
                                onClick={() => setSelectedCategory(category as string)}
                                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border ${selectedCategory === category
                                    ? "bg-neon-green text-black border-neon-green shadow-[0_0_15px_-5px_rgba(0,255,157,0.5)]"
                                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white"
                                    }`}
                            >
                                {category as string}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-96 bg-white/5 rounded-2xl animate-pulse border border-white/10"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}

                {!loading && filteredProjects.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-xl text-gray-500">
                            No projects found matching your criteria.
                        </p>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
