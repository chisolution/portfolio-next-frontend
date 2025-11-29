/**
 * Date formatting utilities for forms
 */

/**
 * Format date for HTML date input (YYYY-MM-DD)
 * Handles various input formats and ensures consistent output
 */
export function formatDateForInput(dateString: string | undefined): string {
    if (!dateString) return '';

    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }

    // Handle ISO format (YYYY-MM-DDTHH:mm:ss)
    if (dateString.includes('T')) {
        return dateString.split('T')[0];
    }

    // Handle YYYY/MM/DD format
    if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
            // Ensure YYYY-MM-DD format
            const [year, month, day] = parts;
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
    }

    return dateString;
}

/**
 * Format date for API submission (YYYY-MM-DD or null)
 * Ensures the date is in the correct format before sending to backend
 * Returns null for empty dates to satisfy Django's DateField validation
 */
export function formatDateForAPI(dateString: string | undefined): string | null {
    if (!dateString) return null;

    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }

    // Handle YYYY/MM/DD format - convert to YYYY-MM-DD
    if (dateString.includes('/')) {
        return dateString.replace(/\//g, '-');
    }

    // Handle ISO format
    if (dateString.includes('T')) {
        return dateString.split('T')[0];
    }

    return dateString;
}
