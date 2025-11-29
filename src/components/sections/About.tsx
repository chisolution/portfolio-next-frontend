"use client";

import { motion } from "framer-motion";
import { Code, Database, Layout, Server, Cpu, Globe } from "lucide-react";
import SEOCard from "@/components/SEOCard";

const skills = [
    {
        name: "Frontend Engineering",
        icon: Layout,
        description: "HTML, CSS, JS, Next.js, Tailwind CSS, VueJS, Boostrap",
        color: "text-blue-400",
    },
    {
        name: "Backend Architecture",
        icon: Server,
        description: "Django, Python, PHP, Laravel, C#, PostgreSQL, MySQL, SSMS",
        color: "text-green-400",
    },
    {
        name: "Data Analytics",
        icon: Database,
        description: "Excel, SQL, Power BI",
        color: "text-purple-400",
    },
    {
        name: "System Design",
        icon: Cpu,
        description: "Microservices, API Design, Scalability, Security",
        color: "text-orange-400",
    },
    {
        name: "SEO & Analytics",
        icon: Globe,
        description: "Search Console, Google Analytics, Keyword Research, On-Page SEO",
        color: "text-pink-400",
    },
];

export default function About() {
    return (
        <section id="about" className="py-24 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-deep-green/5 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center">
                    <div className="mb-16 lg:mb-0">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl font-bold text-white mb-8 font-sans tracking-tight">
                                About <span className="text-neon-green">Me</span>
                            </h2>
                            <div className="prose prose-lg prose-invert text-gray-400">
                                <p className="mb-6 leading-relaxed">
                                    I operate at the intersection of <span className="text-white font-semibold">software engineering</span> and <span className="text-white font-semibold">data analysis</span>. My mission is to build digital systems that are not only robust and scalable but also provide intuitive, high-performance user experiences.
                                </p>
                                <p className="mb-6 leading-relaxed">
                                    With a rigorous academic background in Information Systems, I approach development with an engineering mindset—prioritizing efficiency, security, maintainability, and data-driven decision making. I architect systems. I analyze data. I solve problems.
                                </p>
                                <p className="leading-relaxed">
                                    I am currently seeking a role where I can leverage my full-stack capabilities to solve complex problems and drive innovation.
                                </p>
                            </div>
                            <SEOCard />
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                                className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-neon-green/30 transition-colors group"
                            >
                                <div className={`p-3 rounded-lg bg-white/5 w-fit mb-4 group-hover:bg-white/10 transition-colors`}>
                                    <skill.icon className={`h-6 w-6 ${skill.color}`} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 font-sans">
                                    {skill.name}
                                </h3>
                                <p className="text-sm text-gray-400 font-mono">
                                    {skill.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
