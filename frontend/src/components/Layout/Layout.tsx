import { Outlet, Link } from 'react-router-dom';
import { User, ShoppingCart, Menu } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function Layout() {
    return (
        <div className="min-h-screen bg-coffee-50 flex flex-col">
            <header className="bg-white border-b border-coffee-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <Link to="/">
                                <img src={logo} alt="HomeBrewz" className="h-14 w-auto" />
                            </Link>
                        </div>

                        <nav className="hidden md:flex items-center space-x-8 text-coffee-900 font-medium">
                            <Link to="/menu" className="hover:text-brand-green transition">Menu</Link>
                            {/* Other links can be added here */}
                        </nav>

                        <div className="flex items-center space-x-4">
                            <Link to="/cart" className="relative p-2 text-coffee-600 hover:bg-coffee-100 rounded-full transition">
                                <span className="text-coffee-900 font-bold mr-2">Cart</span>
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
