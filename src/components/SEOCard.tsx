"use client";

import { motion } from "framer-motion";
import { Award, Code2, Briefcase, GraduationCap } from "lucide-react";

export default function SEOCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 p-6 rounded-xl border border-neon-green/20 bg-gradient-to-br from-neon-green/5 to-deep-green/5 backdrop-blur-sm"
        >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-neon-green" />
                Professional Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                    <Code2 className="w-5 h-5 text-neon-green mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Software Engineering</h4>
                        <p className="text-xs text-gray-400">
                            Building scalable, maintainable systems with clean architecture and engineering best practices
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-neon-green mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Full Scale Solutions</h4>
                        <p className="text-xs text-gray-400">
                            End-to-end application development from database design to user interface implementation
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-neon-green mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Technical Expertise</h4>
                        <p className="text-xs text-gray-400">
                            React, Next.js, Django, Python, TypeScript, PostgreSQL, System Architecture
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-neon-green mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Core Focus</h4>
                        <p className="text-xs text-gray-400">
                            Performance optimization, security, scalability, and data-driven decision making
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
