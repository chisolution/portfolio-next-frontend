import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div className="mb-8 md:mb-0 text-center md:text-left">
                        <span className="text-2xl font-bold tracking-tighter text-white">
                            PORTFOLIO<span className="text-neon-green">.</span>
                        </span>
                        <p className="mt-2 text-sm text-gray-500">
                            Building digital experiences that matter.
                        </p>
                    </div>
                    <div className="flex space-x-8">
                        <a
                            href="#"
                            className="text-gray-400 hover:text-neon-green transition-colors transform hover:scale-110 duration-200"
                        >
                            <span className="sr-only">GitHub</span>
                            <Github className="h-6 w-6" />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-neon-green transition-colors transform hover:scale-110 duration-200"
                        >
                            <span className="sr-only">LinkedIn</span>
                            <Linkedin className="h-6 w-6" />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-neon-green transition-colors transform hover:scale-110 duration-200"
                        >
                            <span className="sr-only">Twitter</span>
                            <Twitter className="h-6 w-6" />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-neon-green transition-colors transform hover:scale-110 duration-200"
                        >
                            <span className="sr-only">Email</span>
                            <Mail className="h-6 w-6" />
                        </a>
                    </div>
                </div>
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-600">
                        &copy; {new Date().getFullYear()} Delan. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="#" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
