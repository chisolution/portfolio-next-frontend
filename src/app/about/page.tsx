"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/sections/About";
import ExperienceSection from "@/components/sections/Experience";
import CertificationsSection from "@/components/sections/Certifications";
import WorkshopsSection from "@/components/sections/Workshops";
import { GraduationCap } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <div className="pt-32 pb-12">
                <AboutSection />

                {/* Dynamic Experience Section */}
                <ExperienceSection />

                {/* Dynamic Certifications Section */}
                <CertificationsSection />

                {/* Dynamic Workshops Section */}
                <WorkshopsSection />

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
