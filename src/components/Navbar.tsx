"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-4xl transition-all duration-300 rounded-full",
                scrolled || isOpen
                    ? "glass shadow-lg shadow-neon-green/10"
                    : "bg-transparent"
            )}
        >
            <div className="px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex-shrink-0">
                        <Link href="/" className="font-bold text-xl tracking-tighter text-white">
                            <span className="text-neon-green">PERSONAL</span>
                            <br/>
                            PORTFOLIO<span className="text-neon-green">.</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="flex items-baseline space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 group"
                                >
                                    <span className={cn(
                                        "relative z-10 transition-colors",
                                        pathname === item.path ? "text-black" : "text-gray-300 group-hover:text-white"
                                    )}>
                                        {item.name}
                                    </span>
                                    {pathname === item.path && (
                                        <motion.div
                                            layoutId="navbar-active"
                                            className="absolute inset-0 bg-neon-green rounded-full z-0"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-full text-gray-300 hover:text-white focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, borderRadius: "0 0 24px 24px" }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden bg-black/90 backdrop-blur-xl rounded-b-3xl border-t border-white/10"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "block px-4 py-3 rounded-xl text-base font-medium transition-colors",
                                        pathname === item.path
                                            ? "bg-neon-green/10 text-neon-green border border-neon-green/20"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
