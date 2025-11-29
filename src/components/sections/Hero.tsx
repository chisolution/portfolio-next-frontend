"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { useState, useEffect } from "react";

const TypewriterEffect = ({ text }: { text: string }) => {
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 100);

        return () => clearInterval(timer);
    }, [text]);

    return (
        <span className="inline-block">
            {displayText}
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-[2px] h-[1em] bg-neon-green ml-1 align-middle"
            />
        </span>
    );
};

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-deep-green/20 rounded-full mix-blend-screen filter blur-[128px] animate-blob"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-green/10 rounded-full mix-blend-screen filter blur-[128px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center px-3 py-1 rounded-full border border-neon-green/30 bg-neon-green/10 text-neon-green text-sm font-mono mb-8 backdrop-blur-sm">
                        <Terminal size={14} className="mr-2" />
                        <span>Yes, I am available</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight mb-6 font-sans">
                        Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-deep-green">Dilane M.</span>
                        <br />
                        <span className="text-3xl sm:text-5xl text-gray-300">Software Engineer</span>
                    </h1>

                    <div className="h-16 sm:h-20 text-2xl sm:text-4xl text-gray-400 mb-10 font-mono">
                        <TypewriterEffect text="I  build solutions that scale, perform, and make sense." />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link
                            href="/projects"
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-black transition-all duration-200 bg-neon-green font-sans rounded-lg hover:bg-white hover:shadow-[0_0_30px_-5px_rgba(0,255,157,0.6)]"
                        >
                            View Projects
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 border border-white/20 rounded-lg hover:bg-white/10 hover:border-neon-green/50 font-sans backdrop-blur-sm"
                        >
                            Contact Me
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center p-1">
                    <div className="w-1 h-2 bg-neon-green rounded-full"></div>
                </div>
            </motion.div>
        </section>
    );
}
