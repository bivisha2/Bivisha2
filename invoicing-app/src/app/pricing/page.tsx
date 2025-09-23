'use client';

import Link from 'next/link';
import { Check, Star } from 'lucide-react';

export default function Pricing() {
    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choose the plan that fits your business needs. No hidden fees, no surprises.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Starter Plan */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                            <p className="text-gray-600 mb-6">Perfect for freelancers and small businesses</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">$9</span>
                                <span className="text-gray-600">/month</span>
                            </div>
                            <Link
                                href="/signup?plan=starter"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 block text-center"
                            >
                                Start Free Trial
                            </Link>
                        </div>
                        <div className="mt-8">
                            <ul className="space-y-4">
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Up to 50 invoices/month</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>5 clients</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Basic templates</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Email support</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Payment tracking</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Professional Plan */}
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-500 p-8 relative">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                                <Star className="h-4 w-4 mr-1" />
                                Most Popular
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                            <p className="text-gray-600 mb-6">Best for growing businesses</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">$29</span>
                                <span className="text-gray-600">/month</span>
                            </div>
                            <Link
                                href="/signup?plan=professional"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 block text-center"
                            >
                                Start Free Trial
                            </Link>
                        </div>
                        <div className="mt-8">
                            <ul className="space-y-4">
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Unlimited invoices</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Unlimited clients</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Premium templates</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Priority support</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Advanced analytics</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Automated reminders</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Payment processing</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                            <p className="text-gray-600 mb-6">For large organizations with advanced needs</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">$99</span>
                                <span className="text-gray-600">/month</span>
                            </div>
                            <Link
                                href="/contact"
                                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition duration-200 block text-center"
                            >
                                Contact Sales
                            </Link>
                        </div>
                        <div className="mt-8">
                            <ul className="space-y-4">
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Everything in Professional</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Multi-user accounts</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>API access</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Custom integrations</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Dedicated support</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Custom branding</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>SLA guarantee</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Can I change plans anytime?
                            </h3>
                            <p className="text-gray-600">
                                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Is there a free trial?
                            </h3>
                            <p className="text-gray-600">
                                Yes, we offer a 14-day free trial for all plans. No credit card required to start.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                What payment methods do you accept?
                            </h3>
                            <p className="text-gray-600">
                                We accept all major credit cards, PayPal, and bank transfers for annual plans.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Can I cancel anytime?
                            </h3>
                            <p className="text-gray-600">
                                Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center pb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to get started?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of businesses already using InvoicePro
                    </p>
                    <Link
                        href="/signup"
                        className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition duration-200 text-lg font-semibold"
                    >
                        Start Your Free Trial
                    </Link>
                </div>
            </div>
        </div>
    );
}