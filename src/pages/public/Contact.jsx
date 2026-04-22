import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faClock, faPaperPlane, faHeadset, faBuilding, faGraduationCap, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <main className="py-12 px-4 sm:px-6 lg:px-8" style={{ position: 'relative' }}>
            <section>
                <div className="max-w-7xl mx-auto my-20" style={{ position: 'relative', zIndex: 99 }}>
                    <div className="text-center">
                        <div className="p-8 md:p-12 rounded-xl">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight mb-6">
                                Get in Touch
                            </h1>
                            <p className="text-lg justify-self-center my-5 text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">
                                Have questions? We're here to help! Reach out to our team and we'll get back to you as soon as possible.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-5 mb-20 sm:px-8" style={{ position: 'relative', zIndex: 100 }}>
                <div className="grid lg:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                        <p className="text-gray-600 mb-8">
                            We're committed to providing excellent support to our users. Whether you have a question, need help, or want to share feedback, we're here for you.
                        </p>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FontAwesomeIcon icon={faEnvelope} className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Email Us</h3>
                                    <p className="text-gray-600">ridouanelhabib1@gmail.com</p>
                                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FontAwesomeIcon icon={faPhone} className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Call Us</h3>
                                    <p className="text-gray-600">+212 72157 2275</p>
                                    <p className="text-sm text-gray-500">Fri 9AM-6PM EST</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Visit Us</h3>
                                    <p className="text-gray-600">Rue el ouahda hay touama biougra chtouka ait baha</p>
                                    <p className="text-gray-600">Biougra</p>
                                    <p className="text-sm text-gray-500">By appointment only</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FontAwesomeIcon icon={faClock} className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Business Hours</h3>
                                    <p className="text-gray-600">Friday: 9:00 AM - 6:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    placeholder="Ridouane El habib"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    placeholder="ridouanelhabib1@gmail.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                >
                                    <option value="">Select a subject</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="technical">Technical Support</option>
                                    <option value="billing">Billing Question</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="partnership">Partnership Opportunity</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                                    placeholder="Tell us how we can help you..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                            >
                                <FontAwesomeIcon icon={faPaperPlane} />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <section className="py-20 " style={{ position: 'relative', zIndex: 100 }}>
                <div className="max-w-7xl mx-auto px-5 sm:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Our Support Teams</h2>
                        <p className="text-gray-500 max-w-xl mx-auto mt-3">Specialized teams ready to assist you with specific needs.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faHeadset} className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Customer Support</h3>
                            <p className="text-gray-600 mb-4">General questions and account assistance</p>
                            <p className="text-sm text-indigo-600 font-medium">support@l7ajl7bib.com</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faGraduationCap} className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Educator Support</h3>
                            <p className="text-gray-600 mb-4">Teacher tools and classroom integration</p>
                            <p className="text-sm text-indigo-600 font-medium">teachers@l7ajRidouane.com</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faBuilding} className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Enterprise Sales</h3>
                            <p className="text-gray-600 mb-4">Business and institutional solutions</p>
                            <p className="text-sm text-indigo-600 font-medium">sales@L7ajl7bibRidouane.com</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12" style={{ position: 'relative', zIndex: 100 }}>
                <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
                    <div className="bg-indigo-50 p-8 rounded-2xl">
                        <h3 className="text-2xl font-bold mb-4">Have a Quick Question?</h3>
                        <p className="text-gray-600 mb-6">
                            Check out our FAQ section for answers to commonly asked questions.
                        </p>
                        <a 
                            href="/faq" 
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                        >
                            Visit FAQ
                            <FontAwesomeIcon icon={faArrowRight} />
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Contact;
