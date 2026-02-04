import { Link } from 'react-router-dom';
import heroBanner from '../../assets/hero-cups.png';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';

const Home = () => {
    const { addToCart } = useCart();

    const handleAddToCart = (product: any) => {
        addToCart(product);
        // Simple feedback for now - can be replaced with a toast later
        alert(`Added ${product.name} to cart!`);
    };

    return (
        <div className="space-y-16 pb-16">
            {/* Hero Section */}
            <section className="bg-[#5D4037] rounded-3xl overflow-hidden relative min-h-[400px] flex items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-[#5D4037] via-[#5D4037]/90 to-transparent z-10 w-2/3"></div>
                {/* Hero Banner Image */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-2/3 bg-cover bg-center h-full"
                    style={{ backgroundImage: `url(${heroBanner})` }}
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition group h-full flex flex-col">
                            <Link to={`/product/${product.id}`} className="block flex-grow">
                                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                </div>
                                <h3 className="font-bold text-lg text-coffee-900">{product.name}</h3>
                                <p className="text-gray-400 font-medium">${product.price.toFixed(2)}</p>
                            </Link>
                            <button
                                className="bg-brand-green text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition mt-4 w-full"
                                onClick={() => handleAddToCart(product)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
