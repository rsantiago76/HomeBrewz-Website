import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { products } from '../../data/products';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const product = products.find(p => p.id === id);

    if (!product) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="bg-coffee-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Link to="/" className="inline-flex items-center text-coffee-600 hover:text-coffee-900 mb-8 transition">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Menu
                </Link>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                    {/* Product Image */}
                    <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-lg">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 lg:mt-0 font-sans">
                        <h1 className="text-4xl font-bold tracking-tight text-coffee-900">{product.name}</h1>
                        <p className="text-3xl text-brand-green font-bold mt-4">${product.price.toFixed(2)}</p>

                        <div className="mt-6 border-t border-coffee-200 pt-6">
                            <h3 className="sr-only">Description</h3>
                            <p className="text-xl font-medium text-coffee-700 italic mb-4">{product.description}</p>
                            <p className="text-base text-coffee-600 leading-relaxed">{product.longDescription}</p>
                        </div>

                        {/* Flavor Notes */}
                        <div className="mt-8">
                            <h3 className="text-sm font-bold text-coffee-900 uppercase tracking-wide">Flavor Notes</h3>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {product.flavorNotes.map(note => (
                                    <span key={note} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-coffee-100 text-coffee-800">
                                        {note}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                            {/* Best For */}
                            <div>
                                <h3 className="text-sm font-bold text-coffee-900 uppercase tracking-wide">Best For</h3>
                                <p className="mt-2 text-sm text-coffee-600">{product.bestFor}</p>
                            </div>

                            {/* Preparation */}
                            {product.preparation && (
                                <div>
                                    <h3 className="text-sm font-bold text-coffee-900 uppercase tracking-wide">Preparation</h3>
                                    <p className="mt-2 text-sm text-coffee-600">{product.preparation}</p>
                                </div>
                            )}
                        </div>

                        {/* Customization */}
                        {product.customization && (
                            <div className="mt-8">
                                <h3 className="text-sm font-bold text-coffee-900 uppercase tracking-wide">Customization Options</h3>
                                <ul className="mt-2 list-disc list-inside text-sm text-coffee-600">
                                    {product.customization.map(option => (
                                        <li key={option}>{option}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-10">
                            <button
                                type="button"
                                className="flex w-full items-center justify-center rounded-xl border border-transparent bg-brand-green px-8 py-4 text-base font-bold text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 transition shadow-md"
                            >
                                <ShoppingBag className="mr-2 h-5 w-5" />
                                Add {product.name} to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
