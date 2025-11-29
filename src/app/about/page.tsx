"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/sections/About";
import ExperienceSection from "@/components/sections/Experience";
import CertificationsSection from "@/components/sections/Certifications";
import WorkshopsSection from "@/components/sections/Workshops";
import { GraduationCap, Check } from "lucide-react";

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
                                <h3 className="text-xl font-bold text-white font-sans mb-2">Bachelor of Commerce Information Systems</h3>
                                <p className="text-neon-green font-mono mb-4">University of Johannesburg</p>
                                <p className="text-gray-500 text-sm mb-6 font-mono flex items-center">
                                    Completed
                                    <Check className="ml-2 h-8 w-4 text-neon-green drop-shadow-[0_0_16px_#39ff14] animate-pulse" />
                                </p>
                                <p className="text-gray-400 leading-relaxed mb-4">
                                    Focusing on Software Engineering, Project Management and Data Analytics. Relevant coursework: Software Development, Information Systems, Business Management.
                                </p>
                                <p className="text-white font-mono mb-4">Capstone Project: <span className="text-neon-green animate-pulse"> Inventory Management App for Spaza Shops </span></p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}
