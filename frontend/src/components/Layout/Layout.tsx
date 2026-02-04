import { Outlet, Link } from 'react-router-dom';
import { Coffee, User, ShoppingCart, Menu } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Layout() {
    const { cartCount } = useCart();

    return (
        <div className="min-h-screen bg-coffee-50 flex flex-col">
            <header className="bg-white border-b border-coffee-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex text-coffee-700 font-bold text-xl items-center gap-2">
                            <Coffee className="h-8 w-8 text-coffee-600" />
                            <Link to="/">Homebrewz</Link>
                        </div>

                        <nav className="hidden md:flex items-center space-x-8 text-coffee-900 font-medium">
                            <Link to="/menu" className="hover:text-brand-green transition">Menu</Link>
                            <Link to="/story" className="hover:text-brand-green transition">Our Story</Link>
                            {/* Other links can be added here */}
                        </nav>

                        <div className="flex items-center space-x-4">
                            <Link to="/cart" className="relative p-2 text-coffee-600 hover:bg-coffee-100 rounded-full transition flex items-center">
                                <span className="text-coffee-900 font-bold mr-2">Cart</span>
                                {cartCount > 0 && (
                                    <span className="bg-brand-green text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center -ml-1">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <Link to="/login" className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-brand-green rounded-lg hover:opacity-90 transition shadow-sm">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            <footer className="bg-white border-t border-coffee-200 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-coffee-400">© 2024 Homebrewz. Built for Coffee Lovers.</p>
                </div>
            </footer>
        </div>
    );
}
