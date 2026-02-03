import { Outlet, Link } from 'react-router-dom';
import { ShoppingCoffee, User, ShoppingCart, Menu } from 'lucide-react';

export default function Layout() {
    return (
        <div className="min-h-screen bg-coffee-50 flex flex-col">
            <header className="bg-white border-b border-coffee-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex text-coffee-700 font-bold text-xl items-center gap-2">
                            <ShoppingCoffee className="h-8 w-8 text-coffee-600" />
                            <Link to="/">Homebrewz</Link>
                        </div>

                        <nav className="hidden md:flex space-x-8 text-coffee-600">
                            <Link to="/shop" className="hover:text-coffee-800 transition">Shop</Link>
                            <Link to="/roasters" className="hover:text-coffee-800 transition">Roasters</Link>
                            <Link to="/about" className="hover:text-coffee-800 transition">Our Story</Link>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <Link to="/cart" className="relative p-2 text-coffee-600 hover:bg-coffee-100 rounded-full transition">
                                <ShoppingCart className="h-5 w-5" />
                                {/* <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">2</span> */}
                            </Link>
                            <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-coffee-600 rounded-md hover:bg-coffee-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coffee-500 transition">
                                <User className="h-4 w-4" />
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
