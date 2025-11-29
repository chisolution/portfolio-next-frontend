/**
 * File upload utility functions for handling project images
 */

export interface FileValidationResult {
    valid: boolean;
    error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Validate image file
 */
export function validateImageFile(file: File): FileValidationResult {
    if (!file) {
        return { valid: false, error: 'No file selected' };
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: 'Invalid file type. Please upload JPG, PNG, WebP, or GIF images.'
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`
        };
    }

    return { valid: true };
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalFilename: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalFilename.split('.').pop();
    const nameWithoutExt = originalFilename.split('.').slice(0, -1).join('.');
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();

    return `${sanitizedName}-${timestamp}-${randomString}.${extension}`;
}

/**
 * Convert file to base64 for preview
 */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Upload file to public directory (client-side simulation)
 * In production, this would upload to a server or cloud storage
 */
export async function uploadProjectImage(file: File): Promise<string> {
    const validation = validateImageFile(file);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    const uniqueFilename = generateUniqueFilename(file.name);
    const uploadPath = `/uploads/projects/${uniqueFilename}`;

    // For now, we'll return the path that will be sent to the backend
    // The actual file upload will be handled by the form submission
    return uploadPath;
}

/**
 * Generate URL-friendly slug from text
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
