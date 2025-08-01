/**
 * API Configuration utility
 * Handles different API base URLs for different environments
 */

export const API_CONFIG = {
  // In development, use the local Vite dev server
  // In production, use environment variable or fallback to same domain
  baseURL: import.meta.env.VITE_API_URL || (
    import.meta.env.DEV 
      ? 'http://localhost:8080'  // Local development
      : window.location.origin   // Production - same domain
  ),
};

export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_CONFIG.baseURL}/api/${cleanEndpoint}`;
}

// Example usage:
// getApiUrl('auth/login') -> 'http://localhost:8080/api/auth/login' (dev)
// getApiUrl('auth/login') -> 'https://your-domain.com/api/auth/login' (prod)
