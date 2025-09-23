import Link from 'next/link';
import { FileText } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <FileText className="h-8 w-8" />
                            <span className="text-xl font-bold">InvoicePro</span>
                        </div>
                        <p className="text-gray-400">
                            Professional invoicing made simple for businesses of all sizes.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/features" className="hover:text-white">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                            <li><Link href="/templates" className="hover:text-white">Templates</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/about" className="hover:text-white">About</Link></li>
                            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                            <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                            <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 InvoicePro. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;