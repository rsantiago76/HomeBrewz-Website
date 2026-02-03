import { Link } from 'react-router-dom';
// import heroBanner from '../../assets/hero-banner.png';
import { products } from '../../data/products';

const Home = () => {
    return (
        <div className="space-y-16 pb-16">
            {/* Hero Section */}
            <section className="bg-[#5D4037] rounded-3xl overflow-hidden relative min-h-[400px] flex items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-[#5D4037] via-[#5D4037]/90 to-transparent z-10 w-2/3"></div>
                {/* Hero Banner Image */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-2/3 bg-cover bg-center h-full"
                    style={{ backgroundImage: `url(/images/homebrewz-homepage.png)` }}
                ></div>

                <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
                    <div className="max-w-xl">
                        <div className="mb-4 flex items-center gap-2">
                            {/* Optional Logo or Icon here if needed */}
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 leading-tight">
                            HomeBrewz
                        </h1>
                        <p className="text-2xl text-coffee-100 font-medium tracking-wide">
                            Premium Coffee
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Ordering Section */}
            <section>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-coffee-900">Main Ordering</h2>
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-coffee-900">$2.00</span>
                        <button className="bg-brand-green text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition">
                            Add to Cart
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link to={`/product/${product.id}`} key={product.id} className="block">
                            <div className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition group h-full">
                                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                </div>
                                <h3 className="font-bold text-lg text-coffee-900">{product.name}</h3>
                                <p className="text-gray-400 font-medium">${product.price.toFixed(2)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Horizontal Product Card Preview (from screenshot bottom right) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-4 rounded-3xl flex items-center gap-6 shadow-sm">
                    <div className="h-32 w-32 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2574&auto=format&fit=crop" alt="Coffee" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-coffee-900 mb-1">$2.00 <span className="text-gray-400 text-base font-normal ml-2">€ 43</span></h3>
                        <button className="bg-brand-green text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition mt-2 w-full sm:w-auto">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
