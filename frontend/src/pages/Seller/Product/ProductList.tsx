import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../../lib/api';
import { Product } from '../../../api/types';

// TODO: Filter by current roaster (backend should handle this context)
async function fetchRoasterProducts() {
    // Requires an endpoint that filters for the current user's roaster
    // For MVP, if user is Roaster Admin, /products/mine or similar needed.
    // Using filtered /products endpoint for now with assumption
    const { data } = await api.get<Product[]>('/products');
    return data;
}

export default function SellerProductList() {
    const { data: products, isLoading } = useQuery({
        queryKey: ['seller-products'],
        queryFn: fetchRoasterProducts
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Products</h1>
                    <p className="mt-2 text-sm text-gray-700">A list of all your coffee products including title, price, and stock status.</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Link
                        to="new"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-coffee-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-coffee-700 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Link>
                </div>
            </div>
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stock (Quick Edit)</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {products?.map((product) => (
                                        <tr key={product.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{product.name}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${product.price_cents ? product.price_cents / 100 : 'N/A'}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Active</span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {/* Placeholder for Quick Edit - Assuming first variant for now or mocked */}
                                                <InventoryInput productId={product.id} initialQuantity={100} />
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <Link to={`${product.id}/edit`} className="text-coffee-600 hover:text-coffee-900 mr-4"><Edit className="h-4 w-4 inline" /></Link>
                                                <button className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4 inline" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InventoryInput({ productId, initialQuantity }: { productId: string, initialQuantity: number }) {
    // Note: In real app, we need Variant ID. We don't have it in the simplistic list response.
    // We should fetch variants.
    // For MVP/Demo UI pattern:
    const [qty, setQty] = React.useState(initialQuantity);

    // Logic to save onBlur or Enter would go here calling the PATCH endpoint
    // api.patch(\`/products/variants/\${variantId}/inventory\`, { quantity_in: qty });

    return (
        <input
            type="number"
            className="w-20 rounded border-gray-300 shadow-sm focus:border-coffee-500 focus:ring-coffee-500 sm:text-sm"
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value))}
        />
    )
}
