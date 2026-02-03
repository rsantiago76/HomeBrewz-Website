import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/api';
import axios from 'axios';

type ProductFormData = {
    name: string;
    slug: string; // Auto-generate?
    description: string;
    price: number; // For variant logic, simplified here
    category_id?: string;
    image?: FileList;
};

export default function ProductForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductFormData>();
    const [uploading, setUploading] = useState(false);

    const onSubmit = async (data: ProductFormData) => {
        try {
            // 1. Upload Image if present
            let imageUrl = null;
            if (data.image && data.image.length > 0) {
                setUploading(true);
                const file = data.image[0];

                // Get Presigned URL
                const { data: presigned } = await api.post('/uploads/presigned', {
                    file_name: file.name,
                    file_type: file.type,
                    folder: 'products'
                });

                // Upload to S3
                // fields must be appended to form data
                const formData = new FormData();
                Object.keys(presigned.fields).forEach(key => {
                    formData.append(key, presigned.fields[key]);
                });
                formData.append('file', file);

                await axios.post(presigned.url, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                // Construct public URL (Assuming public-read)
                // presigned.url + presigned.fields['key'] (usually)
                imageUrl = presigned.url + presigned.fields['key'];
                setUploading(false);
            }

            // 2. Create Product
            // Note: We need roaster_id. Backend should infer or we pass it?
            // In create_product endpoint, it expects roaster_id.
            // We should fetch current roaster ID first or have backend infer it from token membership.
            // The current backend endpoint *requires* roaster_id in body.
            // We'll hardcode a fetch or stub for now, as we haven't implemented "get my roaster" easy selector.
            // TODO: Fetch user's roaster.
            const roasterId = "bdd33393-272e-4629-9e80-774f266203cf"; // TEMP MOCK ID. 

            await api.post('/products', {
                name: data.name,
                slug: data.name.toLowerCase().replace(/ /g, '-'),
                description: data.description,
                is_active: true,
                category_id: null,
                roaster_id: roasterId,
                // Variants logic needed for price... simplfied sending no variants for MVP form
                variants: [
                    {
                        sku: 'SKU-' + Date.now(),
                        weight: 12,
                        weight_unit: 'oz',
                        grind: 'whole_bean',
                        price_override: data.price * 100, // Cents
                        initial_quantity: 100
                    }
                ]
            });

            navigate('/seller/products');
        } catch (error) {
            console.error("Error creating product", error);
            setUploading(false);
            alert("Failed to create product");
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">

                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input {...register('name', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coffee-500 focus:ring-coffee-500 border p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea {...register('description')} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coffee-500 focus:ring-coffee-500 border p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                    <input type="number" step="0.01" {...register('price', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coffee-500 focus:ring-coffee-500 border p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <input type="file" {...register('image')} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-coffee-50 file:text-coffee-700 hover:file:bg-coffee-100" />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || uploading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-coffee-600 hover:bg-coffee-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coffee-500 disabled:bg-gray-400"
                    >
                        {isSubmitting || uploading ? 'Saving...' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}
