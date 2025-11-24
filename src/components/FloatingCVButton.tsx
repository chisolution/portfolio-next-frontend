"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import api from "@/lib/api";

export default function FloatingCVButton() {
    const handleDownloadCV = async () => {
        try {
            const response = await api.get('/cv/download/', {
                responseType: 'blob',
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Delan_CV.pdf');

            // Append to html link element page
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
        } catch (error) {
            console.error("Error downloading CV:", error);
            alert("Failed to download CV. Please try again later.");
        }
    };

    return (
        <motion.button
            onClick={handleDownloadCV}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 bg-neon-green rounded-full shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:shadow-[0_0_30px_rgba(0,255,157,0.6)] transition-shadow duration-300 group"
            title="Download CV"
        >
            <Download className="w-6 h-6 text-black group-hover:animate-bounce" />
        </motion.button>
    );
}
