'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, FileText, Users, CreditCard, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
        setIsOpen(false);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <FileText className="h-8 w-8 text-white" />
                            <span className="text-white text-xl font-bold">InvoicePro</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link
                                href="/"
                                className="text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                Home
                            </Link>
                            {user && (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/invoices"
                                        className="text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                                    >
                                        Invoices
                                    </Link>
                                    <Link
                                        href="/clients"
                                        className="text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                                    >
                                        Clients
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                                    >
                                        Settings
                                    </Link>
                                </>
                            )}
                            {!user && (
                                <>
                                    <Link
                                        href="/about"
                                        className="text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                                    >
                                        About Us
                                    </Link>
                                    <Link
                                        href="/pricing"
                                        className="text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                                    >
                                        Pricing
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-white text-sm flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    {user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    href="/login"
                                    className="text-white hover:bg-blue-800 hover:bg-opacity-50 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-white hover:bg-blue-800 hover:bg-opacity-50 p-2 rounded-md"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700">
                        <Link
                            href="/"
                            className="text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        {user && (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/invoices"
                                    className="text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Invoices
                                </Link>
                                <Link
                                    href="/clients"
                                    className="text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Clients
                                </Link>
                                <Link
                                    href="/settings"
                                    className="text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Settings
                                </Link>
                                <div className="border-t border-blue-600 my-2"></div>
                                <div className="px-3 py-2 text-white text-sm flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    {user.name}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-white hover:bg-blue-800 hover:bg-opacity-50 w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </>
                        )}
                        {!user && (
                            <>
                                <Link
                                    href="/about"
                                    className="text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    About Us
                                </Link>
                                <Link
                                    href="/pricing"
                                    className="text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Pricing
                                </Link>
                                <div className="border-t border-blue-600 my-2"></div>
                                <Link
                                    href="/login"
                                    className="text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-white text-blue-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium mx-3"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;