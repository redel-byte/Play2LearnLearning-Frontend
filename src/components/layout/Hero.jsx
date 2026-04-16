import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Entertainment from '../../assets/Entertainment.jpg';
import History from '../../assets/History.jpg';
import Programming from '../../assets/Programming.jpg';
import science from '../../assets/Science.jpeg';
import Card from '../ui/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faCheckCircle, faFlask, faCode, faLandmark, faMusic, faArrowRight, faChartBar, faUsers, faShieldAlt, faQuoteLeft, faStar } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { getAuthStorageEventName, getStoredUser } from '../../api/userManagment';

const HOME_COMMENTS_STORAGE_KEY = 'play2learn-home-comments';

const DEFAULT_TESTIMONIALS = [
    {
        id: 'default-jd',
        author: 'Jessica Diaz',
        role: 'High School Student',
        initials: 'JD',
        comment: 'QuizMaster turned my boring revision into a fun game. I improved my grades by 20%!',
    },
    {
        id: 'default-mc',
        author: 'Michael Chen',
        role: 'HR Manager',
        initials: 'MC',
        comment: 'Perfect for team building. My colleagues compete every Friday - great engagement tool.',
    },
    {
        id: 'default-sr',
        author: 'Sarah Rodriguez',
        role: 'Middle School Teacher',
        initials: 'SR',
        comment: 'As a teacher, I use QuizMaster for live classroom quizzes. The analytics are a lifesaver.',
    },
];

const getRoleLabel = (user) => {
    if (!user) {
        return 'Learner';
    }

    if (user.is_admin) {
        return 'Platform Admin';
    }

    if (user.is_teacher) {
        return 'Teacher';
    }

    return 'Learner';
};

