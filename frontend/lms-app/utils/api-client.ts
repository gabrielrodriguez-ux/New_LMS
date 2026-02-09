/**
 * API Client for New LMS
 * Handles requests to the microservices
 */

const SERVICES = {
    ENROLLMENT: process.env.NEXT_PUBLIC_ENROLLMENT_SERVICE_URL || 'http://localhost:3004',
    PROGRESS: process.env.NEXT_PUBLIC_PROGRESS_SERVICE_URL || 'http://localhost:3005',
    COMMENT: process.env.NEXT_PUBLIC_COMMENT_SERVICE_URL || 'http://localhost:3006',
    CATALOG: process.env.NEXT_PUBLIC_CATALOG_SERVICE_URL || 'http://localhost:3003',
    IAM: process.env.NEXT_PUBLIC_IAM_SERVICE_URL || 'http://localhost:3002',
    TENANT: process.env.NEXT_PUBLIC_TENANT_SERVICE_URL || 'http://localhost:3001',
};

import { supabase } from '@/lib/supabase';

export const apiClient = {
    async get(service: keyof typeof SERVICES, path: string) {
        // For now, we simulate API calls or call them if available
        try {
            const url = `${SERVICES[service]}${path}`;
            console.log(`[API] Fetching ${url}`);

            const { data: { session } } = await supabase.auth.getSession();
            const headers: HeadersInit = session?.access_token
                ? { 'Authorization': `Bearer ${session.access_token}` }
                : {};

            const response = await fetch(url, { headers });
            if (!response.ok) {
                console.error(`[API] Error ${response.status} from ${url}`);
                throw new Error(`API call failed: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error in ${service} service:`, error);
            // Return mock data fallback if needed
            return null;
        }
    },

    async post(service: keyof typeof SERVICES, path: string, data: any) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
            };

            const response = await fetch(`${SERVICES[service]}${path}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API call failed: ${response.status} ${errText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error in ${service} service:`, error);
            throw error;
        }
    },

    async put(service: keyof typeof SERVICES, path: string, data: any) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
            };

            const response = await fetch(`${SERVICES[service]}${path}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API call failed: ${response.status} ${errText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error in ${service} service:`, error);
            throw error;
        }
    },

    async delete(service: keyof typeof SERVICES, path: string) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers: HeadersInit = session?.access_token
                ? { 'Authorization': `Bearer ${session.access_token}` }
                : {};

            const response = await fetch(`${SERVICES[service]}${path}`, {
                method: 'DELETE',
                headers,
            });
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API call failed: ${response.status} ${errText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error in ${service} service:`, error);
            throw error;
        }
    }
};
