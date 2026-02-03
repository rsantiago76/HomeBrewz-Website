import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Coffee, ShoppingBag, Settings, LogOut } from 'lucide-react';

export default function SellerLayout() {
    const location = useLocation();
    const navigation = [
        { name: 'Dashboard', href: '/seller', icon: LayoutDashboard },
        { name: 'Products', href: '/seller/products', icon: Coffee },
        { name: 'Orders', href: '/seller/orders', icon: ShoppingBag },
        { name: 'Settings', href: '/seller/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-grow pt-5 bg-coffee-900 overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <span className="text-xl font-bold text-white">Roaster Admin</span>
                    </div>
                    <div className="mt-8 flex-1 flex flex-col">
                        <nav className="flex-1 px-2 pb-4 space-y-1">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-coffee-800 text-white' : 'text-coffee-100 hover:bg-coffee-700'
                                            }`}
                                    >
                                        <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-coffee-800 p-4">
                        <button className="flex-shrink-0 w-full group block">
                            <div className="flex items-center">
                                <LogOut className="inline-block h-9 w-9 rounded-full text-coffee-300 p-1" />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-white group-hover:text-gray-300">Sign Out</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
