import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, ArrowRight, Code } from "lucide-react";
import { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
    project: Project;
    className?: string;
}

export default function ProjectCard({ project, className }: ProjectCardProps) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-neon-green/50 transition-all duration-300 shadow-lg hover:shadow-neon-green/20",
                className
            )}
        >
            <div className="relative aspect-video overflow-hidden bg-black">
                {project.project_image ? (
                    <Image
                        src={project.project_image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            // Fallback to placeholder if image fails
                            e.currentTarget.src = "https://placehold.co/600x400/000000/00ff9d?text=Project";
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                        <Code className="h-12 w-12 text-gray-700" />
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            </div>

            <div className="flex flex-1 flex-col p-6 relative z-10">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-neon-green transition-colors line-clamp-1 font-sans tracking-tight">
                        {project.title}
                    </h3>
                    <div className="flex gap-3">
                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Github size={18} />
                            </a>
                        )}
                        {project.live_demo_url && (
                            <a
                                href={project.live_demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-neon-green transition-colors"
                            >
                                <ArrowUpRight size={18} />
                            </a>
                        )}
                    </div>
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 flex-1 mb-6 font-sans leading-relaxed">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 3).map((tech) => (
                        <span
                            key={tech}
                            className="inline-flex items-center rounded px-2 py-1 text-xs font-medium text-neon-green bg-neon-green/10 border border-neon-green/20 font-mono"
                        >
                            {tech}
                        </span>
                    ))}
                    {project.technologies.length > 3 && (
                        <span className="inline-flex items-center rounded px-2 py-1 text-xs font-medium text-gray-400 bg-white/5 border border-white/10 font-mono">
                            +{project.technologies.length - 3}
                        </span>
                    )}
                </div>

                <Link
                    href={`/projects/${project.project_slug}`}
                    className="inline-flex items-center text-sm font-bold text-white hover:text-neon-green transition-colors group/link"
                >
                    View Case Study
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
            </div>
        </motion.div>
    );
}
