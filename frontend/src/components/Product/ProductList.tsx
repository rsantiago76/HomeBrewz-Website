import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { Product, PaginatedResponse } from '../../api/types';
import { Link } from 'react-router-dom';

async function fetchProducts(page = 1): Promise<PaginatedResponse<Product>> {
    const limit = 20;
    const skip = (page - 1) * limit;
    // Note: Assuming backend returns list directly for now based on implementation
    // But API spec says PaginatedResponse.
    // Let's adjust to match backend implementation (List[Product]) for now, or fix backend.
    // Backend `products.py` returns `List[schemas.ProductOut]`.
    // It does NOT support pagination metadata in response body yet (just JSON list).
    // So we treat response.data as T[] directly.
    const { data } = await api.get<Product[]>('/products', { params: { skip, limit } });
    return {
        items: data,
        total: 100, // Mock total since backend doesn't return it yet
        skip,
        limit
    };
}

export default function ProductList() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: () => fetchProducts(1)
    });

    if (isLoading) return <div className="text-center py-10">Loading coffee...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error loading products</div>;

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Fresh Roasts</h2>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {data?.items.map((product) => (
                        <div key={product.id} className="group relative">
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                {/* Placeholder image if none */}
                                <img
                                    src="https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-700">
                                        <Link to={`/product/${product.id}`}>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">{product.description?.substring(0, 50)}...</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">${(product.price_cents || 0) / 100}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
