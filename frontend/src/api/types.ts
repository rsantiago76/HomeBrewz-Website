export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    skip: number;
    limit: number;
}

export interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'CUSTOMER' | 'SITE_ADMIN';
}

export interface Roaster {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price_cents: number; // OLD schema field, needs update to new logic if we use it, but keeping generic for now
    // Add variant support
}
