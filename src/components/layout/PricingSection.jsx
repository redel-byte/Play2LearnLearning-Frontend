import React from 'react';

const PricingSection = () => {
    return (
        <section className="py-20" style={{ position: 'relative', zIndex: 100 }}>
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
                    <p className="text-gray-500 max-w-xl mx-auto mt-3">Choose the plan that works best for you.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <h3 className="text-xl font-bold mb-2">Free</h3>
                        <div className="text-3xl font-bold mb-4">$0<span className="text-lg text-gray-500">/month</span></div>
                        <ul className="text-gray-600 space-y-2 mb-6">
                            <li>• 500+ free quizzes</li>
                            <li>• Basic progress tracking</li>
                            <li>• Community support</li>
                            <li>• Mobile app access</li>
                        </ul>
                        <button className="w-full bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition">
                            Get Started
                        </button>
                    </div>
                    <div className="bg-indigo-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform scale-105">
                        <div className="bg-yellow-400 text-indigo-900 text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">POPULAR</div>
                        <h3 className="text-xl font-bold mb-2">Premium</h3>
                        <div className="text-3xl font-bold mb-4">$9.99<span className="text-lg opacity-75">/month</span></div>
                        <ul className="space-y-2 mb-6">
                            <li>• Everything in Free</li>
                            <li>• Unlimited quizzes</li>
                            <li>• Advanced analytics</li>
                            <li>• Priority support</li>
                            <li>• Custom certificates</li>
                        </ul>
                        <button className="w-full bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
                            Start Free Trial
                        </button>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                        <div className="text-3xl font-bold mb-4">Custom</div>
                        <ul className="text-gray-600 space-y-2 mb-6">
                            <li>• Everything in Premium</li>
                            <li>• Custom branding</li>
                            <li>• Advanced admin controls</li>
                            <li>• Dedicated support</li>
                            <li>• API access</li>
                        </ul>
                        <button className="w-full bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
