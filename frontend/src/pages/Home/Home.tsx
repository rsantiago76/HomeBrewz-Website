import { Link } from 'react-router-dom';
import homeBanner from '../../assets/homebrewz-homepage.png';
import { products } from '../../data/products';

const Home = () => {
    return (
        <div className="space-y-16 pb-16">
            {/* Hero Section - Using the top part of the reference image */}
            <section className="bg-[#5D4037] rounded-3xl overflow-hidden relative min-h-[400px] flex items-center">
                {/* 
                   We use the full homepage image but position it to show only the top "Hero" part.
                   'object-cover' and 'object-top' helps, but since it's a full page mock, 
                   we might need to be careful. If the user wants the exact look, 
                   using it as a background image with 'top center' alignment is best.
                */}
                <div
                    className="absolute inset-0 bg-cover bg-top bg-no-repeat"
                    style={{ backgroundImage: `url(${homeBanner})` }}
                ></div>

                {/* Overlay gradient to ensure text readability if we were overlaying text, 
                    but if the image already has text, we might not need this. 
                    However, since we want to be safe if the image text is not perfect 
                    or if we want to add accessible text:
                */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#5D4037]/20 to-transparent z-10"></div>
            </section>

            {/* Main Ordering Section - Fully Interactive */}
            <section>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-coffee-900">Main Ordering</h2>
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-coffee-900">$2.00</span>
                        <button className="bg-brand-green text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition shadow-sm">
                            Add to Cart
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link to={`/product/${product.id}`} key={product.id} className="block group">
                            <div className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition h-full flex flex-col">
                                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100 relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                    {/* Optional: Add a quick add button overlay? Keeping it simple for now matching the clean design */}
                                </div>
                                <h3 className="font-bold text-lg text-coffee-900 mb-1">{product.name}</h3>
                                <div className="mt-auto flex justify-between items-center">
                                    <p className="text-gray-400 font-medium">${product.price.toFixed(2)}</p>
                                    <div className="w-8 h-8 rounded-full bg-coffee-50 flex items-center justify-center text-brand-green opacity-0 group-hover:opacity-100 transition">
                                        +
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Horizontal Product Card Preview (Bottom Right of design) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-4 rounded-3xl flex items-center gap-6 shadow-sm">
                    <div className="h-32 w-32 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2574&auto=format&fit=crop" alt="Coffee" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-coffee-900 mb-1">Latte</h3>
                            <span className="text-gray-400 font-medium">$3.00</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">The smooth, creamy classic. Perfect for any time of day.</p>
                        <button className="bg-brand-green text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition mt-2 w-full sm:w-auto text-sm">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
