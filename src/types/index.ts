export interface Project {
    id: string;
    title: string;
    description: string;
    problem: string;
    process: string;
    impact: string;
    results: string;
    technologies: string[];
    skills: string[];
    category?: string;
    status?: string;
    view_count: number;
    live_demo_url?: string;
    github_url?: string;
    display_order: number;
    is_featured: boolean;
    project_image?: string;
    gallery_images?: string[];
    project_slug: string;
    created_at: string;
}

export interface ContactForm {
    full_name: string;
    email: string;
    subject: string;
    message: string;
    phone_number?: string;
    organization?: string;
    preferred_contact_method?: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    location?: string;
    start_date: string;
    end_date?: string;
    description: string;
    technologies: string[];
    achievements: string[];
    is_current: boolean;
    display_order: number;
    duration: string;
}
