"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Phone, Building2 } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function Contact() {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        organization: "",
        subject: "",
        message: "",
        preferred_contact_method: "email",
    });
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        try {
            await api.post("/contact/", formData);
            setStatus("success");
            setFormData({
                full_name: "",
                email: "",
                phone_number: "",
                organization: "",
                subject: "",
                message: "",
                preferred_contact_method: "email",
            });
        } catch (error) {
            setStatus("error");
            setErrorMessage("Something went wrong. Please try again later.");
            console.error("Contact form error:", error);
        }
    };

    const inputClasses = "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-all duration-300";

    return (
        <section id="contact" className="py-24 bg-black relative">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4 font-sans tracking-tight">
                        Get in <span className="text-neon-green">Touch</span>
                    </h2>
                    <p className="text-lg text-gray-400">
                        Ready to start a project? Let's build something amazing together.
                    </p>
                </div>

                <div className="glass-card rounded-2xl p-8 md:p-12">
                    {status === "success" ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-green/10 mb-6">
                                <CheckCircle className="h-10 w-10 text-neon-green" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                Message Transmitted
                            </h3>
                            <p className="text-gray-400 mb-8">
                                Thank you for reaching out. I'll get back to you as soon as possible.
                            </p>
                            <button
                                onClick={() => setStatus("idle")}
                                className="text-neon-green hover:text-white font-medium transition-colors"
                            >
                                Send another message
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-400 mb-2 font-mono">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="full_name"
                                        name="full_name"
                                        required
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2 font-mono">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-400 mb-2 font-mono">
                                        <Phone className="inline h-3.5 w-3.5 mr-1" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone_number"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="organization" className="block text-sm font-medium text-gray-400 mb-2 font-mono">
                                        <Building2 className="inline h-3.5 w-3.5 mr-1" />
                                        Organization
                                    </label>
                                    <input
                                        type="text"
                                        id="organization"
                                        name="organization"
                                        value={formData.organization}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Company Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2 font-mono">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    placeholder="Project Inquiry"
                                />
                            </div>

                            <div>
                                <label htmlFor="preferred_contact_method" className="block text-sm font-medium text-gray-400 mb-2 font-mono">
                                    Preferred Contact Method
                                </label>
                                <select
                                    id="preferred_contact_method"
                                    name="preferred_contact_method"
                                    value={formData.preferred_contact_method}
                                    onChange={handleChange}
                                    className={cn(inputClasses, "cursor-pointer")}
                                >
                                    <option value="email" className="bg-gray-900">Email</option>
                                    <option value="phone" className="bg-gray-900">Phone</option>
                                    <option value="either" className="bg-gray-900">Either</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2 font-mono">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className={cn(inputClasses, "resize-none")}
                                    placeholder="Tell me about your project..."
                                />
                            </div>

                            {status === "error" && (
                                <div className="flex items-center text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900/50">
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    {errorMessage}
                                </div>
                            )}

                            <motion.button
                                type="submit"
                                disabled={status === "submitting"}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center px-8 py-4 text-base font-bold text-black bg-neon-green rounded-lg hover:bg-white hover:shadow-[0_0_20px_-5px_rgba(0,255,157,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-sans"
                            >
                                {status === "submitting" ? (
                                    "Transmitting..."
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
