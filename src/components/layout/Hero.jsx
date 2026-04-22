import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Entertainment from '../../assets/Entertainment.jpg';
import History from '../../assets/History.jpg';
import Programming from '../../assets/Programming.jpg';
import science from '../../assets/Science.jpeg';
import Card from '../ui/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBolt,
    faCheckCircle,
    faFlask,
    faCode,
    faLandmark,
    faMusic,
    faArrowRight,
    faChartBar,
    faUsers,
    faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <main className="py-12 px-4 sm:px-6 lg:px-8" style={{ position: 'relative' }}>
            <section>
                <div className="max-w-7xl mx-auto my-20" style={{ position: 'relative', zIndex: 99 }}>
                    <div className="text-center">
                        <div className="p-8 md:p-12 rounded-xl">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blak leading-tight mb-6">
                                Education should be something you experience, not just something you watch.
                            </h1>
                            <p className="text-lg justify-self-center my-5 text-gray-500 mt-6 max-w-lg leading-relaxed">
                                Join millions of learners who sharpen their skills with interactive quizzes, instant feedback, and global rankings.
                            </p>
                            <Link to="/auth/register" className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-full text-lg hover:bg-blue-50 transition duration-300 cursor-pointer shadow-md">
                                <FontAwesomeIcon icon={faBolt} /> Start a quiz now
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center justify-self-center mb-5 gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1"><FontAwesomeIcon icon={faCheckCircle} className="text-indigo-500" /> No credit card</div>
                        <div className="flex items-center gap-1"><FontAwesomeIcon icon={faCheckCircle} className="text-indigo-500" /> 500+ free quizzes</div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-5 mb-20 sm:px-8 py-20" style={{ position: 'relative', zIndex: 100 }}>
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Why challenge yourself with QuizMaster?</h2>
                    <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Everything you need to learn faster and have fun doing it.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition">
                            <FontAwesomeIcon icon={faChartBar} className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold">Track your progress</h3>
                        <p className="text-gray-500 mt-2">Detailed analytics, streaks, and performance insights to see your improvement over time.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition">
                            <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold">Global leaderboards</h3>
                        <p className="text-gray-500 mt-2">Compete with friends or learners worldwide and earn badges & certificates.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition">
                            <FontAwesomeIcon icon={faShieldAlt} className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold">Instant feedback</h3>
                        <p className="text-gray-500 mt-2">Get detailed explanations after each question  turn mistakes into learning moments.</p>
                    </div>
                </div>
            </section>

            <section className="py-20" style={{ position: 'relative', zIndex: 100 }}>
                <div className="max-w-7xl mx-auto px-5 sm:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold mt-2">Find your perfect quiz</h2>
                        <p className="text-gray-500 max-w-xl mx-auto mt-3">From science and history to pop culture and coding — 20+ topics updated weekly.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card
                            buttonText="Explore quizzes"
                            onButtonClick={() => window.location.href = '/library'}
                            className="overflow-hidden relative group"
                        >
                            <div className="absolute inset-0">
                                <img src={science} alt="Science & Nature" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            <div className="relative z-10 p-6">
                                <div className="flex items-center justify-center mb-4">
                                    <FontAwesomeIcon icon={faFlask} className="text-white text-4xl" />
                                </div>
                                <h3 className="text-xl font-bold text-white text-center mb-2">Science & Nature</h3>
                                <p className="text-white/90 text-sm text-center">Physics, biology, chemistry - challenge your inner scientist.</p>
                            </div>
                        </Card>

                        <Card
                            buttonText="Explore quizzes"
                            onButtonClick={() => window.location.href = '/library'}
                            className="overflow-hidden relative group"
                        >
                            <div className="absolute inset-0">
                                <img src={Programming} alt="Programming" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            <div className="relative z-10 p-6">
                                <div className="flex items-center justify-center mb-4">
                                    <FontAwesomeIcon icon={faCode} className="text-white text-4xl" />
                                </div>
                                <h3 className="text-xl font-bold text-white text-center mb-2">Programming</h3>
                                <p className="text-white/90 text-sm text-center">Python, JavaScript, algorithms - test your dev skills.</p>
                            </div>
                        </Card>

                        <Card
                            buttonText="Explore quizzes"
                            onButtonClick={() => window.location.href = '/library'}
                            className="overflow-hidden relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500">
                                <img src={History} alt="Programming" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            </div>
                            <div className="relative z-10 p-6">
                                <div className="flex items-center justify-center mb-4">
                                    <FontAwesomeIcon icon={faLandmark} className="text-white text-4xl" />
                                </div>
                                <h3 className="text-xl font-bold text-white text-center mb-2">History & Politics</h3>
                                <p className="text-white/90 text-sm text-center">From ancient empires to modern events - time travel.</p>
                            </div>
                        </Card>

                        <Card
                            buttonText="Explore quizzes"
                            onButtonClick={() => window.location.href = '/library'}
                            className="overflow-hidden relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-500">
                                <img src={Entertainment} alt="Programming" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            </div>
                            <div className="relative z-10 p-6">
                                <div className="flex items-center justify-center mb-4">
                                    <FontAwesomeIcon icon={faMusic} className="text-white text-4xl" />
                                </div>
                                <h3 className="text-xl font-bold text-white text-center mb-2">Entertainment</h3>
                                <p className="text-white/90 text-sm text-center">Movies, music, memes - pop culture trivia night.</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="py-20 w-full" style={{ position: 'relative', zIndex: 100 }}>
                <div className="max-w-6xl mx-auto px-5 sm:px-8">
                    <div className="overflow-hidden rounded-[2rem] border border-indigo-100 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-xl">
                        <div className="grid gap-10 px-8 py-12 md:grid-cols-[1.3fr_0.7fr] md:px-12 md:py-14">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">Call To Action</p>
                                <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                                    Ready to turn learning into a real challenge?
                                </h2>
                                <p className="mt-4 max-w-2xl text-base leading-7 text-white/85 md:text-lg">
                                    Create a quiz, invite your learners, and start building a more interactive classroom in minutes.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <Link
                                        to="/create-quiz"
                                        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50"
                                    >
                                        Create a quiz
                                        <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/library')}
                                        className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                                    >
                                        Browse quiz library
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
                                <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                                    <p className="text-3xl font-bold">500+</p>
                                    <p className="mt-2 text-sm text-white/75">Ready-made quizzes to launch faster</p>
                                </div>
                                <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                                    <p className="text-3xl font-bold">Live</p>
                                    <p className="mt-2 text-sm text-white/75">Run classroom sessions with instant results</p>
                                </div>
                                <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                                    <p className="text-3xl font-bold">Fast</p>
                                    <p className="mt-2 text-sm text-white/75">Start from scratch or duplicate a quiz in seconds</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main >
    );
};

export default Hero;
