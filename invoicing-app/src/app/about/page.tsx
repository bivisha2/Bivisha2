'use client';

import Link from 'next/link';
import {
    Users,
    Target,
    Heart,
    Award,
    Globe,
    TrendingUp,
    Shield,
    Clock,
    CheckCircle,
    Linkedin,
    Twitter,
    Mail
} from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            About
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                {" "}InvoicePro
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            We're on a mission to simplify invoicing for businesses worldwide.
                            Our platform empowers entrepreneurs and companies to get paid faster
                            and manage their finances with confidence.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission, Vision, Values */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Target className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                            <p className="text-gray-600">
                                To democratize professional invoicing by providing simple, powerful tools
                                that help businesses of all sizes get paid faster and manage their cash flow efficiently.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Globe className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                            <p className="text-gray-600">
                                To become the world's most trusted invoicing platform, enabling millions
                                of businesses to focus on what they do best while we handle their billing needs.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
                            <p className="text-gray-600">
                                Simplicity, reliability, and customer success drive everything we do.
                                We believe great software should be intuitive, secure, and accessible to everyone.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Our Story
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    InvoicePro was born from frustration. Our founders, Sarah and Mike,
                                    were running their own consulting business and struggling with outdated
                                    invoicing software that was either too complex or too limited.
                                </p>
                                <p>
                                    After spending countless hours on billing instead of serving clients,
                                    they decided to build the invoicing solution they wished existed -
                                    one that was powerful yet simple, professional yet affordable.
                                </p>
                                <p>
                                    Today, InvoicePro serves over 50,000 businesses worldwide, from
                                    freelancers to enterprises, helping them streamline their billing
                                    processes and improve their cash flow.
                                </p>
                                <p>
                                    We're just getting started. Our commitment to innovation and
                                    customer success continues to drive every feature we build and
                                    every decision we make.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-2">2020</div>
                                    <div className="text-sm opacity-90">Founded</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-2">50K+</div>
                                    <div className="text-sm opacity-90">Active Users</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-2">Rs. 250M+</div>
                                    <div className="text-sm opacity-90">Processed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-2">25+</div>
                                    <div className="text-sm opacity-90">Countries</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Meet Our Team
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            The passionate people behind InvoicePro, dedicated to helping businesses succeed
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center group">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition duration-300">
                                <span className="text-white text-2xl font-bold">SM</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">Sarah Miller</h3>
                            <p className="text-gray-600 mb-3">Co-Founder & CEO</p>
                            <div className="flex justify-center space-x-2">
                                <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition" />
                                <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition" />
                                <Mail className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition" />
                            </div>
                        </div>

                        <div className="text-center group">
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition duration-300">
                                <span className="text-white text-2xl font-bold">MJ</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">Mike Johnson</h3>
                            <p className="text-gray-600 mb-3">Co-Founder & CTO</p>
                            <div className="flex justify-center space-x-2">
                                <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition" />
                                <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition" />
                                <Mail className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition" />
                            </div>
                        </div>

                        <div className="text-center group">
                            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition duration-300">
                                <span className="text-white text-2xl font-bold">EC</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">Emily Chen</h3>
                            <p className="text-gray-600 mb-3">Head of Product</p>
                            <div className="flex justify-center space-x-2">
                                <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition" />
                                <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition" />
                                <Mail className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition" />
                            </div>
                        </div>

                        <div className="text-center group">
                            <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition duration-300">
                                <span className="text-white text-2xl font-bold">DW</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">David Wilson</h3>
                            <p className="text-gray-600 mb-3">Head of Engineering</p>
                            <div className="flex justify-center space-x-2">
                                <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition" />
                                <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition" />
                                <Mail className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose InvoicePro?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We're more than just invoicing software - we're your partner in business success
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-4">
                                <Award className="h-6 w-6 text-blue-600 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">Industry Leader</h3>
                            </div>
                            <p className="text-gray-600">
                                Recognized by leading industry publications and trusted by thousands of businesses worldwide.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-4">
                                <Shield className="h-6 w-6 text-green-600 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">Bank-Level Security</h3>
                            </div>
                            <p className="text-gray-600">
                                Your data is protected with enterprise-grade security, encryption, and regular backups.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-4">
                                <Clock className="h-6 w-6 text-purple-600 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">24/7 Support</h3>
                            </div>
                            <p className="text-gray-600">
                                Our dedicated support team is always here to help you succeed, whenever you need us.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-4">
                                <TrendingUp className="h-6 w-6 text-red-600 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">Continuous Innovation</h3>
                            </div>
                            <p className="text-gray-600">
                                We're constantly improving our platform based on user feedback and industry trends.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-4">
                                <CheckCircle className="h-6 w-6 text-yellow-600 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">99.9% Uptime</h3>
                            </div>
                            <p className="text-gray-600">
                                Reliable service you can count on, with guaranteed uptime and performance monitoring.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-4">
                                <Users className="h-6 w-6 text-indigo-600 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">Community Driven</h3>
                            </div>
                            <p className="text-gray-600">
                                Join a thriving community of business owners who support and learn from each other.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to join thousands of successful businesses?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Start your free trial today and see why businesses choose InvoicePro
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/signup"
                            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition duration-300"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            href="/contact"
                            className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition duration-300"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}