const getDisplayName = (user) => {
    if (!user) {
        return 'Guest User';
    }

    return user.full_name || [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email || 'Play2Learn User';
};

const getInitials = (name) => (
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('') || 'PL'
);

const readStoredComments = () => {
    try {
        const raw = localStorage.getItem(HOME_COMMENTS_STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const Hero = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => getStoredUser()?.user || null);
    const [commentText, setCommentText] = useState('');
    const [userComments, setUserComments] = useState(() => readStoredComments());

    useEffect(() => {
        const syncUserAndComments = () => {
            setUser(getStoredUser()?.user || null);
            setUserComments(readStoredComments());
        };

        const authEventName = getAuthStorageEventName();
        window.addEventListener(authEventName, syncUserAndComments);
        window.addEventListener('storage', syncUserAndComments);

        return () => {
            window.removeEventListener(authEventName, syncUserAndComments);
            window.removeEventListener('storage', syncUserAndComments);
        };
    }, []);

    const testimonials = useMemo(
        () => [...userComments, ...DEFAULT_TESTIMONIALS],
        [userComments],
    );

    const persistComments = (nextComments) => {
        setUserComments(nextComments);
        localStorage.setItem(HOME_COMMENTS_STORAGE_KEY, JSON.stringify(nextComments));
    };

    const handleCommentSubmit = (event) => {
        event.preventDefault();

        if (!user) {
            toast.error('Please sign in before sharing your comment');
            navigate('/auth/login');
            return;
        }

        const trimmedComment = commentText.trim();

        if (trimmedComment.length < 12) {
            toast.error('Please write at least 12 characters so your comment is meaningful');
            return;
        }

        const author = getDisplayName(user);
        const nextComment = {
            id: `comment-${Date.now()}`,
            author,
            role: getRoleLabel(user),
            initials: getInitials(author),
            comment: trimmedComment,
        };

        const nextComments = [nextComment, ...userComments].slice(0, 12);
        persistComments(nextComments);
        setCommentText('');
        toast.success('Your comment is now part of the homepage loop');
    };

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

            <section className="py-20  w-full" style={{ position: 'relative', zIndex: 100 }} >
                <div className="max-w-7xl mx-auto px-5 sm:px-8">
                    <div className="text-center mb-10">
                        <FontAwesomeIcon icon={faQuoteLeft} className="text-indigo-300 text-3xl" />
                        <h2 className="text-3xl font-bold mt-2">Loved by learners worldwide</h2>
                        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                            Add your own comment and watch it slide through the same loop as the rest of the community.
                        </p>
                    </div>

                    <div className="grid xl:grid-cols-[1.25fr_0.75fr] gap-8 items-start mb-10">
                        <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-cyan-50 p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">Community Loop</p>
                                    <h3 className="text-2xl font-bold text-slate-900 mt-2">Share what Play2Learn feels like for you</h3>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 rounded-full bg-white px-4 py-2 border border-indigo-100 text-sm text-slate-600">
                                    <FontAwesomeIcon icon={faUsers} className="text-indigo-500" />
                                    {testimonials.length} comments in rotation
                                </div>
                            </div>

                            <form onSubmit={handleCommentSubmit} className="space-y-4">
                                <div className="rounded-2xl bg-white p-4 border border-indigo-100">
                                    <div className="flex items-center justify-between gap-4 mb-3">
                                        <div>
                                            <p className="font-semibold text-slate-900">{user ? getDisplayName(user) : 'Sign in to comment'}</p>
                                            <p className="text-sm text-slate-500">{user ? getRoleLabel(user) : 'Your comment will appear here once you sign in'}</p>
                                        </div>
                                        <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                                            {getInitials(user ? getDisplayName(user) : 'Play2Learn')}
                                        </div>
                                    </div>

                                    <textarea
                                        value={commentText}
                                        onChange={(event) => setCommentText(event.target.value)}
                                        rows={4}
                                        maxLength={220}
                                        placeholder="Tell other learners what you enjoy about quizzes, progress tracking, or your classroom experience..."
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    />

                                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <p className="text-sm text-slate-500">
                                            {user ? `${commentText.trim().length}/220 characters` : 'Sign in to publish your comment in the homepage loop'}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            {!user && (
                                                <Link
                                                    to="/auth/login"
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
                                                >
                                                    Sign in
                                                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                                                </Link>
                                            )}
                                            <button
                                                type="submit"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                                            >
                                                Publish comment
                                                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Latest addition</p>
                            <div className="mt-4 rounded-2xl bg-slate-50 p-5 border border-slate-200 min-h-[220px]">
                                <div className="flex text-yellow-400 text-sm mb-3 gap-1">
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                </div>
                                <p className="text-slate-700 leading-relaxed">
                                    "{testimonials[0]?.comment}"
                                </p>
                                <div className="flex items-center gap-3 mt-5">
                                    <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700">
                                        {testimonials[0]?.initials}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{testimonials[0]?.author}</p>
                                        <p className="text-xs text-slate-500">{testimonials[0]?.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl  w-full">
                        <div className="flex animate-scroll">
                            <div className="flex gap-8 min-w-full">
                                {testimonials.map((testimonial) => (
                                    <div key={`primary-${testimonial.id}`} className="bg-white p-6 rounded-2xl shadow-sm flex-shrink-0 w-80 border border-slate-100">
                                        <div className="flex text-yellow-400 text-sm mb-3 gap-1">
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                        </div>
                                        <p className="text-gray-600">"{testimonial.comment}"</p>
                                        <div className="flex items-center gap-3 mt-5">
                                            <div className="w-9 h-9 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700">
                                                {testimonial.initials}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{testimonial.author}</p>
                                                <p className="text-xs text-gray-400">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-8 min-w-full">
                                {testimonials.map((testimonial) => (
                                    <div key={`duplicate-${testimonial.id}`} className="bg-white p-6 rounded-2xl shadow-sm flex-shrink-0 w-80 border border-slate-100">
                                        <div className="flex text-yellow-400 text-sm mb-3 gap-1">
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                        </div>
                                        <p className="text-gray-600">"{testimonial.comment}"</p>
                                        <div className="flex items-center gap-3 mt-5">
                                            <div className="w-9 h-9 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700">
                                                {testimonial.initials}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{testimonial.author}</p>
                                                <p className="text-xs text-gray-400">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main >
    );
};

export default Hero;

