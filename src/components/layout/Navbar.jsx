import React, { useState, useRef, useEffect } from 'react';
import P2l from '../../assets/P2L.webp'
import Button from '../../components/ui/Button'
import axios from 'axios';
import toast from 'react-hot-toast';

const Navbar = () => {
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");
    const userData = JSON.parse(user);
    const [isLoggedIn, setIsLoggedIn] = useState(!!user);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const logout = async () => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
        try {
            const res = await axios.post("http://localhost:8000/api/logout", {}, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (res.status === 200) {
                localStorage.clear();
                sessionStorage.clear();
                toast.success("Logout with Seccuss")
            }
            setIsLoggedIn(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Logout failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-white shadow-md px-6 ">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="text-2xl font-bold text-blue-600">
                    <img className="w-20" src={P2l} alt="The platform logo" />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <a className="text-gray-700 hover:text-blue-600 font-medium transition duration-300" href="#">Plan</a>
                    <a className="text-gray-700 hover:text-blue-600 font-medium transition duration-300" href="#">Library</a>
                    <a className="text-gray-700 hover:text-blue-600 font-medium transition duration-300" href="#">Join Quiz</a>
                    <a className="text-gray-700 hover:text-blue-600 font-medium transition duration-300" href="#">Create Quiz</a>
                </div>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center space-x-4">
                    {!isLoggedIn ? (
                        <>
                            <a className="text-gray-700 hover:text-blue-600 font-medium transition duration-300" href="/login">Login</a>
                            <a className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 font-medium" href="/register">Register</a>
                        </>
                    ) : (
                        <div className="relative z-999" ref={dropdownRef}>
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition duration-300 focus:outline-none"
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {userData?.user.first_name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden lg:block">{userData?.name || userData?.email || 'User'}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <p className="text-sm font-semibold text-gray-900">{userData?.user.first_name}</p>
                                        <p className="text-xs text-gray-500">{userData?.email || ''}</p>
                                    </div>
                                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200">
                                        My Profile
                                    </a>
                                    <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200">
                                        Settings
                                    </a>
                                    <a href="/my-quizzes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200">
                                        My Quizzes
                                    </a>
                                    <div>
                                        <Button
                                            onClick={logout}
                                            variant="danger"
                                            textContent="Logout"
                                            loading={loading}
                                            className="w-full text-left text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-col space-y-4">
                        <a className="text-gray-700 hover:text-blue-600 font-medium transition duration-300" href="#">Plan</a>
                        <a className="text-gray-700 hover:text-blue-600 font-medium transition duration-300" href="#">Library</a>
                        <a className="text-gray-700 hover:text-blue-600 font-medium transition duration-300" href="#">Join Quiz</a>
                        <a className="text-gray-700 hover:text-blue-600 font-medium transition duration-300" href="#">Create Quiz</a>

                        <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                            {!isLoggedIn ? (
                                <>
                                    <a className="text-gray-700 hover:text-blue-600 font-medium transition duration-300" href="/login">Login</a>
                                    <a className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 font-medium text-center" href="/register">Register</a>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center space-x-3 px-2 py-2 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {userData?.name?.charAt(0).toUpperCase() || userData?.email?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{userData?.name || 'User'}</p>
                                            <p className="text-xs text-gray-500">{userData?.email || ''}</p>
                                        </div>
                                    </div>
                                    <a href="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 pl-2">
                                        My Profile
                                    </a>
                                    <a href="/settings" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 pl-2">
                                        Settings
                                    </a>
                                    <a href="/my-quizzes" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 pl-2">
                                        My Quizzes
                                    </a>
                                    <Button
                                        onClick={logout}
                                        variant='primary'
                                        textContent="Logout"
                                        loading={loading}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;