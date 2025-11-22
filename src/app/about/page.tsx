"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/sections/About";
import { Briefcase, GraduationCap } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <div className="pt-32 pb-12">
                <AboutSection />

                {/* Experience Section */}
                <section className="py-24 bg-black relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-white mb-16 flex items-center font-sans tracking-tight">
                            <Briefcase className="mr-4 h-8 w-8 text-neon-green" />
                            Experience
                        </h2>

                        <div className="space-y-16">
                            {/* Experience Item 1 */}
                            <div className="relative border-l-2 border-neon-green/30 pl-8 ml-4">
                                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-black border-2 border-neon-green shadow-[0_0_10px_rgba(0,255,157,0.5)]"></div>
                                <h3 className="text-2xl font-bold text-white font-sans">Software Engineer Intern</h3>
                                <p className="text-neon-green font-mono mb-4">Tech Company Inc. • Summer 2024</p>
                                <p className="text-gray-400 leading-relaxed max-w-3xl">
                                    Developed and maintained RESTful APIs using Django and PostgreSQL. Collaborated with the frontend team to integrate React components. Optimized database queries reducing load times by 30%.
                                </p>
                            </div>

                            {/* Experience Item 2 */}
                            <div className="relative border-l-2 border-white/10 pl-8 ml-4">
                                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-black border-2 border-gray-600"></div>
                                <h3 className="text-2xl font-bold text-white font-sans">Data Analyst Assistant</h3>
                                <p className="text-gray-400 font-mono mb-4">University Research Lab • 2023 - 2024</p>
                                <p className="text-gray-400 leading-relaxed max-w-3xl">
                                    Analyzed large datasets using Python (Pandas, NumPy) to identify trends in student performance. Created interactive visualizations using Tableau and Matplotlib for stakeholder presentations.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Education Section */}
                <section className="py-24 bg-black relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-white mb-16 flex items-center font-sans tracking-tight">
                            <GraduationCap className="mr-4 h-8 w-8 text-neon-green" />
                            Education
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:border-neon-green/30 transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/5">
                                <h3 className="text-xl font-bold text-white font-sans mb-2">Master of Science in Computer Science</h3>
                                <p className="text-neon-green font-mono mb-4">University of Technology</p>
                                <p className="text-gray-500 text-sm mb-6 font-mono">2023 - Present</p>
                                <p className="text-gray-400 leading-relaxed">
                                    Focusing on Software Engineering and Data Science. Relevant coursework: Advanced Algorithms, Machine Learning, Distributed Systems.
                                </p>
                            </div>

                            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:border-neon-green/30 transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/5">
                                <h3 className="text-xl font-bold text-white font-sans mb-2">Bachelor of Science in Information Technology</h3>
                                <p className="text-neon-green font-mono mb-4">State University</p>
                                <p className="text-gray-500 text-sm mb-6 font-mono">2019 - 2023</p>
                                <p className="text-gray-400 leading-relaxed">
                                    Graduated with Honors. Capstone project: "Intelligent Traffic Management System using IoT".
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}
