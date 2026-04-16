import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faChevronDown, faChevronUp, faSearch, faUser, faCreditCard, faGraduationCap, faMobileAlt, faShieldAlt, faClock, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const FAQ = () => {
    const [activeCategory, setActiveCategory] = useState('general');
    const [expandedItems, setExpandedItems] = useState({});

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const categories = [
        { id: 'general', name: 'General', icon: faQuestionCircle },
        { id: 'account', name: 'Account', icon: faUser },
        { id: 'billing', name: 'Billing', icon: faCreditCard },
        { id: 'learning', name: 'Learning', icon: faGraduationCap },
        { id: 'technical', name: 'Technical', icon: faMobileAlt },
        { id: 'security', name: 'Security', icon: faShieldAlt }
    ];

    const faqData = {
        general: [
            {
                id: 'g1',
                question: 'What is Play2LearnLearning?',
                answer: 'Play2LearnLearning is an interactive educational platform that makes learning fun through engaging quizzes, gamification, and personalized learning experiences across various subjects.'
            },
            {
                id: 'g2',
                question: 'Is Play2LearnLearning free to use?',
                answer: 'Yes! We offer a comprehensive free plan with access to 500+ quizzes, basic progress tracking, and mobile app access. Premium features are available for users who want advanced analytics and unlimited content.'
            },
            {
                id: 'g3',
                question: 'What subjects are available?',
                answer: 'We cover 20+ subjects including Science & Nature, Programming, History & Politics, Entertainment, Mathematics, Literature, Geography, and many more. New content is added weekly.'
            },
            {
                id: 'g4',
                question: 'How do I get started?',
                answer: 'Simply sign up for a free account, choose your interests, and start taking quizzes immediately. No credit card required for the free plan.'
            }
        ],
        account: [
            {
                id: 'a1',
                question: 'How do I create an account?',
                answer: 'Click the "Sign Up" button on our homepage, enter your email address and create a password. You\'ll receive a confirmation email to verify your account.'
            },
            {
                id: 'a2',
                question: 'Can I change my username?',
                answer: 'Yes, you can change your username and other profile information from your account settings. Note that some changes may affect your progress tracking.'
            },
            {
                id: 'a3',
                question: 'How do I reset my password?',
                answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you instructions to reset your password.'
            },
            {
                id: 'a4',
                question: 'Can I have multiple accounts?',
                answer: 'We recommend one account per user to maintain accurate progress tracking. If you need separate accounts for different purposes, please contact our support team.'
            }
        ],
        billing: [
            {
                id: 'b1',
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and various international payment methods depending on your location.'
            },
            {
                id: 'b2',
                question: 'Can I cancel my subscription anytime?',
                answer: 'Yes, you can cancel your Premium subscription at any time. You\'ll continue to have access to Premium features until the end of your current billing period.'
            },
            {
                id: 'b3',
                question: 'Do you offer refunds?',
                answer: 'We offer a 30-day money-back guarantee for new Premium subscriptions. If you\'re not satisfied, contact our support team within 30 days for a full refund.'
            },
            {
                id: 'b4',
                question: 'Are there discounts for students or teachers?',
                answer: 'Yes! We offer special educational discounts for students and teachers. Contact our education team at teachers@play2learnlearning.com for more information.'
            }
        ],
        learning: [
            {
                id: 'l1',
                question: 'How is my progress tracked?',
                answer: 'We track your progress through quiz scores, completion rates, learning streaks, and skill improvements. You can view detailed analytics in your dashboard.'
            },
            {
                id: 'l2',
                question: 'Can I compete with friends?',
                answer: 'Absolutely! You can create study groups, challenge friends to quizzes, and compete on leaderboards. Premium users get access to advanced team features.'
            },
            {
                id: 'l3',
                question: 'Are the quizzes suitable for all ages?',
                answer: 'Our content is designed for learners aged 13 and above. We have difficulty levels from beginner to advanced, and you can filter content by age appropriateness.'
            },
            {
                id: 'l4',
                question: 'How often is new content added?',
                answer: 'We add new quizzes and update existing content weekly. Our team of educators and subject matter experts ensures all content is current and accurate.'
            }
        ],
        technical: [
            {
                id: 't1',
                question: 'What devices are supported?',
                answer: 'Play2LearnLearning works on all modern web browsers (Chrome, Firefox, Safari, Edge). We also have dedicated iOS and Android apps for mobile learning.'
            },
            {
                id: 't2',
                question: 'Can I learn offline?',
                answer: 'Premium users can download quizzes for offline learning. Your progress will sync when you reconnect to the internet.'
            },
            {
                id: 't3',
                question: 'Is there an API available?',
                answer: 'Yes, Enterprise customers get access to our API for integration with learning management systems and custom applications.'
            },
            {
                id: 't4',
                question: 'What are the system requirements?',
                answer: 'For web: Modern browser with JavaScript enabled. For mobile: iOS 12+ or Android 8+. Minimum 2GB RAM recommended for optimal performance.'
            }
        ],
        security: [
            {
                id: 's1',
                question: 'How is my data protected?',
                answer: 'We use industry-standard encryption (AES-256) for data storage and SSL/TLS for data transmission. Your data is stored in secure, SOC 2 compliant data centers.'
            },
            {
                id: 's2',
                question: 'Is my information shared with third parties?',
                answer: 'We never sell your personal information. We only share aggregated, anonymized data for research purposes and with your explicit consent for integrations.'
            },
            {
                id: 's3',
                question: 'How can I delete my account?',
                answer: 'You can delete your account from your account settings. This will permanently remove all your data from our systems within 30 days.'
            },
            {
                id: 's4',
                question: 'Is the platform COPPA compliant?',
                answer: 'Yes, we are COPPA compliant and take extra precautions for users under 13. We do not knowingly collect personal information from children under 13 without parental consent.'
            }
        ]
    };

    return (
        <main className="py-12 px-4 sm:px-6 lg:px-8" style={{ position: 'relative' }}>
            <section>
                <div className="max-w-7xl mx-auto my-20" style={{ position: 'relative', zIndex: 99 }}>
                    <div className="text-center">
                        <div className="p-8 md:p-12 rounded-xl">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight mb-6">
                                Frequently Asked Questions
                            </h1>
                            <p className="text-lg justify-self-center my-5 text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">
                                Find answers to common questions about Play2LearnLearning. Can't find what you're looking for? Contact our support team.
                            </p>
                            
                            <div className="max-w-2xl mx-auto mt-8">
                                <div className="relative">
                                    <FontAwesomeIcon 
                                        icon={faSearch} 
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search for answers..."
                                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-5 mb-8 sm:px-8" style={{ position: 'relative', zIndex: 100 }}>
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
                                activeCategory === category.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            <FontAwesomeIcon icon={category.icon} />
                            {category.name}
                        </button>
                    ))}
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-5 sm:px-8" style={{ position: 'relative', zIndex: 100 }}>
                <div className="space-y-4">
                    {faqData[activeCategory].map(item => (
                        <div 
                            key={item.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                        >
                            <button
                                onClick={() => toggleExpand(item.id)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition"
                            >
                                <h3 className="font-semibold text-gray-900 pr-4">{item.question}</h3>
                                <FontAwesomeIcon 
                                    icon={expandedItems[item.id] ? faChevronUp : faChevronDown}
                                    className="text-gray-400 w-5 h-5 flex-shrink-0"
                                />
                            </button>
                            {expandedItems[item.id] && (
                                <div className="px-6 pb-4">
                                    <div className="border-t border-gray-100 pt-4">
                                        <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-20" style={{ position: 'relative', zIndex: 100 }}>
                <div className="max-w-7xl mx-auto px-5 sm:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Still Need Help?</h2>
                        <p className="text-gray-500 max-w-xl mx-auto mt-3">Our support team is here to assist you.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faEnvelope} className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Email Support</h3>
                            <p className="text-gray-600 mb-4">Get help via email</p>
                            <p className="text-sm text-indigo-600 font-medium">24-48 hour response</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faClock} className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                            <p className="text-gray-600 mb-4">Chat with our team</p>
                            <p className="text-sm text-indigo-600 font-medium">Mon-Fri 9AM-6PM EST</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faGraduationCap} className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Help Center</h3>
                            <p className="text-gray-600 mb-4">Browse our guides</p>
                            <p className="text-sm text-indigo-600 font-medium">Available 24/7</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default FAQ;

