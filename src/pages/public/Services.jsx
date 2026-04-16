import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faChalkboardTeacher, faUsers, faChartLine, faMobileAlt, faCertificate, faClock, faGlobe, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import PricingSection from '../../components/layout/PricingSection';

const Services = () => {
    return (
        <main className="py-12 px-4 sm:px-6 lg:px-8" style={{ position: 'relative' }}>
            <section>
                <div className="max-w-7xl mx-auto my-20" style={{ position: 'relative', zIndex: 99 }}>
                    <div className="text-center">
                        <div className="p-8 md:p-12 rounded-xl">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight mb-6">
                                Our Services
                            </h1>
                            <p className="text-lg justify-self-center my-5 text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">
                                Comprehensive learning solutions designed to make education engaging, effective, and accessible for everyone.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-5 mb-20 sm:px-8 py-20" style={{ position: 'relative', zIndex: 100 }}>
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">What We Offer</h2>
                    <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Tailored learning experiences for students, educators, and organizations.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition">
                            <FontAwesomeIcon icon={faGraduationCap} className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Interactive Quizzes</h3>
                        <p className="text-gray-600 mb-4">Engaging quizzes across 20+ subjects with instant feedback and detailed explanations.</p>
                        <ul className="text-sm text-gray-500 space-y-1">
                            <li>• Multiple question formats</li>
                            <li>• Adaptive difficulty</li>
                            <li>• Real-time scoring</li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
                            <FontAwesomeIcon icon={faChalkboardTeacher} className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Teacher Tools</h3>
                        <p className="text-gray-600 mb-4">Comprehensive dashboard for educators to create, manage, and track student progress.</p>
                        <ul className="text-sm text-gray-500 space-y-1">
                            <li>• Custom quiz creation</li>
                            <li>• Class management</li>
                            <li>• Performance analytics</li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
                            <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Team Learning</h3>
                        <p className="text-gray-600 mb-4">Collaborative learning experiences with group challenges and team competitions.</p>
                        <ul className="text-sm text-gray-500 space-y-1">
                            <li>• Team challenges</li>
                            <li>• Leaderboards</li>
                            <li>• Group progress tracking</li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
                            <FontAwesomeIcon icon={faChartLine} className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Progress Analytics</h3>
                        <p className="text-gray-600 mb-4">Detailed insights and analytics to track learning progress and identify improvement areas.</p>
                        <ul className="text-sm text-gray-500 space-y-1">
                            <li>• Performance metrics</li>
                            <li>• Learning streaks</li>
                            <li>• Progress reports</li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition">
                            <FontAwesomeIcon icon={faMobileAlt} className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Mobile Learning</h3>
                        <p className="text-gray-600 mb-4">Learn on the go with our mobile-optimized platform and dedicated apps.</p>
                        <ul className="text-sm text-gray-500 space-y-1">
                            <li>• iOS & Android apps</li>
                            <li>• Offline mode</li>
                            <li>• Sync across devices</li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition">
                            <FontAwesomeIcon icon={faCertificate} className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Certifications</h3>
                        <p className="text-gray-600 mb-4">Earn certificates and badges to showcase your achievements and knowledge.</p>
                        <ul className="text-sm text-gray-500 space-y-1">
                            <li>• Course completion certificates</li>
                            <li>• Skill badges</li>
                            <li>• Shareable credentials</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="py-20 " style={{ position: 'relative', zIndex: 100 }}>
                <div className="max-w-7xl mx-auto px-5 sm:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Platform Features</h2>
                        <p className="text-gray-500 max-w-xl mx-auto mt-3">Powerful features that enhance your learning experience.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faClock} className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">24/7 Access</h3>
                            <p className="text-gray-600">Learn anytime, anywhere with our always-available platform.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faGlobe} className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Global Community</h3>
                            <p className="text-gray-600">Connect with learners from around the world.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faShieldAlt} className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Safe & Secure</h3>
                            <p className="text-gray-600">Your data and privacy are our top priorities.</p>
                        </div>
                    </div>
                </div>
            </section>

            <PricingSection />
        </main>
    );
};

export default Services;

